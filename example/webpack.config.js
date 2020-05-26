var path = require("path");
const GitNamePlugin = require("git-name-plugin");
module.exports = {
	// mode: "development || "production",
	entry: {
		main: "./example"
	},
	optimization: {
		runtimeChunk: true
	},
	plugins: [new GitNamePlugin()],
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].chunkhash.js",
		chunkFilename: "[name].chunkhash.js"
	}
};
