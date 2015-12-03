import {types} from "./types";

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

export function* defaultVisitor (node, state, w) {
	yield node;

	if (node.type in types) {
		for (let i = 0, ln = types[node.type].length; i < ln; i++) {
			let key = types[node.type][i];

			if (node.has(key)) {
				yield* w(node[key], state, w);
			}
		}
	}
}

export const defaultVisitors = {};
Object.keys(types).forEach(key => defaultVisitors[key] = makeVisitor(types[key]));

export function extendVisitors (visitors, baseVisitors) {
	let wrappedVisitors = Object.assign({}, baseVisitors || defaultVisitors);

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
