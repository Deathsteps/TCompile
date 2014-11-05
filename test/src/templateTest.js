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
	
	var testStr = [
		'<h1>Normal Title</h1>',
		'<p>abc - 123</p>',
		'<p>Lily - Baker</p>'
	];
	
	QUnit.test( "Handlebars templates precompiling", function( assert ) {
		require('webresource/templateTest/views');
	
		var htmls = [
			Handlebars.templates["normal"](data1),
			Handlebars.templates["customHelper"](data2),
			Handlebars.templates["view"](data3)
		];

		assert.ok(htmls[0].indexOf(testStr[0]) != -1, 'Normal template works.');
		assert.ok(htmls[1].indexOf(testStr[1]) != -1, 'CustomHelper tempalte works');
		assert.ok(htmls[2].indexOf(testStr[2]) != -1, 'View with partial view tempalte works');
	});
	
});
