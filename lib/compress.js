var sys = {}; // namespace to organsize the sys module
sys.fs = require('fs');
 // third module
var uglify = require('uglify-js');
var Promise = require("bluebird");
var CONFIG = require('./config.json');
var AppLog = require('./tools/log').init('T compile');

function getTag () {
	return '/**BuildTime: ' + new Date().toLocaleString() + '\r\n *If you found any bug, please mail to ' + CONFIG.mail + '*/\r\n';
}

function process(file){
	return new Promise(function (resolve, reject){
			
		sys.fs.readFile(file.filePath, 'utf-8', function (err, data) {
			if(err){
				AppLog.error('compress: fail to read file ' + file.name);
				reject(err);
				return;
			}
			// add date tag to the file
			var code = getTag() + compress(data);

			sys.fs.writeFile(file.compressPath, code, function (err) {
				if (err) reject(err);
				AppLog.progress('compress complete: ' + file.name);
				resolve(file);
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

module.exports = process;


