var sys = {};
sys.child_process = require('child_process');
sys.fs     = require('fs');
sys.path   = require('path');

var CONFIG = require('./config');
var AppLog = require('./log').init('T compile');

function setJsDocConfig () {
    var conf = require('./jaguarjs/conf.json');
    conf.source = CONFIG.jsdoc.source;
    var filepath = sys.path.join(__dirname, 'jaguarjs/conf.json');
    var code = JSON.stringify(conf, null, 4);
    sys.fs.writeFileSync(filepath, code);
}

function excute () {
    var themePath = sys.path.join(__dirname, 'jaguarjs');
    var cmd = ['-t', themePath, '-c', sys.path.join(themePath, 'conf.json')].join(' ');
    cmd = ['node', CONFIG.jsdoc.command, CONFIG.path.project, '-r', cmd, '-d', CONFIG.path.docs].join(' ');

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