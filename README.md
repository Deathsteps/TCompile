# TCompile v0.1

TCompile is a compress/merge tool for ctrip/Taocan project. It will compress the module and merge the dependent modules into the main module. 

## Quick Start

* Install: download the source, then run the npm command: `npm install [TCompile directory]`
* Modify the config.js and config the project file path information in it.
* Run the Tcompile command in shell. 

## Commands

`Tcompile [filename1][,filename2][,..]`. 

This command will excute the follow steps: 

First, compress the source files in the src directory;

Second, merge the dependences required in the source files;

Last, write content into the target files and check in.

`Tcompile -tools [filename1][,filename2][,..]` or `Tcompile -mods [filename1][,filename2][,..]`.

These two command will only call the compression action on the source files. They are used in the situation that compile the tool modules and common business modules.

## Tips

* In order to merge the dependences into the main module, make sure that the module definition match the [seajs](http://seajs.org/docs/) CMD pattern.
* The tool will also checkout/checkin the target file. So you dont have to care about the tfs stuff. 
