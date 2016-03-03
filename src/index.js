import { TraversalContext } from "./traversal-context";
import { defaultVisitors, extendVisitors, makeRules } from "./visitors";

export function* walker (visitors, node, state, next) {
  // create a bound walk function to pass to visitors so they can continue walking their child nodes
  next = next || walker.bind(null, visitors);

  if (Array.isArray(node)) {
    for (let i = 0, ln = node.length; i < ln; i++) {
      yield* next(node[i], state, next);
    }
  } else if (node) {
    let visitor = visitors[node.type];
    if (typeof visitor === "function") {
      yield* visitor(node, state, next);
    }
  }
}

export function walk (node, visitors, state, rules) {
  let r = makeRules(rules);
  let it = walker(visitors, new TraversalContext(node, null, n => r(n, state)), state);
  let done = false;
  let value;
  
  do {
    ({ done, value } = it.next(value));
  } while (!done);
}

export function step (root, visitors, state, rules) {
  let r = makeRules(rules);
  let node = new TraversalContext(root, null, n => r(n, state));
  
  function next (current, arg) {
    if (typeof visitors[current.type] === "function") {
      return visitors[current.type](current, arg, next);
    }
  };
  
  return next(node, state);
}

export function* iterate (node, filters) {
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

export { makeRules, extendVisitors };