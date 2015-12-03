import * as iterator from "../index";
import * as acorn from "acorn";
import {expect} from "chai";

describe("Estree", () => {
	it("should indicates blocks are blocks", () => {
		let code = `
		{
			let empty = "";
		}`;
		
		let ast = acorn.parse(code, {ecmaVersion: 6});
		let count = 0;
		
		iterator.walk(ast, {
			BlockStatement: (node) => { expect(node.isBlock()).to.be.true; count++; }
		});
		
		expect(count).to.equal(1);
	});
		
	it("should be true for directive", () => {
		let code = "'use strict';";
		let ast = acorn.parse(code, {ecmaVersion: 6});
		
		iterator.walk(ast, {
			Program: (node) => expect(node.directives[0]).to.equal("use strict")
		});
	});
	
	it("should set the parent context", () => {
		let code = "if (true) { doSomething(); }";
		let ast = acorn.parse(code);
		
		iterator.walk(ast, {
			Program: (node) => expect(node._parent).to.be.undefined,
			IfStatement: (node) => expect(node._parent.isProgram()).to.be.true,
			CallExpression: (node) => expect(node._parent.type).to.equal("ExpressionStatement")
		});
	});
	
	it("should return the bindings for a function", () => {
		let code = "function a() {var b,c;\nfunction d(){}\n}";
		let ast = acorn.parse(code);
		let outer = true;
		
		iterator.walk(ast, {
			FunctionDeclaration: (node) => {
				if (outer) {
					let bindings = node.bindings;
					expect(bindings.length).to.equal(3);
					expect(bindings[0].id.name).to.equal("b");
					
					outer = false;
				}
			}
		});
	});
	
	it("should return own bindings for function scope", () => {
		let code = "function a() {var b,c;\nfunction d(){}\n}";
		let ast = acorn.parse(code);
		let outer = true;
		
		iterator.walk(ast, {
			FunctionDeclaration: (node) => {
				if (outer) {
					let bindings = node.bindings;
					expect(bindings.length).to.equal(3);
					expect(bindings[0].id.name).to.equal("b");
					
					outer = false;
				}
			},
			
			BlockStatement: (node) => expect(node.bindings.length).to.equal(0)
		});
	});
		
	it("should return own bindings for block scope let/const", () => {
		let code = "var a = 1;\n{\nlet b=2,c=3;\n}";
		let ast = acorn.parse(code, {ecmaVersion: 6});

		iterator.walk(ast, {
			// FunctionDeclaration: (node) => expect(node.bindings.length).to.equal(1),
			BlockStatement: (node) => expect(node.bindings.length).to.equal(2)
		});
	});
	
	// it("should indicate a block with `let` variables are scopable", function () {
	// 	let code = "{\nlet x = 1;\n}";
	// 	let ast = acorn.parse(code, {ecmaVersion: 6});
		
	// 	iterator.walk(ast, {
	// 		BlockStatement: (node) => expect(node.isScopable()).to.be.true
	// 	});
	// });
	
	// it("should indicate a block without `let` or `const` is not scopable", function () {
	// 	let code = "{\nvar x = 1;\n}";
	// 	let ast = acorn.parse(code);
		
	// 	iterator.walk(ast, {
	// 		BlockStatement: (node) => expect(node.isScopable()).to.be.false
	// 	});
	// });
});