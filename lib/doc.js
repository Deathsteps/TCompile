var sys = {};
sys.child_process = require('child_process');
sys.fs     = require('fs');
sys.path   = require('path');

var CONFIG = require('./config');
var AppLog = require('./tools/log').init('T compile');

function setJsDocConfig () {
    var conf = require('./jaguarjs/conf.json');
    conf.source = CONFIG.jsdoc.source;
    var filepath = sys.path.join(__dirname, 'jaguarjs/conf.json');
    var code = JSON.stringify(conf, null, 4);
    sys.fs.writeFileSync(filepath, code);
}

function excute () {
    var themePath = sys.path.join(__dirname, 'jaguarjs');
    var readme = sys.path.join(CONFIG.path.project, 'README.md');

    var jsdocPath = sys.path.resolve(__dirname, '..');
    jsdocPath = sys.path.join(jsdocPath, 'node_modules/jsdoc/jsdoc.js');

    var cmd = [
        '-t', themePath,
        '-c', sys.path.join(themePath, 'conf.json'),
        '-u', sys.path.join(CONFIG.path.project, 'tutorials'),
        '-d', CONFIG.path.docs
    ].join(' ');
    cmd = ['node', jsdocPath, CONFIG.path.project, readme, '-r', cmd].join(' ');

    sys.child_process.exec(cmd, function (err, stdout, stderr){
        if(err || stderr){
            return AppLog.error(err || stderr);
        }
        AppLog.progress("Documents are created!");
    });
}

module.exports = function () {
    setJsDocConfig();
    excute();
};
