JSMVC.define('HelloWorld.controller.Test', {
	views : ['Test'],
	models : ['Test'],
	name : 'Test',

	init : function() { /* This method is not necessary */
		console.log('"Test" controller initialized.');
	}
});