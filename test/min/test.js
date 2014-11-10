
/**BuildTime: Tue Nov 04 2014 15:33:24 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to lovely_dreamer@126.com*/
define("tools/tool",[],function(require,exports){exports.multiply=function(n,t){return n*t};var n=function(){};n.prototype={on:function(){}},exports.EventEmitter=n});;

/**BuildTime: Tue Nov 04 2014 15:34:16 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to lovely_dreamer@126.com*/
define("mods/quickview",[],function(require,exports,module){function n(){}n.prototype.show=function(n){return n},module.exports=n});;

/**BuildTime: Thu Nov 06 2014 20:53:37 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define("webresource/search",[],function(require,exports){exports.getCode=function(){return"search"}});;
/**BuildTime: Thu Nov 06 2014 20:53:37 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define(function(require){QUnit.module("Base");var e=require("tools/tool"),s=require("mods/quickview");QUnit.test("Require synchronously",function(c){c.equal(typeof e,"object","Import tools/tool successfully"),c.equal(e.multiply(2,3),6,"Tools.multiply excutes successfully"),c.equal(typeof s,"function","Import mods/quickview successfully"),c.equal((new s).show("QuickView"),"QuickView","QuickView.show excutes successfully")});var c=require("webresource/search");QUnit.test("Compress dependent files while compiling the specified file",function(e){e.equal(typeof c,"object","Import webresource/search successfully"),e.equal(c.getCode(),"search","searcher.getCode excutes successfully")}),QUnit.asyncTest("Require asynchronously",function(e){expect(2),require.async("tools/tab",function(s){e.equal(typeof s,"function","Import tools/tab asynchronously successfully"),e.equal((new s).switchTo(2),2,"Tab.switchTo excutes successfully"),QUnit.start()})})});