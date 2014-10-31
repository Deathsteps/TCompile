var sys = {}; // namespace to organsize the sys module
sys.fs = require('fs');
sys.path = require('path');
 // third module
var uglify = require('uglify-js');
var Promise = require("bluebird");

var CONFIG = require('./config.json');
var AppLog = require('./tools/log').init('T compile');

/**
 * deal the files that need to be compressed
 * @param  {string} filename the path to the file
 * @param  {string} mode     tools or mods (optional)
 * @param  {string} dir      when compressing the files in specified directory, this parameter should be passed
 */
function process(filename, mode, dir){
	return new Promise(function (resolve, reject){
		if(sys.path.extname(filename) == '')
		filename += '.js'
		var file = mode ? 
			sys.path.join(dir, mode, filename) :
			sys.path.join(dir, filename);
		var dest =  filename.replace('.js', '.' + (mode ? mode : 'min') + '.js');
			
		sys.fs.readFile(file, 'utf-8', function (err, data) {
			if(err){
				AppLog.error('compress: fail to read file ' + filename);
				reject(err);
				return;
			}
			// add date tag to the file
			var tag = '/**BuildTime: ' + new Date().toLocaleString() + '\r\n *If you found any bug, please mail to ' + CONFIG.mail +'*/\r\n';
			var code = tag + compress(data);

			var tempFile = sys.path.join(dir, dest);
			sys.fs.writeFile(tempFile, code, function (err) {
				if (err) reject(err);
				AppLog.progress('compress complete: ' + filename);
				resolve(dest);
			});
		});
	});	
}

function compress(code){
	var toplevel_ast = uglify.parse(code);
	toplevel_ast.figure_out_scope()
	var compressor = uglify.Compressor();
	var compressed_ast = toplevel_ast.transform(compressor);
	compressed_ast.figure_out_scope();
	compressed_ast.compute_char_frequency();
	compressed_ast.mangle_names({
        except: ['require', 'exports', 'module', 'S', 'Mod']
    });
	return compressed_ast.print_to_string(); 
}

module.exports = function (filename, mode, dir){
	dir = dir || CONFIG.path.src;
	return process(filename, mode, dir);
}


