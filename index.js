var through = require("through2");
var gutil = require("gulp-util");
var toHex = require("convert-css-color-name-to-hex");
var PluginError = gutil.PluginError;

var PLUGIN_NAME = "gulp-name2hex";

var hexint = function(css) {
	return css.replace(
		/color:?\s(?!#[0-9a-fA-f]{3,8}|rgba\(.*?\))(.*?);/g,
		function(match, $1) {
			var match = "color: " + toHex($1) + ";";
			return match;
		}
	);
};

function gulpPrefixer() {
	var stream = through.obj(function(file, enc, cb) {
		if (file.isStream()) {
			this.emit(
				"error",
				new PluginError(PLUGIN_NAME, "Streams are not supported!")
			);
			return cb();
		}

		if (file.isBuffer()) {
			file.contents = new Buffer(hexint(file.contents.toString()));
		}

		this.push(file);

		cb();
	});

	return stream;
}

module.exports = gulpPrefixer;
