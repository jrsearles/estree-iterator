import {defaultVisitors} from "./visitors";

export function* walk (visitors, node, state, w) {
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
