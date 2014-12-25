var sys         = {};
sys.fs          = require('fs');

var CONFIG      = require('./config.json');
var AppLog      = require('./tools/log').init('T compile');
var Promise     = require("bluebird");
sys.fs          = Promise.promisifyAll(sys.fs);

var DEFINE_RE = /define\s*\(\s*(null,\s*\[\"tools\/handlebars\.runtime\.js\"\],\s*)?function/;
// change the `define` of the dependence code with a name for requiring it in the main code
function changeDefinition(code, name) {
	// due to the merging operation, we dont need to fill in the `dependences parameter`
    var defineSignature = 'define("' + name + '", [], function';
    if (DEFINE_RE.test(code)) {
        code = code.replace(DEFINE_RE, 
        	RegExp.$1 ? 
        		defineSignature.replace('[]', '["tools/handlebars.runtime.js"]') :
        		defineSignature
			);
    }else{
    	if(name == 'tools/handlebars.runtime.js') // we need Handlebars to a global object
    		code += ';window.Handlebars = module.exports;';
    	code = defineSignature + '(require,exports,module){' + code + '});'
    }
    return code;
}
// change the file definition
function transform(file){
	return new Promise(function (resolve, reject){
		sys.fs.readFileAsync(file.compressPath, 'utf-8')
			.then(function (code) {
				code = changeDefinition(code, file.name);
				resolve(code);
			})
	});
}

function merge(file){
	return new Promise(function (resolve, reject){
		var promise = Promise.resolve('');
		// transform dependencies
		if(file.deps && file.deps.length){
			promise = 
				Promise.all(
					file.deps.map(function (item, i) {
						return transform(item);
					})
				);
		}
		// deal with the main file
		var code = '';
		promise.then(function (depsCode) {
				// promise.all will return an array of each fulfillment value
				code += depsCode.join(';' + CONFIG.CRLF) + ';' + CONFIG.CRLF;
				return sys.fs.readFileAsync(file.compressPath, 'utf-8')
			}).then(function (mainCode) {
				code += mainCode;
				return sys.fs.writeFileAsync(file.mergePath, code, 'utf-8');
			}).then(function () {
				AppLog.progress('Merge completed: ' + file.name);
				resolve(file);
			}).catch(function (err) {
				AppLog.error('Merge failed.');
				reject(err);
			});
	});	
}

module.exports = merge;





