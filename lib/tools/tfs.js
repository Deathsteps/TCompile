/**
* @namespace
* @fileOverview 
	It will provide a bunch of functions for you to complete the source control task in tfs.
* @author deathsteps
* @email lovely_dreamer@126.com
* @version 0.1
* @date 2013-4-17
* @example
	First you should set the path of the tf command tool by calling setEnv.
	eg. xx.setEnv(path);
	Then use the function, of which the name is the same with target command, to complete the target job.
	eg. xx.checkin(path, opts, callback);
	opts is a dictionary for the command parameters
	callback will be execute when the command finished
*/

"use strict";

var sys = {}; // namespace to organsize the sys module
sys.child_process = require('child_process');

// exec('echo abc> D:\\Test.txt');

var OPERATION = {
	CHECKIN : 'checkin',
	CHECKOUT: 'checkout',
	UNDO    : 'undo',
	ADD     : 'add',
	DELETE  : 'delete',
	GET     : 'get'
}

var TOOL_PATH = 'C:\\Program Files (x86)\\Microsoft Visual Studio 10.0\\Common7\\IDE',
	TOOL_CMD  = 'tf';

function exec(op, path, args, opts, callback){
	if(typeof opts === 'object'){
		for(var k in opts){
			if(typeof opts[k] === 'boolean' && opts[k])
				args += ' /' + k;
			else
				args += ' /' + k + ':' + opts[k];
		}
	}

	if(typeof opts === 'function')
		callback = opts;
	
	var hasCallback = typeof callback === 'function';
	
	sys.child_process.exec([TOOL_CMD, op, path, args].join(' '), function (err, stdout, stderr){
		if(err){
			hasCallback && callback(err);
			return;
		}
		
		if(stderr){
			console.error(stderr);
			hasCallback && callback({msg: stderr});
			return;
		}
		
		console.log(stdout);
		hasCallback && callback();
	});
}
	
exports.checkout = function (path, opts, callback){
	var args = '/recursive';
	exec(OPERATION.CHECKOUT, path, args, opts, callback);
}

exports.checkin = function (path, opts, callback){
	var args = '/noprompt /recursive';
	exec(OPERATION.CHECKIN, path, args, opts, callback);
}

exports.add = function (path, opts, callback){
	var args = '/noprompt /recursive';
	exec(OPERATION.ADD, path, args, opts, callback);
}

exports.delete = function (path, opts, callback){
	var args = '/recursive';
	exec(OPERATION.DELETE, path, args, opts, callback);
}

exports.get = function (path, opts, callback){
	var args = '/recursive';
	exec(OPERATION.GET, path, args, opts, callback);
}

exports.undo = function (path, opts, callback){
	var args = '/noprompt /recursive';
	exec(OPERATION.GET, path, args, opts, callback);
}

exports.setEnv = function (tool_path){
	process.env.path += ';' + (tool_path || TOOL_PATH);
}