define(function (require, exports, module) {
	QUnit.module( "In app/test" );

	var Tools = require('tools/tool');
	var QuickView  = require('mods/quickview');
	
	QUnit.test( "Require synchronously ", function( assert ) {
		assert.equal(typeof Tools, 'object', 'Import tools/tool successfully');
		assert.equal(Tools.multiply(2, 3), 6, 'Tools.multiply excutes successfully');

		assert.equal(typeof QuickView, 'function', 'Import mods/quickview successfully');
		assert.equal(new QuickView().show('QuickView'), 'QuickView', 'QuickView.show excutes successfully');
	});

	var searcher = require('webresource/app/search');
	QUnit.test( "Compress dependent files while compiling the specified file", function( assert ) {
		assert.equal(typeof searcher, 'object', 'Import webresource/search successfully');
		assert.equal(searcher.getCode(), 'search', 'searcher.getCode excutes successfully');
	});
	
	QUnit.asyncTest( "Require asynchronously", function( assert ) {
		expect( 2 );
		require.async('tools/tab', function (Tab){
			assert.equal(typeof Tab, 'function', 'Import tools/tab in app/test asynchronously successfully');
			assert.equal(new Tab().switchTo(2), 2, 'Tab.switchTo excutes successfully');
			QUnit.start();
		});
	});
	
});
