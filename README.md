# TCompile v0.2.0

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

## Tips

* In order to merge the dependences into the main module, make sure that the module definition match the [seajs](http://seajs.org/docs/) CMD pattern.
* The tool will also checkout/checkin the target file. So you dont have to care about the tfs stuff. 