var sys         = {};
sys.fs          = require('fs');

var CONFIG      = require('./config.json');
var AppLog      = require('./tools/log').init('T compile');
var Promise     = require("bluebird");
sys.fs          = Promise.promisifyAll(sys.fs);

var depHelper   = require('./dep');
var compileView = require('./tmpl');

function compileDeps (deps) {
	return new Promise(function (resolve, reject){
		
		var files = 
			deps.filter(function (item, i) {
				return item.indexOf('webresource') > -1;
			}).map(function (item, i) {
				return item.replace('webresource/', '');
			});

		if(!files.length)
			resolve(deps);

		// Require the `compile` module at the head of the code will cause the problem
		// caching the wrong `compile` module, so we have to require it at the time we use it.
		require('./compile')
			.apply(this, files)
			.then(function () {
				resolve(deps);
			}).catch(function (err){
				AppLog.error('merge: fail to compile the dependent file');
				reject(err);
			});
	});
}

function process(file){
	return new Promise(function (resolve, reject){
		compileView(file.compressPath)
			.then(function (view) {
				return sys.fs.readFileAsync(file.compressPath, 'utf-8');
			}).then(function (code){
				var deps = depHelper.parseDependencies(code);
				return compileDeps(deps);
			}).then(function (deps){
				deps.push(file.compressPath);
				return merge(deps)
			}).then(function (code){
				// write the file into the temp file
				sys.fs.writeFile(file.mergePath, code, function (err) {
					if (err) reject(err);
					AppLog.progress('merge complete: ' + file.name);
					resolve(file);
				});
			}).catch(function (err){
				AppLog.error('merge: fail to read target file ' + file.name);
				reject(err);
			});
	});	
}

/**
 * read the dependent files into the code and change the definition signature of the code for merging
 * @param  {array} 	 files     the paths to the dependent files
 * @param  {boolean} appeared  whether the dependent file appeared before
 */
function transform(files, appeared){
	appeared = appeared || []; // appeared dependences
	return new Promise(function (resolve, reject){
		// recurse finish here
		var dep = files.shift();
		if(!dep) return resolve('');
		// when come to the remote file or appeared dependences, 
		// continue process the left files 
		var file = depHelper.getFilePath(dep, appeared);
		if(!file) 
			return transform(files).then(function(code){ resolve(code); });
		// read dependent file and transform it
		sys.fs.readFileAsync(file, 'utf-8')
			.then(function (code){
				// to fix tool in tool problem
				var deps = depHelper.parseDependencies(code);
				files = files.concat(deps);

				code = depHelper.changeDefinition(code, dep);
				// transform files recursively
				transform(files, appeared)
					.then(function(c){
						// concat the code
						c =  c ? (CONFIG.CRLF + c) : '';
						resolve(code + ';' + c); 
					});
			}).catch(function (err){
				AppLog.error('merge: fail to read dependent file ' + file);
				reject(err);
			});
	});
}

// merge the files
function merge(files){
	return new Promise(function (resolve, reject){
		var main = files.pop();
		transform(files)
			.then(function (code){
				var mainCode = sys.fs.readFileSync(main);
				resolve(code + CONFIG.CRLF + mainCode);
			}).error(function (err){
				reject(err);
			});
		
	});
}

module.exports = process;





