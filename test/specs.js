import {EstreeIterator} from "../index";
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
		
		EstreeIterator.walk(ast, {
			BlockStatement: (node) => { expect(node.isBlock()).to.be.true; count++; }
		});
		
		expect(count).to.equal(1);
	});
		
	it("should be true for directive", () => {
		let code = "'use strict';";
		let ast = acorn.parse(code, {ecmaVersion: 6});
		
		EstreeIterator.walk(ast, {
			Program: (node) => expect(node.getDirectives()[0]).to.equal("use strict")
		});
	});
});