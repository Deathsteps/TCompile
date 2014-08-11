# TCompile v0.1

TCompile is a compress/merge tool for ctrip/Taocan project. It will compress the module and merge the dependent modules into the main module. 

## Quick Start

* Install: download the source, then run the npm command: `npm install [TCompile directory]`
* Modify the config.js and config the project file path information in it.
* Run the cweb command in shell, for example `Tcompile [filename1][,filename2][,..]`

## Tips

* In order to merge the dependences into the main module, make sure that the module definition match the [seajs](http://seajs.org/docs/) CMD pattern.
* The tool will also checkout/checkin the target file. So you dont have to care about the tfs stuff. 
