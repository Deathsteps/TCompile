# TCompile v0.2.2

TCompile is a compress/merge tool for ctrip/Taocan project. It will compress the module and merge the dependent modules into the main module. 

## Quick Start

* Install: Run the npm command: `npm install -g tcompile`
* Run the Tcompile init command to initialize the tool configuration. 
* Run the Tcompile command in shell. 

## Commands

`Tcompile [filename1][,filename2][,..]`. 

This command will excute the follow steps: 
* First, compress the source files in the src directory;
* Second, merge the dependences required in the source files;
* Last, write content into the target files and check in.

`Tcompile -tools [filename1][,..]` or `Tcompile -mods [filename1][,..]`.

These two command will only call the compression action on the source files. They are used in the situation that compile the tool modules and common business modules.

`Tcompile -compress [filename1][,..]`

Compress the specified files that doesnt rely on the directories which were defined in the config file. 

`Tcompile -init`

This command will build a repl to let you initialize the tool configuration. Regularly, you should set the values of `mail` and `path`.

`Tcompile -help`

It will show you the usage of the commands.

`Tcompile -doc`

It will make the documents of your project codes by using jsdoc3. The source path and destination path are both configuated in the config.json. If you want to use this feature, make sure you write comments in jsdoc style.

## Config details

* `mail`: the email signature which will be added to the head of the compressed file
* `checkinAfterSave`: whether to check in files or not when compiling progress finished
* `jsdoc`: see how to configuate it in http://usejsdoc.org/about-configuring-jsdoc.html

		{
			"mail": "shiz@ctrip.com",
			"CRLF": "\r\n",	
			"checkinAfterSave": false,
			"path": {
				"project": "d:\\Users\\shiz\\Desktop\\T-compile\\test",
				"docs": "d:\\Users\\shiz\\Desktop\\T-compile\\test\\docs"
			},
			"jsdoc": {
				"source": {
					"includePattern": ".+\\.js$",
					"excludePattern": "(^|\\/|\\\\)_|(docs|min)\\\\"
				}
			}
		}

## Tips

* In order to merge the dependences into the main module, make sure that the module definition match the [seajs](http://seajs.org/docs/) CMD pattern.
* The tool will also checkout/checkin the target file. So you dont have to care about the tfs stuff. 