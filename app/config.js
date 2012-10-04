// Set the require.js configuration for your application.
require.config({

	// Initialize the application with the main application file.
	deps: [ "modules/player/player" ],

	paths: {
		// JavaScript folders.
		libs: "../assets/js/libs",
		plugins: "../assets/js/plugins",
		vendor: "../assets/vendor",

		player: "../app/modules/player",
		zeega_plugins: "../app/modules/plugins",
		zeega_layers: "../app/modules/plugins/layers"
	}

});
