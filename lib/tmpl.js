var sys           = {};
sys.child_process = require('child_process');
sys.fs            = require('fs');
sys.path          = require('path');

var CONFIG        = require('./config.json');
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

function checkoutView (viewpath) {
    return new Promise(function (resolve, reject){
        if(!sys.fs.existsSync(viewpath)) return resolve();
        var stat = sys.fs.statSync(viewpath);
        if(stat.mode != 33060) return resolve();

        var tfs = require('./tools/tfs');
        tfs.setEnv(); // set the path of the tf command tool
        tfs.checkout(viewpath, function () {
            resolve();
        }); 
    });
}
// excute the handlebars precompiling actions
function precompile (dir) {
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
                tempFiles.length && recoverPartials(dir); // undo the renamePartials
                return reject(err);
            }
            resolve(dir);
        });
    });
}
// seal it into a CMD module
function wrap (code) {
    return 'define(null, ["tools/handlebars.runtime.js"], function(require, exports, module){require("tools/handlebars.runtime.js");' + code + '});';
}
// merge partial views, views and custom helpers into views.js
function merge (dir) {
    return new Promise(function (resolve, reject){
        var filepaths = [
            sys.path.join(dir, FILE.partial), 
            sys.path.join(dir, FILE.tmpl)
        ];
        var code = '', viewpath = sys.path.join(dir, FILE.view);
        // deal with ready-only view file
        var promise = checkoutView(viewpath);
        // read files in turns
        for (var i = filepaths.length; i >= 0; i--) {
            promise = 
                promise.then(function (content) {
                    if(typeof content !== 'undefined'){
                        code += content + CONFIG.CRLF;
                        sys.fs.unlinkSync(filepaths.shift());
                    }
                    return filepaths.length > 0 ?
                        sys.fs.readFileAsync(filepaths[0], 'utf-8') :
                        sys.fs.writeFileAsync(viewpath, wrap(code), 'utf-8');
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
// compile handlebars templates
function compile (file) {
    return new Promise(function (resolve, reject){
        var filename = typeof file === 'string' ? file : file.filePath;
        var dirname = filename.replace(/(\.min)?\.js$/, '');
        if(!sys.fs.existsSync(dirname)) 
            resolve(file);
        else
            precompile(dirname)
                .then(renamePartials)
                .then(precompile)
                .then(recoverPartials)
                .then(merge)
                .then(function () { resolve(file); })
                .catch(function (err) {
                    AppLog.error(err.message);
                    reject(err);
                });
    });
}

module.exports = compile;
