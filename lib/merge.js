var sys = {};
sys.fs = require('fs');
sys.path = require('path');

var Promise = require("bluebird");
sys.fs = Promise.promisifyAll(sys.fs);

var CONFIG = require('./config');
var AppLog = require('./log').init('T compile');

Array.prototype.unique = function() {
  return this.filter(function(value, index, array) {
    return array.indexOf(value, index + 1) < 0;
  });
};

var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;
var SLASH_RE = /\\\\/g;
// parse the dependencies from the code
function parseDependencies(code) {
	var ret = [];
  
	code.replace(SLASH_RE, "")
	  .replace(REQUIRE_RE, function(m, m1, m2) {
		if (m2) {
		  ret.push(m2)
		}
	  });
	  
	ret = ret.unique();
	  
	var reg = /define\s*\(\s*["']([^"']+)/g, result, index;
	while ((result = reg.exec(code)) != null)  {
		index = ret.indexOf(result[1]);
		if(index > -1)
			ret.splice(index, 1);
	}
	
  return ret
}

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

function process(filename){
	return new Promise(function (resolve, reject){
	
		if(sys.path.extname(filename) == '')
		filename += '.js'
		var file = sys.path.join(CONFIG.path.src, filename);
		
		sys.fs.readFileAsync(file, 'utf-8')
			.then(function (code){
				var deps = parseDependencies(code);
				return compileDeps(deps);
			}).then(function (deps){
				deps.push(file);
				return merge(deps)
			}).then(function (code){
				// write the file into the temp file
				var tempFile = sys.path.join(CONFIG.path.src, 'merge.' + filename);
				sys.fs.writeFile(tempFile, code, function (err) {
					if (err) reject(err);
					AppLog.progress('merge complete: ' + filename);
					resolve('merge.' + filename);
				});
			}).catch(function (err){
				AppLog.error('merge: fail to read target file ' + filename);
				reject(err);
			});
	});	
}

var DEFINE_RE = /define\s*\(\s*function/;

function changeDefinition(code, dep) {
    var deps = parseDependencies(code);
    var defineSignature = 'define("' + dep + '",' + JSON.stringify(deps) + ",function";
    if (DEFINE_RE.test(code)) {
        code = code.replace(DEFINE_RE, function() {
            return defineSignature
        })
    } else {
    	// add the 'define' signature to the non-AMD or non-CMD module
        code = defineSignature + "(require, exports, module){\r\n" + code + "\r\n});"
    }
    return code;
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
		var file = getFilePath(dep, appeared);
		if(!file) 
			return transform(files).then(function(code){ resolve(code); });
		// read dependent file and transform it
		sys.fs.readFileAsync(file, 'utf-8')
			.then(function (code){
				
				code = changeDefinition(code, dep);
				
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

// get the full path to the dependent file
function getFilePath(dep, appeared){
	// not deal with the appeared dependences
	if(appeared.indexOf(dep) > -1) return;
	appeared.push(dep);

	var filename = sys.path.basename(dep);
	var extname = sys.path.extname(filename) ? '' : '.js';
	
	var dir = dep.replace(filename, '');
	// not deal with the remote file
	if(dep.indexOf('http') > -1) return;

	dir = dep.indexOf('tools') > -1 ? 'tools' :
		dep.indexOf('mods')> -1 ? 'mods' : 'min';
	
	return sys.path.join(CONFIG.path[dir], filename + extname);
}

module.exports = process;





