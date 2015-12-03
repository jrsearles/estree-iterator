module.exports = function (wallaby) {
	return {
		files: ["src/**/*.js", "index.js"],
		
		tests: ["test/**/*.js"],
		
		compilers: {
			"**/*.js": wallaby.compilers.babel({
				babel: require("babel-core"),
				presets: ["es2015"]
			})
		},
		
		testFramework: "mocha",
		
		debug: true,
		
		env: {
			type: "node"
		}
	};
};