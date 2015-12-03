export class Binding {
	constructor	(node, id, kind) {
		this.node = node;
		this.id = id;
		this.kind = kind;
	}
	
	isBlockScope () {
		return this.isLet() || this.isConst();
	}
	
	isLet () {
		return this.kind === "let";
	}
	
	isConst () {
		return this.kind === "const";
	}
	
	isVar () {
		return this.kind === "var";
	}
}
