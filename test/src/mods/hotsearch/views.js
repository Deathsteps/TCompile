
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
