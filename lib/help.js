var sys      = {};
sys.fs       = require('fs');
sys.path     = require('path');

var AppLog   = require('./tools/log').init('T compile');

var filepath = sys.path.join(__dirname.replace(/lib$/, ''), 'README.md');

module.exports = function (){
	sys.fs.readFile(filepath, 'utf-8', function (err, content){
		if(err){
			AppLog.error(err.message);
			return;
		}

		var matches = content.match(/## Commands([^#]+)##/);
		if(matches){
			console.log(matches[1]);
		}
	});
}
