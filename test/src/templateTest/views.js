
(function (Handlebars) {

Handlebars.registerHelper('list', function(items, options) {
  var out = "<ul>";
  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }
  return out + "</ul>";
});
	
})(Handlebars);

!function(){var a=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e.customHelper=a({1:function(a,e,l,n){var t,s="function",i=e.helperMissing,r=this.escapeExpression;return"  <p>"+r((t=null!=(t=e.firstName||(null!=a?a.firstName:a))?t:i,typeof t===s?t.call(a,{name:"firstName",hash:{},data:n}):t))+" - "+r((t=null!=(t=e.lastName||(null!=a?a.lastName:a))?t:i,typeof t===s?t.call(a,{name:"lastName",hash:{},data:n}):t))+"</p>\r\n"},compiler:[6,">= 2.0.0-beta.1"],main:function(a,e,l,n){var t,s=e.helperMissing,i='<div class="custom">\r\n';return t=(e.list||a&&a.list||s).call(a,null!=a?a.people:a,{name:"list",hash:{},fn:this.program(1,n),inverse:this.noop,data:n}),null!=t&&(i+=t),i+"</div>"},useData:!0}),e.normal=a({compiler:[6,">= 2.0.0-beta.1"],main:function(a,e,l,n){var t,s="function",i=e.helperMissing,r=this.escapeExpression;return'<div class="entry">\r\n  <h1>'+r((t=null!=(t=e.title||(null!=a?a.title:a))?t:i,typeof t===s?t.call(a,{name:"title",hash:{},data:n}):t))+'</h1>\r\n  <div class="body">\r\n    '+r((t=null!=(t=e.body||(null!=a?a.body:a))?t:i,typeof t===s?t.call(a,{name:"body",hash:{},data:n}):t))+"\r\n  </div>\r\n</div>"},useData:!0}),e.view=a({compiler:[6,">= 2.0.0-beta.1"],main:function(a,e,l,n){var t,s,i="function",r=e.helperMissing,o=this.escapeExpression,u='<div class="view">\r\n  <h1>'+o((s=null!=(s=e.title||(null!=a?a.title:a))?s:r,typeof s===i?s.call(a,{name:"title",hash:{},data:n}):s))+'</h1>\r\n  <div class="body">\r\n';return t=this.invokePartial(l.customHelper,"    ","customHelper",a,void 0,e,l,n),null!=t&&(u+=t),u+"  </div>\r\n</div>"},usePartial:!0,useData:!0})}();
!function(){var a=Handlebars.template;Handlebars.templates=Handlebars.templates||{},Handlebars.partials.customHelper=a({1:function(a,e,l,s){var t,n="function",r=e.helperMissing,i=this.escapeExpression;return"  <p>"+i((t=null!=(t=e.firstName||(null!=a?a.firstName:a))?t:r,typeof t===n?t.call(a,{name:"firstName",hash:{},data:s}):t))+" - "+i((t=null!=(t=e.lastName||(null!=a?a.lastName:a))?t:r,typeof t===n?t.call(a,{name:"lastName",hash:{},data:s}):t))+"</p>\r\n"},compiler:[6,">= 2.0.0-beta.1"],main:function(a,e,l,s){var t,n=e.helperMissing,r='<div class="custom">\r\n';return t=(e.list||a&&a.list||n).call(a,null!=a?a.people:a,{name:"list",hash:{},fn:this.program(1,s),inverse:this.noop,data:s}),null!=t&&(r+=t),r+"</div>"},useData:!0})}();
