var sys = {}; // namespace to organsize the sys module
sys.fs = require('fs');
sys.path = require('path');
 // third module
var uglify = require('uglify-js');
var Promise = require("bluebird");

var CONFIG = require('./config');

function process(filename){
	return new Promise(function (resolve, reject){
	
		if(sys.path.extname(filename) == '')
		filename += '.js'
		var file = sys.path.join(CONFIG.path.src, filename);
			
		sys.fs.readFile(file, 'utf-8', function (err, data) {
			if(err){
				console.log('[compress] fail to read file ' + filename);
				reject(err);
				return;
			}

			var tag = '/**BuildTime: ' + new Date().toLocaleDateString()
				+ '\r\n *If you found any bug, please mail to ' + CONFIG.mail +'*/\r\n';
				
			var code = tag + compress(data);

			var tempFile = sys.path.join(CONFIG.path.src, 'min.' + filename);
			sys.fs.writeFile(tempFile, code, function (err) {
				if (err) reject(err);
				console.log('compress ok: ' + filename);
				resolve('min.' + filename);
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

module.exports = function (filename){
	return process(filename);
}


