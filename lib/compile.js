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
	Excute the command `compile [filename1][,filename2][,..]`
*/

var sys = {};
sys.fs = require('fs');
sys.path = require('path');

var CONFIG = require('./config');
var AppLog = require('./log').init('T compile');

var compress = require('./compress');
var merge    = require('./merge');
var save     = require('./save');

function compile() {
	var files = [].slice.apply(arguments);
	var mode = files.shift(), process;
	files.forEach(function (file){
		process = mode ? 
			compress(file, mode) :
			compress(file).then(merge); // Normal compile contains two actions, compress and merge
		process.then(save).error(errorHandler);
	});
}

function errorHandler (err) {
	AppLog.error(err.message);
}

module.exports = function (){
	var args = [].slice.apply(arguments);
	if(args[0].indexOf('-') == 0)
		args[0] = args[0].substring(1);
	else
		args.unshift(false); // normal compression
	compile.apply(this, args);
}
