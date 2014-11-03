var sys           = {};
sys.child_process = require('child_process');
sys.fs            = require('fs');
sys.path          = require('path');

var Promise       = require("bluebird");
sys.fs            = Promise.promisifyAll(sys.fs);

var CONFIG        = require('./config');
var AppLog        = require('./tools/log').init('T compile');

var FILE = {
    partial : 'partials.js',
    tmpl    : 'tmpls.js',
    view    : 'views.js'
}

var tempFiles;

function removeTemps (view) {
    return new Promise(function (resolve, reject){
        tempFiles.forEach(function (file, i) {
            sys.fs.unlinkSync(file);
        });
        resolve(view);
    });
}

function copy (file, dest) {
    return new Promise(function (resolve, reject){
        var readable = sys.fs.createReadStream(file);
        var writable = sys.fs.createWriteStream(dest);
        readable.pipe(writable);
        readable.on('end', function () {
                resolve();
            }).on('error', function (err) {
                AppLog.error('Partial view copy error.');
                AppLog.error(err.message);
                reject();
            });
    });
}

function copyPartials (dir) {
    return new Promise(function (resolve, reject) {
        var ext = CONFIG.template.partialExt.replace(/[\\^$*+?.():=!|{}\-\[\]]/g, function(arg) { return '\\' + arg; });
        ext = new RegExp('\\.' + ext + '$');
        var paths = sys.fs.readdirSync(dir).map(function (item, i) { return sys.path.join(dir, item); });
    
        function doCopying (paths, ext) {
            var file = paths.pop();
            if(ext.test(file)){
                var dest = file.replace('.partial.', '.');
                tempFiles.push(dest);
                // The relationship between the partial view extension and view extension is supposed be defined in the config file.
                copy(file, dest)
                    .then(function () {
                        paths.length ? doCopying(paths, ext) : resolve(dir);
                    });
            }else{
                paths.length ? doCopying(paths, ext) : resolve(dir);
            }
        }

        doCopying(paths, ext);
    });
}

function excute (dir) {
    return new Promise(function (resolve, reject){
        var partial = !sys.fs.existsSync(sys.path.join(dir, FILE.partial));
        var extension = partial ? CONFIG.template.partialExt : CONFIG.template.ext;
        var output = sys.path.join(dir, partial ? FILE.partial : FILE.tmpl);
        var cmd = sys.path.resolve(__dirname, '..');
        cmd = sys.path.join(cmd, 'node_modules/handlebars/bin/handlebars');
        cmd = ['node', cmd, dir, '-f', output, '-e', extension, '-m'].join(' ');
        partial && (cmd +=  ' -p');

        sys.child_process.exec(cmd, function (err, stdout, stderr){
            err = err || stderr;
            if(err){
                AppLog.error(err.message);
                return reject(err);
            }
            resolve(dir);
        });
    });
}

function merge (dir) {
    return new Promise(function (resolve, reject){
        var filepaths = [
            sys.path.join(dir, FILE.partial), 
            sys.path.join(dir, FILE.tmpl)
        ];
        tempFiles = tempFiles.concat(filepaths);
        var helperPath = CONFIG.template.helperPath;
        if(sys.fs.existsSync(helperPath))
            filepaths.push(helperPath);

        var code = '', viewpath = sys.path.join(dir, FILE.view);
        var promise = sys.fs.readFileAsync(filepaths.pop(), 'utf-8');
        for (var i = filepaths.length; i >= 0; i--) {
            promise = 
                promise.then(function (content) {
                    code += content + CONFIG.CRLF;
                    return filepaths.length > 0 ?
                        sys.fs.readFileAsync(filepaths.pop(), 'utf-8') :
                        sys.fs.writeFileAsync(viewpath, code, 'utf-8');
                });
        };

        promise.then(function () {
                AppLog.progress('View file is created.');
                resolve({viewpath: viewpath, code: code});
            }).catch(function (err) {
                AppLog.error(err.message);
                reject(err);
            });
    });
}

function compile (filename) {
    var dirname = filename.replace(/(\.min)?\.js$/, '');
    if(!sys.fs.existsSync(dirname)) 
        return Promise.resolve({});
    tempFiles = [];
    return copyPartials(dirname)
            .then(excute)
            .then(excute)
            .then(merge)
            .then(removeTemps);
            
}

module.exports = compile;
