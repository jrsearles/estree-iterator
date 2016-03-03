import * as iterator from "../index";
import * as acorn from "acorn";
import {expect} from "chai";
import {TraversalContext} from "../src/traversal-context";

describe("API", () => {
	it("should have filter method", () => {
		expect(typeof iterator.filter).to.equal("function");
		
	});	
});

let node = {
	type: "Program",
	body: [{
		type: "BlockStatement",
		body: [{
			type: "VariableDeclaration",
			kind: "let",
			declarations: [{
				type: "VariableDeclarator",
				id: {
					type: "Identifier",
					name: "a"
				}
			}]
		}]
	}]
};

describe("TraversalContext", () => {
	it("should be correct", () => {
		let context = new TraversalContext(node);
		expect(context.body[0].body[0].declarations[0].id.name).to.equal("a");
		expect(context.body[0].body[0].declarations[0].isLet()).to.be.true;
	});	
});

describe("For Bindings", () => {
	it("should indicate block scope for let/const vars", () => {
		let ast = acorn.parse("let a;const b=1;", {ecmaVersion: 6});
		for (let node of iterator.filter(ast, ["Program"])) {
			node.bindings.forEach(b => expect(b.isBlockScope()).to.be.true);
		}
	});
	
	it("should indicate correct type", () => {
		let ast = acorn.parse("let a;const b=1;var c;function d(){}", {ecmaVersion: 6});
		for (let node of iterator.filter(ast, ["Program"])) {
			expect(node.bindings.length).to.equal(4);
			
			expect(node.bindings[0].isLet()).to.be.true;
			expect(node.bindings[0].isVar()).to.be.false;
			expect(node.bindings[0].isConst()).to.be.false;
			
			expect(node.bindings[1].isLet()).to.be.false;
			expect(node.bindings[1].isVar()).to.be.false;
			expect(node.bindings[1].isConst()).to.be.true;
			
			expect(node.bindings[2].isLet()).to.be.false;
			expect(node.bindings[2].isVar()).to.be.true;
			expect(node.bindings[2].isConst()).to.be.false;
			
			expect(node.bindings[3].isLet()).to.be.false;
			expect(node.bindings[3].isVar()).to.be.false;
			expect(node.bindings[3].isConst()).to.be.false;
		}
	});
	
	it("should indicate not block scope for vars, functions", function () {
		let ast = acorn.parse("var a;function b(){}", {ecmaVersion: 6});
		for (let node of iterator.filter(ast, ["Program"])) {
			node.bindings.forEach(b => expect(b.isBlockScope()).to.be.false);
		}
	});
});
