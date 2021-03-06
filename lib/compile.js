/**
* @namespace
* @fileOverview 
	This lib will help you compress the seajs module and
	merge the dependent modules into the main module.
	All of the path information are configed in the config.js.
* @author deathsteps
* @email lovely_dreamer@126.com
* @version 0.1
* @date 2014-07-08
* @example
	Excute the command `Tcompile [filename1][,filename2][,..]`
*/

var sys      = {};
sys.fs       = require('fs');
sys.path     = require('path');

var Promise  = require("bluebird");
var CONFIG   = require('./config.json');
var AppLog   = require('./tools/log').init('T compile');

var File     = require('./file');
var getDeps  = require('./dep');
var compress = require('./compress');
var move     = require('./move');
var merge    = require('./merge');
var save     = require('./save');

function tag (file) {
	return new Promise(function (resolve, reject){
		var tagStr = '/**BuildTime: ' + new Date().toLocaleString() + '\r\n *If you found any bug, please mail to ' + CONFIG.mail + '*/\r\n';

		var filepath = sys.fs.existsSync(file.mergePath) ? file.mergePath : file.compressPath;
		sys.fs.readFileAsync(filepath, 'utf-8')
			.then(function (code) {
				return sys.fs.writeFileAsync(filepath, tagStr + code, 'utf-8');
			}).then(function () {
				resolve(file);
			});
	});
}

function compile() {
	var files = [].slice.apply(arguments);
	var mode = files.shift();

	return new Promise(function (resolve, reject){
		var promise = Promise.resolve(0);
		files.forEach(function (filename){
			var start = function () { 
				return Promise.resolve(
					new File(filename, mode)); 
			};
			promise = promise
				.then(start)
				.then(getDeps)
				.then(compress)
				.then(move)
				.then(merge)
				.then(tag)
				.then(save);
		});

		promise
			.then(function () {
				AppLog.progress('Compiling finished.');
				resolve();
			})
			.error(function (err) {
				AppLog.error(err.message);
				reject(err);
			});
		
	});
}

function compressTarget (files) {
	files.forEach(function (filename) {
		var file = new File(sys.path.basename(filename), '', sys.path.dirname(filename));
		compress(file).then(tag);
	});
}

module.exports = function (){
	var args = [].slice.apply(arguments);

	switch(args[0]){
		case '-help'     : require('./help')(); return;
		case '-init'     : require('./init')(args.slice(1)); return;
		case '-compress' : compressTarget(args.slice(1)); return;
		case '-doc'      : require('./doc')(); return;
		case '-watch'    : require('./watch')(args[1]); return;
		default          : 
			if(args[0].indexOf('-') == 0)
				args[0] = args[0].substring(1);
			else
				args.unshift(false); // normal compression
			return compile.apply(this, args);
	}
}
