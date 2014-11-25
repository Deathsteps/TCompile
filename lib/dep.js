var sys     = {};
sys.path    = require('path');
sys.fs      = require('fs');

var Promise = require("bluebird");
var CONFIG  = require('./config.json');
var AppLog  = require('./tools/log').init('T compile');
sys.fs      = Promise.promisifyAll(sys.fs);

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

// get the full path to the dependent file
function getFilePath(dep){
    // not deal with the remote file
    if(dep.indexOf('http') == 0) return dep;

	var extname = sys.path.extname(dep) ? '' : '.js';
	var dep = dep.split('/')
        .map(function (item) {
            return (item == 'webresource' || item == 'min') ? '' : item; })
        .filter(function (item) {
            return item != '..'; })
        .join('/');

	return sys.path.join(CONFIG.path.src, dep + extname);
}

function parse (filepath, ret) {
    return new Promise(function (resolve, reject){
        if(!filepath) return resolve();
        sys.fs.readFileAsync(filepath, 'utf-8')
            .then(function (code){
                // parse dependencies and push them into the returns
                var deps = parseDependencies(code)
                    .map(function (item, i) { // change to filepath
                        var filepath = getFilePath(item);
                        if(ret.filter(function (item) { 
                            return item.filePath == filepath }).length){
                            return false;
                        }else{
                            ret.push({name: item, filePath: filepath});
                            return filepath;
                        }
                    }).filter(function (item, i) { // remove duplicate items 
                        return item;
                    });
                if(!deps.length) return resolve();
                // get the dependencies of dependence
                // after all of them finished, resovle the promise
                var promises = [];
                deps.forEach(function (item, i) {
                    promises.push(parse(item, ret));
                });
                Promise.all(promises).then(function () {
                    resolve();
                })
            });
    });
}

function getDeps (file) {
    return new Promise(function (resolve, reject){
        parse(file.filePath, file.deps)
            .then(function () {
                // prepare the paths to the compressed dependence files
                file.deps4Compressing();
                AppLog.progress('Succeed get dependencies: ' + file.name);
                resolve(file);
            }).catch(function (err) {
                AppLog.error('Fail to get the dependencies');
                reject(err);
            });
    });
}

module.exports = getDeps;




