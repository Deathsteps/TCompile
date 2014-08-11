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
var merge = require('./merge');
var tfs = require('./tfs');

function move(file, dest, isExisted){
	// copy
	var readable = sys.fs.createReadStream(file);
	var writable = sys.fs.createWriteStream(dest);  
	readable.pipe(writable);
	// delete temp files
	sys.fs.unlinkSync(file);
	sys.fs.unlinkSync(file.replace('merge.', ''));
	AppLog.progress("compile ok: " + sys.path.basename(dest));
	// check in target file
	isExisted ? tfs.checkin(dest) : (tfs.add(dest),tfs.checkin(dest));
}

function save(filename){
	var file = sys.path.join(CONFIG.path.src, filename);
	var dest = sys.path.join(CONFIG.path.min, filename.replace('merge.min.', ''));
	var isExisted = sys.fs.existsSync(dest);
	
	if(isExisted){
		tfs.checkout(dest, function (){
			move(file, dest, isExisted);
		});
	}else{
		move(file, dest);
	}
}

function errorHandler (err) {
	AppLog.error(err.message);
}

module.exports = function (){
	tfs.setEnv(); // set the path of the tf command tool
	var files = [].slice.apply(arguments);;
	files.forEach(function (file){
		compress(file).then(merge).then(save).error(errorHandler);
	});
}
