const webpack = require("../../");
const config = require("./webpack.config");
const compiler = webpack(config);
compiler.run(err => {
	console.log("err", err);
});
