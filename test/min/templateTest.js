!function(){Handlebars.template,Handlebars.templates=Handlebars.templates||{}}();
!function(){var a=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e.customHelper=a({1:function(a,e,l,n){var t,s="function",i=e.helperMissing,r=this.escapeExpression;return"  <p>"+r((t=null!=(t=e.firstName||(null!=a?a.firstName:a))?t:i,typeof t===s?t.call(a,{name:"firstName",hash:{},data:n}):t))+" - "+r((t=null!=(t=e.lastName||(null!=a?a.lastName:a))?t:i,typeof t===s?t.call(a,{name:"lastName",hash:{},data:n}):t))+"</p>\r\n"},compiler:[6,">= 2.0.0-beta.1"],main:function(a,e,l,n){var t,s=e.helperMissing,i='<div class="custom">\r\n';return t=(e.list||a&&a.list||s).call(a,null!=a?a.people:a,{name:"list",hash:{},fn:this.program(1,n),inverse:this.noop,data:n}),null!=t&&(i+=t),i+"</div>"},useData:!0}),e.normal=a({compiler:[6,">= 2.0.0-beta.1"],main:function(a,e,l,n){var t,s="function",i=e.helperMissing,r=this.escapeExpression;return'<div class="entry">\r\n  <h1>'+r((t=null!=(t=e.title||(null!=a?a.title:a))?t:i,typeof t===s?t.call(a,{name:"title",hash:{},data:n}):t))+'</h1>\r\n  <div class="body">\r\n    '+r((t=null!=(t=e.body||(null!=a?a.body:a))?t:i,typeof t===s?t.call(a,{name:"body",hash:{},data:n}):t))+"\r\n  </div>\r\n</div>"},useData:!0}),e.view=a({compiler:[6,">= 2.0.0-beta.1"],main:function(a,e,l,n){var t,s,i="function",r=e.helperMissing,o=this.escapeExpression,u='<h1>Hello world</h1>  \r\n<div class="view">\r\n  <h2>'+o((s=null!=(s=e.title||(null!=a?a.title:a))?s:r,typeof s===i?s.call(a,{name:"title",hash:{},data:n}):s))+'</h2>\r\n  <div class="body">\r\n';return t=this.invokePartial(l.customHelper,"    ","customHelper",a,void 0,e,l,n),null!=t&&(u+=t),u+"  </div>\r\n</div>"},usePartial:!0,useData:!0})}();
;

(function (Handlebars) {

Handlebars.registerHelper('list', function(items, options) {
  var out = "<ul>";
  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }
  return out + "</ul>";
});
	
})(Handlebars);
;
/**BuildTime: Thu Nov 06 2014 22:04:46 GMT+0800 (中国标准时间)
 *If you found any bug, please mail to shiz@ctrip.com*/
define(function(require){var e={title:"Normal Title",body:"<p>This is a post about &lt;p&gt; tags</p>"},t={people:[{firstName:"abc",lastName:"123"},{firstName:"def",lastName:"456"}]},a={title:"View Title",body:"View Body",people:[{firstName:"John",lastName:"Smith"},{firstName:"Lily",lastName:"Baker"}]},l=["<h1>Normal Title</h1>","<p>abc - 123</p>","<p>Lily - Baker</p>"];QUnit.test("Handlebars templates precompiling",function(i){require("webresource/templateTest/views"),require("tools/helpers");var s=[Handlebars.templates.normal(e),Handlebars.templates.customHelper(t),Handlebars.templates.view(a)];i.ok(-1!=s[0].indexOf(l[0]),"Normal template works."),i.ok(-1!=s[1].indexOf(l[1]),"CustomHelper tempalte works"),i.ok(-1!=s[2].indexOf(l[2]),"View with partial view tempalte works")})});