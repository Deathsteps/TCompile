define(function (require, exports, module) {
	var testStr = [
		'<h1>Normal Title</h1>',
		'<p>abc - 123</p>',
		'<p>Lily - Baker</p>'
	];
	
	QUnit.test( "Module in mods, Handlebars templates precompiling", function( assert ) {
		var hotsearch = require('mods/hotsearch');
		var html = hotsearch.render();
		assert.ok(html.indexOf(testStr[0]) != -1, 'Normal template works.');
	});
	
});
