// Set the require.js configuration for your application.
require.config({

	// Initialize the application with the main application file.
	deps: ["main"],

	paths: {
		// JavaScript folders.
		libs: "../assets/js/libs",
		plugins: "../assets/js/plugins",
		vendor: "../assets/vendor",

		// Libraries.
		jquery: "../assets/js/libs/jquery",
		lodash: "../assets/js/libs/lodash",
		backbone: "../assets/js/libs/backbone",

		player: "../app/modules/player",
		zeega_plugins: "../app/modules/plugins",
		zeega_layers: "../app/modules/plugins/layers"
	},

	shim: {
		// Backbone library depends on lodash and jQuery.
		backbone: {
			deps: ["lodash", "jquery"],
			exports: "Backbone"
		},

		// Backbone.LayoutManager depends on Backbone.
		"plugins/backbone.layoutmanager": ["backbone"],
		'libs/spin' : ['jquery']

	}

});
