var sys           = {};
sys.child_process = require('child_process');
sys.fs            = require('fs');
sys.path          = require('path');

var CONFIG        = require('./config');
var AppLog        = require('./tools/log').init('T compile');
var Promise       = require("bluebird");
sys.fs            = Promise.promisifyAll(sys.fs);

var FILE = {
    partial : 'partials.js',
    tmpl    : 'tmpls.js',
    view    : 'views.js'
}

var tempFiles = []
// To make Handlebars.templates[partialName] works, which exposes the uniform interface.
// So here, we rename the partial views as views
function renamePartials (dir) {
    return new Promise(function (resolve, reject) {
        var ext = CONFIG.template.partialExt.replace(/[\\^$*+?.():=!|{}\-\[\]]/g, function(arg) { return '\\' + arg; });
        ext = new RegExp('\\.' + ext + '$');
        var paths = sys.fs.readdirSync(dir).map(function (item, i) { return sys.path.join(dir, item); });
        var file, dest;
        while(paths.length){
            file = paths.pop();
            if(ext.test(file)){
                dest = file.replace(ext, '.' + CONFIG.template.ext);
                tempFiles.push(dest);
                sys.fs.renameSync(file, dest);
            }
        }
        resolve(dir);
    });
}
function recoverPartials (dir) {
    return new Promise(function (resolve, reject) {
        var file, dest;
        while(tempFiles.length){
            file = tempFiles.pop();
            dest = file.replace(CONFIG.template.ext, CONFIG.template.partialExt);
            sys.fs.renameSync(file, dest);
        }
        resolve(dir);
    });
}

// excute the handlebars precompiling actions
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
// merge partial views, views and custom helpers into views.js
function merge (dir) {
    return new Promise(function (resolve, reject){
        var filepaths = [
            sys.path.join(dir, FILE.partial), 
            sys.path.join(dir, FILE.tmpl)
        ];
        var tempFiles = [].concat(filepaths);
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
                tempFiles.forEach(function (file, i) {
                    sys.fs.unlinkSync(file);
                });
                AppLog.progress('View file is created.');
                resolve({viewpath: viewpath, code: code});
            }).catch(function (err) {
                AppLog.error(err.message);
                reject(err);
            });
    });
}
// compile handlebars templates
function compile (filename) {
    var dirname = filename.replace(/(\.min)?\.js$/, '');
    if(!sys.fs.existsSync(dirname)) 
        return Promise.resolve({});
    return excute(dirname)
            .then(renamePartials)
            .then(excute)
            .then(recoverPartials)
            .then(merge);
}

module.exports = compile;
