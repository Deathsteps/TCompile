define(function (require, exports, module) {
	var data1 = {
		title: "Normal Title",
		body: "<p>This is a post about &lt;p&gt; tags</p>"
	};
	var data2 = {
		people: [
			{firstName: "abc", lastName: "123"},
			{firstName: "def", lastName: "456"}
		]
	}
	var data3 = {
		title: "View Title",
		body: "View Body",
		people: [
			{firstName: "John", lastName: "Smith"},
			{firstName: "Lily", lastName: "Baker"}
		]
	};

	require('mods/hotsearch/views');
	exports.render = function (){
		return Handlebars.templates["normal"](data1);
	}
	
});