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

var CONFIG   = require('./config');
var AppLog   = require('./log').init('T compile');

var compress = require('./compress');
var merge    = require('./merge');
var save     = require('./save');

function compile() {
	var files = [].slice.apply(arguments);
	var mode = files.shift(), process;

	return new Promise(function (resolve, reject){	
		var processCount = 0;

		files.forEach(function (file){
			process = mode ? 
				compress(file, mode) :
				compress(file).then(merge); // Normal compile contains two actions, compress and merge
			process
				.then(save)
				.then(count)
				.error(errorHandler);
		});

		function count () {
			if(++processCount == files.length)
				resolve();
		}

		function errorHandler (err) {
			AppLog.error(err.message);
			reject(err);
		}
	});
}

function compressTarget (files) {
	files.forEach(function (file, i) {
		compress(sys.path.basename(file), null, sys.path.dirname(file));
	});
}

module.exports = function (){
	var args = [].slice.apply(arguments);

	switch(args[0]){
		case '-help'     : require('./help')(); return;
		case '-init'     : require('./init')(); return;
		case '-compress' : compressTarget(args.slice(1)); return;
		default          : 
			if(args[0].indexOf('-') == 0)
				args[0] = args[0].substring(1);
			else
				args.unshift(false); // normal compression
			return compile.apply(this, args);
	}
}
