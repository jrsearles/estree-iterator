import "babel-polyfill";
import {TraversalContext} from "./traversal-context";
import {default as keys} from "./estree-keys";

function* walk (visitors, node, state, w) {
	// create a bound walk function to pass to visitors so they can continue walking their child nodes
	w = w || walk.bind(null, visitors);

	if (Array.isArray(node)) {
		for (let i = 0, ln = node.length; i < ln; i++) {
			yield* walk(visitors, node[i], state, w);
		}
	} else if (node) {
		let visitor = visitors[node.type];
		if (typeof visitor === "function") {
			yield* visitor(node, state, w);
		}
	}
}

function makeVisitor (keys) {
	return function* visitor (node, state, w) {
		yield node;
		
		for (let i = 0, ln = keys.length; i < ln; i++) {
			let key = keys[i];
			
			if (node.has(key)) {
				yield* w(node.makeChild(key), state, w);
			}
		}
	};
}

function* defaultVisitor (node, state, w) {
	yield node;

	if (node.type in keys) {
		for (let i = 0, ln = keys[node.type].length; i < ln; i++) {
			let key = keys[node.type][i];

			if (node.has(key)) {
				yield* w(node.makeChild(key), state, w);
			}
		}
	}
}

function extendVisitors (visitors) {
	Object.keys(visitors).forEach(key => {
		let visitor = visitors[key];

		if (Array.isArray(visitor)) {
			visitors[key] = makeVisitor(visitor);
		}	else if (visitors[key] === true) {
			visitors[key] = defaultVisitor;
		}
	});

	return visitors;
}

// make default visitor
// function* defaultVisitor (node, parent, state, w) {
// 	yield node;

// 	for (let i = 0, ln = keys[node.type]; i < ln; i++) {
// 		let childKey = keys[node.type][i];
// 		let child = node[childKey];

// 		if (child) {
// 			yield* w(child, node, state);
// 		}
// 	}
// }

const defaultVisitors = {};
Object.keys(keys).forEach(key => defaultVisitors[key] = defaultVisitor);

function wrapVisitors (visitors, baseVisitors) {
	let wrappedVisitors = Object.assign({}, baseVisitors);

	Object.keys(visitors).forEach(key => {
		if (visitors[key] === false) {
			wrappedVisitors[key] = false;
			return;
		}
		
		if (Array.isArray(visitors[key])) {
			wrappedVisitors[key] = makeVisitor(visitors[key]);
			return;
		}
		
		let baseVisitor = baseVisitors[key];

		wrappedVisitors[key] = function* (...args) {
			let result = yield visitors[key](...args);
			if (result !== false && baseVisitor) {
				yield* baseVisitor(...args);
			}
		};
	});

	return wrappedVisitors;
}

export default class EstreeIterator {
	constructor (node, visitors, state) {
		this.root = node;
		this.visitors = visitors;
		this.state = state;
	}

	[Symbol.iterator] () {
		return walk(this.visitors, this.root, null, this.state);
	}

	static create (node, visitors, state) {
		return new EstreeIterator(node, visitors || defaultVisitors, state);
	}

	static walk (node, visitors, state) {
		let wrappedVisitors = wrapVisitors(visitors, defaultVisitors);
		let it = walk(wrappedVisitors, new TraversalContext(node), state);
		let done = false;
		let value;
		
		do {
			({done, value} = it.next(value));
		} while (!done);
	}

	static extend (node, visitors, state) {
		let merged = Object.assign({}, keys, visitors);
		return EstreeIterator.create(node, extendVisitors(merged), state);
	}
};
