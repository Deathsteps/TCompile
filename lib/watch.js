var sys         = {};
sys.fs          = require('fs');
sys.path        = require('path');

var Promise     = require("bluebird");
var CONFIG      = require('./config.json');
var AppLog      = require('./tools/log').init('T compile');
var compileView = require('./tmpl');

function watch (dirname) {

    var timer, inCompiling = false;

    var watcher = sys.fs.watch(dirname, function (evt, filename) {
        if( inCompiling || sys.path.extname(filename) != ('.' + CONFIG.template.ext) ) return;
        clearTimeout(timer);
        timer = setTimeout(function () {
            inCompiling = true;
            compileView(dirname)
                .then(function () { inCompiling = false; })
                .catch(function (err) { inCompiling = false; });
        }, 1000);
    })

    var rl = 
        require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        }).on('line', function (cmd) {
            if(cmd == 'stop'){
                watcher.close();
                rl.close();
            }
        });
}

module.exports = watch;
