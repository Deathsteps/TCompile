var sys      = {};
sys.fs       = require('fs');
sys.path     = require('path');
sys.repl     = require('repl');

var config   = require('./config.json');
var AppLog   = require('./tools/log').init('T compile');

var MESSAGES = {
	inputKey   : 'The key you want to modify.',
	inputValue : 'The value you want to set',
	nextKey    : 'Input .exit to save or input another key'
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
		var code = (command === 'true' || command === 'false' || !isNaN(Number(command)))
			? (' = '+ command ) : (' = "'+ command + '"');
		code = 'config.'+ keyStr + code;
		(new Function('config', code))(config); // set the value
		AppLog.progress(MESSAGES.nextKey);
	}

	isKey = !isKey; // change the mode
}

function save () {
	var filepath = sys.path.join(__dirname, 'config.json');
	var code = JSON.stringify(config, null, 4);
	sys.fs.writeFileSync(filepath, code);

	process.exit();
}

module.exports = function (){
	var  cmd = arguments[0];

	if(cmd == 'showConfig'){
		console.log(
			require('util').inspect(config, {colors: true}));
	}else{
		sys.repl.start({
			prompt: "",
			input: process.stdin,
			output: process.stdout,
			eval: eval
		}).on('exit', save);

		AppLog.progress(MESSAGES.inputKey);
	}


}

