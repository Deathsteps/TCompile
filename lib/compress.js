var sys = {}; // namespace to organsize the sys module
sys.fs = require('fs');
sys.path = require('path');
 // third module
var uglify = require('uglify-js');
var Promise = require("bluebird");

var CONFIG = require('./config');
var AppLog = require('./log').init('T compile');

function process(filename, mode){
	return new Promise(function (resolve, reject){
		if(sys.path.extname(filename) == '')
		filename += '.js'
		var file = mode ? 
			sys.path.join(CONFIG.path.src, mode, filename) :
			sys.path.join(CONFIG.path.src, filename);
		var dest = (mode ? mode : 'min') + '.' + filename;
			
		sys.fs.readFile(file, 'utf-8', function (err, data) {
			if(err){
				AppLog.error('compress: fail to read file ' + filename);
				reject(err);
				return;
			}
			// add date tag to the file
			var tag = '/**BuildTime: ' + new Date().toLocaleDateString() + '\r\n *If you found any bug, please mail to ' + CONFIG.mail +'*/\r\n';
			var code = tag + compress(data);

			var tempFile = sys.path.join(CONFIG.path.src, dest);
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

module.exports = function (filename, mode){
	return process(filename, mode);
}


