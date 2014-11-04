/**BuildTime: Sun Sep 28 2014 18:34:36 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define("tools/tool",[],function(require,exports){exports.multiply=function(n,i){return n*i}});;
/**BuildTime: Sun Sep 28 2014 18:34:57 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define("mods/quickview",[],function(require,exports,module){function n(){}n.prototype.show=function(n){return n},module.exports=n});;

/**BuildTime: Tue Nov 04 2014 14:45:24 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define("webresource/app/search",[],function(require,exports){exports.getCode=function(){return"search"}});;
/**BuildTime: Tue Nov 04 2014 14:45:24 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define(function(require){QUnit.module("In app/test");var e=require("tools/tool"),s=require("mods/quickview");QUnit.test("Require synchronously ",function(t){t.equal(typeof e,"object","Import tools/tool successfully"),t.equal(e.multiply(2,3),6,"Tools.multiply excutes successfully"),t.equal(typeof s,"function","Import mods/quickview successfully"),t.equal((new s).show("QuickView"),"QuickView","QuickView.show excutes successfully")});var t=require("webresource/app/search");QUnit.test("Compress dependent files while compiling the specified file",function(e){e.equal(typeof t,"object","Import webresource/search successfully"),e.equal(t.getCode(),"search","searcher.getCode excutes successfully")}),QUnit.asyncTest("Require asynchronously",function(e){expect(2),require.async("tools/tab",function(s){e.equal(typeof s,"function","Import tools/tab in app/test asynchronously successfully"),e.equal((new s).switchTo(2),2,"Tab.switchTo excutes successfully"),QUnit.start()})})});