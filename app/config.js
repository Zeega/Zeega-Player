// Set the require.js configuration for your application.
require.config({

	// Initialize the application with the main application file.
	deps: [ "main" ],

	paths: {
		// JavaScript folders.
		libs: "../assets/js/libs",
		plugins: "../assets/js/plugins",
		vendor: "../assets/vendor",

		//player: "../app/modules/player",
		zeega_dir: "../app/modules"
		//zeega_layers: "../app/modules/plugins/layers"
	}

});
