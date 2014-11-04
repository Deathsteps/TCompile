var sys     = {};
sys.fs      = require('fs');
sys.path    = require('path');

var Promise = require("bluebird");

exports.mkdir = function (dirname) {
    var dirnames = [];
    while(!sys.fs.existsSync(dirname)){
        dirnames.push(dirname);
        dirname = sys.path.dirname(dirname);
    }
    while(dirnames.length > 0){
        sys.fs.mkdirSync(dirnames.pop());
    }
}

exports.copy = function (file, dest) {
    return new Promise(function (resolve, reject){
        exports.mkdir(sys.path.dirname(dest));
        // do copying
        var readable = sys.fs.createReadStream(file);
        var writable = sys.fs.createWriteStream(dest);
        readable.pipe(writable);
        readable.on('end', function () {
                resolve();
            }).on('error', function (err) {
                AppLog.error('File copy error: ' + file);
                AppLog.error(err.message);
                reject();
            });
    });
}

var REGEXP_DISK_NAME = /^\w+:/;
exports.move = function (file, dest) {
    return new Promise(function (resolve, reject){
        exports.mkdir(sys.path.dirname(dest));

        if(file.match(REGEXP_DISK_NAME)[0] == dest.match(REGEXP_DISK_NAME)[0])
            sys.fs.renameSync(file, dest);
        else
            File.copy(file, dest)
                .then(function () {
                    sys.fs.unlinkSync(file);
                });
    });
}




