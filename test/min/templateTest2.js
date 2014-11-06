define("mods/hotsearch/views",[],function(require, exports, module){

(function (Handlebars) {

Handlebars.registerHelper('list', function(items, options) {
  var out = "<ul>";
  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }
  return out + "</ul>";
});
	
})(Handlebars);

!function(){var a=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e.normal=a({compiler:[6,">= 2.0.0-beta.1"],main:function(a,e,l,n){var t,s="function",r=e.helperMissing,i=this.escapeExpression;return'<div class="entry">\r\n  <h1>'+i((t=null!=(t=e.title||(null!=a?a.title:a))?t:r,typeof t===s?t.call(a,{name:"title",hash:{},data:n}):t))+'</h1>\r\n  <div class="body">\r\n    '+i((t=null!=(t=e.body||(null!=a?a.body:a))?t:r,typeof t===s?t.call(a,{name:"body",hash:{},data:n}):t))+"\r\n  </div>\r\n</div>"},useData:!0})}();
!function(){Handlebars.template,Handlebars.templates=Handlebars.templates||{}}();

});;
/**BuildTime: Tue Nov 04 2014 17:36:11 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to lovely_dreamer@126.com*/
define("mods/hotsearch",[],function(require,exports){var t={title:"Normal Title",body:"<p>This is a post about &lt;p&gt; tags</p>"};require("mods/hotsearch/views"),exports.render=function(){return Handlebars.templates.normal(t)}});;
/**BuildTime: Thu Nov 06 2014 20:18:48 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define(function(require){var e=["<h1>Normal Title</h1>","<p>abc - 123</p>","<p>Lily - Baker</p>"];QUnit.test("Module in mods, Handlebars templates precompiling",function(a){var n=require("mods/hotsearch"),o=n.render();a.ok(-1!=o.indexOf(e[0]),"Normal template works.")})});