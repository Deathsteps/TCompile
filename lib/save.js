var sys        = {};
sys.fs         = require('fs');
sys.path       = require('path');

var Promise    = require("bluebird");
var CONFIG     = require('./config.json');
var AppLog     = require('./tools/log').init('T compile');

var fileHelper = require('./tools/fileHelper');
var tfs        = require('./tools/tfs');
tfs.setEnv(); // set the path of the tf command tool

function move(file, isExisted, callback){
  fileHelper
    .copy(file.mergePath, file.destPath)
    .then(function () {
        // remove temp files
        sys.fs.unlinkSync(file.compressPath);
        sys.fs.unlinkSync(file.mergePath);
        AppLog.progress("save complete: " + sys.path.basename(file.name));
        // check in target file
        if(CONFIG.checkinAfterSave)
            isExisted ? tfs.checkin(file.destPath) : 
              (tfs.add(file.destPath),tfs.checkin(file.destPath));     
        callback();
    })
}

function save(file){ 
	return new Promise(function (resolve, reject){
    var callback = function(){ resolve(file); };
		if(sys.fs.existsSync(file.destPath)){
			tfs.checkout(file.destPath, function (){
				move(file, true, callback);
			});
		}else{
			move(file, false, callback);
		}
	});	
}

module.exports = save;
