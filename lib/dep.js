var sys     = {};
sys.path    = require('path');

var Promise = require("bluebird");

var CONFIG  = require('./config.json');

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

module.exports = {
	parseDependencies : parseDependencies,
	changeDefinition  : changeDefinition,
	getFilePath       : getFilePath
};





