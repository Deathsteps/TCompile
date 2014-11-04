/**BuildTime: Wed Oct 29 2014 17:17:49 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define("tools/Tab",["tools/Tool"],function(require,exports,module){function t(){}var o=require("tools/Tool");t.prototype.switchTo=function(t){return t},t.prototype.multiply=function(t,n){return o.multiply(t,n)},module.exports=t});;
/**BuildTime: Sun Sep 28 2014 18:34:36 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define("tools/Tool",[],function(require,exports){exports.multiply=function(n,i){return n*i}});;
/**BuildTime: Tue Nov 04 2014 14:43:56 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define(function(require){QUnit.module("Tool in tool");var o=require("tools/Tab");QUnit.test("Tool module contains the other",function(t){t.equal(typeof o,"function","Import tools/tab asynchronously successfully"),t.equal((new o).switchTo(2),2,"Tab.switchTo excutes successfully"),t.equal((new o).multiply(2,3),6,"Tab.multiply excutes successfully")})});