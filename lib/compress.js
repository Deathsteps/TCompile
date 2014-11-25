var sys = {}; // namespace to organsize the sys module
sys.fs = require('fs');

var uglify  = require('uglify-js');
var Promise = require("bluebird");
var AppLog  = require('./tools/log').init('T compile');
sys.fs      = Promise.promisifyAll(sys.fs);

function process(file){
	return new Promise(function (resolve, reject){
		var promise = Promise.resolve('');
		// compress dependencies
		if(file.deps && file.deps.length){
			promise = 
				Promise.all(
					file.deps.map(function (item, i) {
						return process(item);
					})
				);
		}
		// compress the main file
		promise.then(function () {
				return sys.fs.readFileAsync(file.filePath, 'utf-8')
			}).then(function (code) {
				return sys.fs.writeFileAsync(file.compressPath, compress(code), 'utf-8');
			}).then(function () {
				file.destPath && AppLog.progress('Compress completed: ' + file.name);
				resolve(file);
			}).catch(function (err) {
				AppLog.error('Compress failed on file: ' + file.name);
				reject(err);
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


