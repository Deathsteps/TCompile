define(function (require, exports, module) {
	QUnit.module( "Tool in tool" );

	var Tab = require('tools/Tab');
	
	QUnit.test( "Tool module contains the other", function( assert ) {
		assert.equal(typeof Tab, 'function', 'Import tools/tab asynchronously successfully');
		assert.equal(new Tab().switchTo(2), 2, 'Tab.switchTo excutes successfully');
		assert.equal(new Tab().multiply(2, 3), 6, 'Tab.multiply excutes successfully');
	});
	
});
