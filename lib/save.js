var sys = {};
sys.fs = require('fs');
sys.path = require('path');

var CONFIG = require('./config');
var AppLog = require('./log').init('T compile');

var tfs = require('./tfs');
tfs.setEnv(); // set the path of the tf command tool

function removeTemps (file) {
	sys.fs.unlinkSync(file);
	if(file.indexOf('merge.') == -1) return;
	sys.fs.unlinkSync(file.replace('merge.', ''));
}

function move(file, dest, isExisted){
	// copy
	var readable = sys.fs.createReadStream(file);
	var writable = sys.fs.createWriteStream(dest);  
	readable.pipe(writable);
	// remove temp files
	removeTemps(file);
	AppLog.progress("save complete: " + sys.path.basename(dest));
	// check in target file
	isExisted ? tfs.checkin(dest) : (tfs.add(dest),tfs.checkin(dest));
}

function save(filename){
	var mode = filename.split('.')[0];
	var dest = mode != "merge" ? // deal with tool module/mod module
		sys.path.join(CONFIG.path[mode], filename.replace(mode + '.', '')) :
		sys.path.join(CONFIG.path.min, filename.replace('merge.min.', ''));

	var file = sys.path.join(CONFIG.path.src, filename);	
	var isExisted = sys.fs.existsSync(dest);
	
	if(isExisted){
		tfs.checkout(dest, function (){
			move(file, dest, isExisted);
		});
	}else{
		move(file, dest);
	}
}

module.exports = save;
