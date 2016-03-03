import {TraversalContext} from "./traversal-context";
import {walk as walker} from "./walk";
import {defaultVisitors} from "./visitors";

function makeVisitor (keys) {
	return function* visitor (node, state, w) {
		yield node;
		
		for (let i = 0, ln = keys.length; i < ln; i++) {
			let key = keys[i];
			
			if (node.has(key)) {
				yield* w(node[key], state, w);
			}
		}
	};
}

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

export function walk (node, visitors, state) {
	let wrappedVisitors = wrapVisitors(visitors, defaultVisitors);
	let it = walker(wrappedVisitors, new TraversalContext(node), state);
	let done = false;
	let value;
	
	do {
		({done, value} = it.next(value));
	} while (!done);
}

export function step (node, visitors, state) {
	let wrappedVisitors = wrapVisitors(visitors, defaultVisitors);
	let wrappedNode = new TraversalContext(node);
	
	function stepper (node, state) {
		if (typeof wrappedVisitors[node.type] === "function") {
			return wrappedVisitors[node.type](node, state, stepper);
		}
	};
	
	return stepper(wrappedNode, state);
}

export function* iterate (node) {
	for (let current of walker(defaultVisitors, new TraversalContext(node))) {
		yield current;
	}
}

export function* filter (node, filters) {
	let hash;
	if (filters && Array.isArray(filters)) {
		hash = Object.create(null);
		filters.forEach(type => hash[type] = true);
	}
	
	for (let current of walker(defaultVisitors, new TraversalContext(node))) {
		if (!hash || hash[current.type]) {
			yield current;
		}
	}
}
