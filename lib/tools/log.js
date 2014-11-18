/**
* @namespace
* @fileOverview 
	It'll provide a brunch of log functions for an application
* @author deathsteps
* @email lovely_dreamer@126.com
* @version 0.1
* @date 2014-8-11
* @example
*/

"use strict";

//ANSI escape code dictionary for format console output
var codes = {
	'red'		  :'\u001B[31m',
	'green'		  :'\u001B[32m',
	'blue'		  :'\u001B[34m',
	'yellow'	  :'\u001B[33m',
	'magenta'	  :'\u001B[35m',
	'cyan'		  :'\u001B[36m',
	'color_suffix':'\u001B[39m',
	'bold_prefix' :'\u001B[1m',
	'bold_suffix' :'\u001B[22m',
}

function bold (str) {
	return codes.bold_prefix + str + codes.bold_suffix;
};

function colour (color, str){
	return (codes[color] ||'') + str + codes.color_suffix;
};

var APP_NAME = '';

exports.init = function (appName) {
	APP_NAME = appName;
	return exports;
}

exports.progress = function (msg) {
	msg =  colour('cyan', APP_NAME + "> ")
		+ colour('green', msg);
	console.log(msg);
}

exports.error = function (msg) {
	msg =  colour('cyan', APP_NAME + "> ")
		+ colour('red', msg);
	console.log(msg);
}

exports.log = function (msg) {
	msg = colour('cyan', APP_NAME + "> ") + msg;
	console.log(msg);
}

exports.warn = function (msg) {
	msg =  colour('cyan', APP_NAME + "> ")
		+ colour('yellow', msg);
	console.log(msg);
}