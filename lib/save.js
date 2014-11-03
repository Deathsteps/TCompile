var sys = {};
sys.fs = require('fs');
sys.path = require('path');

var CONFIG = require('./config.json');
var AppLog = require('./tools/log').init('T compile');

var Promise = require("bluebird");

var tfs = require('./tools/tfs');
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
    readable.on('end', function () {
        // remove temp files
        removeTemps(file);
        AppLog.progress("save complete: " + sys.path.basename(dest));
        // check in target file
        if(CONFIG.checkinAfterSave)
            isExisted ? tfs.checkin(dest) : (tfs.add(dest),tfs.checkin(dest));
    });
}

function parse (filename) {
	var temp = filename.match(/\.(\w+)\.js/);
    if (!temp) {
        AppLog.error("Wrong savename: " + filename);
        return false;
    }
    // The directory between module.min.merge.js and module.tools.js is different.
    var mode = temp[1]; 
    var destDir = mode == "merge" ? CONFIG.path.min : CONFIG.path[mode];
    // deal the files in the sub-directories
    temp = filename.split("/");
    if (temp.length > 1) {
       	temp.forEach(function (item, i) {
       		if(i == temp.length - 1){
       			filename = item;
       		}else{
	       		destDir = sys.path.join(destDir, item); // change directory
		        if (!sys.fs.existsSync(destDir)) 
		        	sys.fs.mkdirSync(destDir);
       		}
       	});
    }
    // set the target file name
    filename = mode == "merge" ? filename.replace('min.merge.', '') : filename.replace(mode + '.', '');
    return sys.path.join(destDir, filename);
}

function save(filename){ 
	return new Promise(function (resolve, reject){
		var dest = parse(filename);
		if(!dest) return;

		var file = sys.path.join(CONFIG.path.src, filename);	
		var isExisted = sys.fs.existsSync(dest);
		
		if(isExisted){
			tfs.checkout(dest, function (){
				move(file, dest, isExisted);
				resolve(dest);
			});
		}else{
			move(file, dest);
			resolve(dest);
		}
	});	
}

module.exports = save;
