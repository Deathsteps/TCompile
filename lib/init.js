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

function extend (target) {
	for (var i = 0; i < arguments.length; i++) {
		var source = arguments[i];
		for(var k in source){
			if(!source.hasOwnProperty(k)) continue;
			if(typeof target[k] === 'object' && typeof source === 'object')
				extend(target[k], source[k]);
			else
				target[k] = source[k];
		}
	};
}

function showConfig () {
	console.log(require('util').inspect(config, {colors: true}));
}

function setConfig() {
	sys.repl.start({
		prompt: "",
		input: process.stdin,
		output: process.stdout,
		eval: eval
	}).on('exit', save);

	AppLog.progress(MESSAGES.inputKey);
}

function setProject(projectName) {
	if(projectName){
		var projectConfig = require(config.projectConfig[projectName]);
		extend(config, projectConfig);
	}

	if(config.path.src && config.path.src.indexOf(config.path.project) == -1)
		["src", "min", "tools", "mods"].forEach(function (item, i) {
			config.path[item] = sys.path.join(config.path.project, item);
		});
	if(!config.path.docs)
		config.path.docs = sys.path.join(config.path.project, 'docs');

	save();
}

module.exports = function (cmd) {
	switch(cmd[0]){
		case 'config'     : setConfig(); break;
		case 'showConfig' : showConfig(); break;
		case 'setProject' : setProject(cmd[1]); break;
		default           : break;
	}
}