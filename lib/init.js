var sys      = {};
sys.fs       = require('fs');
sys.path     = require('path');
sys.repl     = require('repl');

var config   = require('./config');
var AppLog   = require('./log').init('T compile');

var MESSAGES = {
	inputKey   : 'The key you want to modify.',
	inputValue : 'The value you want to set',
	success    : 'Set successfully'
}

var isKey    = true, keyStr;
var rCommand = /\(([^\n\r]+)\n\)/;

function eval(cmd, context, filename, callback) {
	var matches = cmd.match(rCommand);
	if(!matches){
		AppLog.warn('Invalid Value');
		return;
	}
	var command = matches[1];

	if(isKey){
		keyStr = command; // remember the key
		AppLog.progress(MESSAGES.inputValue);
	}else{
		command = command.replace(/\\/g, '\\\\'); // escape slashes
		var code = 'config.'+ keyStr +' = "'+ command + '"';
		(new Function('config', code))(config); // set the value
		AppLog.progress(MESSAGES.success);
		AppLog.progress(MESSAGES.inputKey);
	}

	isKey = !isKey; // change the mode
}

function save () {
	var filepath = sys.path.join(__dirname, 'config.js');
	var code = 'module.exports = ' + JSON.stringify(config, null, 4);
	sys.fs.writeFileSync(filepath, code);

	process.exit();
}

module.exports = function (){
	sys.repl.start({
		prompt: "",
		input: process.stdin,
		output: process.stdout,
		eval: eval
	}).on('exit', save);

	AppLog.progress(MESSAGES.inputKey);
}

