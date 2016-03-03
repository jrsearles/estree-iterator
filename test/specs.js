import * as esi from "../index";
import * as acorn from "acorn";
import { expect } from "chai";

describe("Estree", () => {
	it("should indicates blocks are blocks", () => {
		let code = `
		{
			let empty = "";
		}`;
		
		let count = 0;
		
		let ast = acorn.parse(code, {ecmaVersion: 6});
    let visitors = esi.extendVisitors({
      BlockStatement: (node) => { expect(node.isBlock()).to.be.true; count++; }
    });
    
		esi.walk(ast, visitors);
		
		expect(count).to.equal(1);
	});
		
	it("should be true for directive", () => {
		let code = "'use strict';";
		let ast = acorn.parse(code, {ecmaVersion: 6});
		
		esi.walk(ast, esi.extendVisitors({
			Program: (node) => expect(node.getDirectives()[0]).to.equal("use strict")
		}));
	});
	
	it("should set the parent context", () => {
		let code = "if (true) { doSomething(); }";
		let ast = acorn.parse(code);
		let visitors = esi.extendVisitors({
			Program: (node) => expect(node.getParent()).to.be.null,
			IfStatement: (node) => expect(node.getParent().isProgram()).to.be.true,
			CallExpression: (node) => expect(node.getParent().type).to.equal("ExpressionStatement")
		});
    
		esi.walk(ast, visitors);
	});
	
	it("should return the bindings for a function", () => {
		let code = "function a() {var b,c;\nfunction d(){}\n}";
		let ast = acorn.parse(code);
		let outer = true;
		
		esi.walk(ast, esi.extendVisitors({
			FunctionDeclaration: (node) => {
				if (outer) {
					let bindings = node.getBindings();
					expect(bindings.length).to.equal(3);
					expect(bindings[0].id.name).to.equal("b");
					
					outer = false;
				}
			}
		}));
	});
	
	it("should return own bindings for function scope", () => {
		let code = "function a() {var b,c;\nfunction d(){}\n}";
		let ast = acorn.parse(code);
		let outer = true;
		
		esi.walk(ast, esi.extendVisitors({
			FunctionDeclaration: (node) => {
				if (outer) {
					let bindings = node.getBindings();
					expect(bindings.length).to.equal(3);
					expect(bindings[0].id.name).to.equal("b");
					
					outer = false;
				}
			},
			
			BlockStatement: (node) => expect(node.bindings.length).to.equal(0)
		}));
	});1
		
	it("should return own bindings for block scope let/const", () => {
		let code = "var a = 1;\n{\nlet b=2,c=3;\n}";
		let ast = acorn.parse(code, { ecmaVersion: 6 });

		esi.walk(ast, esi.extendVisitors({
			FunctionDeclaration: (node) => expect(node.getBindings().length).to.equal(1),
			BlockStatement: (node) => {
				expect(node.getBindings().length).to.equal(2);
			}
		}));
	});
	
	// it("should indicate a block with `let` variables are scopable", function () {
	// 	let code = "{\nlet x = 1;\n}";
	// 	let ast = acorn.parse(code, {ecmaVersion: 6});
		
	// 	esi.walk(ast, {
	// 		BlockStatement: (node) => expect(node.isScopable()).to.be.true
	// 	});
	// });
	
	// it("should indicate a block without `let` or `const` is not scopable", function () {
	// 	let code = "{\nvar x = 1;\n}";
	// 	let ast = acorn.parse(code);
		
	// 	esi.walk(ast, {
	// 		BlockStatement: (node) => expect(node.isScopable()).to.be.false
	// 	});
	// });
	
	describe("With step", () => {
		it("should only iterate over the top level", () => {
			let code = "var a = 1; function b () { a = 2; }\nb();";
			let ast = acorn.parse(code);
			let count = 0;
			
			let counter = () => count++;
			esi.step(ast, esi.extendVisitors({
				"Program": counter,
				"BlockStatement": counter,
				"VariableDeclarator": counter,
				"FunctionDeclaration": counter
			}));
			
			expect(count).to.equal(1);
		});
		
		it("should allow iteration to resume", () => {
			let code = "var a = 1; function b () { a = 2; }\nb();";
			let ast = acorn.parse(code);
			let count = 0;
			
			let counter = (node, state, next) => { count++; next(); };
			esi.step(ast, esi.extendVisitors({
				"Program": function (node, state, next) {
					count++;
					
					for (let i = 0, ln = node.body.length; i < ln; i++) {
						next(node.body[i], state);
					}
					// node.body.forEach(child => w(child, state, w).next());
				},
				"VariableDeclaration": counter,
				"ExpressionStatement": counter,
				"CallExpression": counter
			}));
			
      
			// let {done} = stepper.next();
			// while (!done) {
			// 	({done} = stepper.next());
			// }
			
			expect(count).to.be.above(1);
		});
	});
});