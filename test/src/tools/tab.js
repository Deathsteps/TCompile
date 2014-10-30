define(function (require, exports, module) {
	var Tools = require('tools/Tool');

	function Tab(){
		
	}
	Tab.prototype.switchTo = function (index){
		return index;
	}
	Tab.prototype.multiply = function (a, b){
		return Tools.multiply(a,b);
	}
	
	module.exports = Tab;
	
});