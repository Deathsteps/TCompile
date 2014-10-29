/**
 * @fileoverview 常用函数
 * @module  Tool
 * @author	Deathsteps
 * @version 1.0
 * @requires seajs
 * @requires cQuery or jQuery
 * @example
 * var Tool = require('tools/Tool');
 * var result = Tool.multiply(1, 2);
 */
define(function (require, exports, module) {

    /**
     * multiply
     * @param  {Number} a number a
     * @param  {Number} b number b
     * @return {Number} result
     */
	exports.multiply = function (a, b){
		return a * b;
	}


    /**
     * @class EventEmitter
     * @constructs EventEmitter
     * @param {Object} obj Target object
     */
    var EventEmitter = function(obj){

    };

    EventEmitter.prototype = {
        /**
         * add an event handler to the specified event
         * @param  {String} evtName event name
         * @param  {Function} handler handler function
         * @return {EventEmitter} this
         */
        on: function (evtName, handler) {
            
        }
    }

    exports.EventEmitter = EventEmitter;
	
});
