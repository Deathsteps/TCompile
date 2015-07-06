var sys = {}; // namespace to organsize the sys module
sys.fs = require('fs');

var Promise = require("bluebird");
var AppLog  = require('./tools/log').init('T compile');
sys.fs      = Promise.promisifyAll(sys.fs);

var fileHelper = require('./tools/fileHelper');

function process(file){
    return new Promise(function (resolve, reject){
        var promise = Promise.resolve('');
        // compress dependencies
        if(file.deps && file.deps.length){
            promise = 
                Promise.all(
                    file.deps.map(function (item, i) {
                        return process(item);
                    })
                );
        }
        // compress the main file
        promise.then(function () {
                console.log(file.compressPath);
                console.log(file.destPath);
                return fileHelper.copy(file.compressPath, file.destPath);
            }).then(function () {
                AppLog.progress('File move completed: ' + file.name);
                resolve(file);
            }).catch(function (err) {
                AppLog.error('File move failed on file: ' + file.name);
                reject(err);
            });
    }); 
}

module.exports = process;


