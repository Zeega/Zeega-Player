// Set the require.js configuration for your application.
require.config({

    // Initialize the application with the main application file.
    deps: [ "main" ],

    paths: {
        // JavaScript folders.
        libs: "../assets/js/libs",
        plugins: "../assets/js/plugins",
        vendor: "../assets/vendor",
        zeega_dir: "../app/modules",
        zeega_parser: "../app/zeega-parser",

        // Libraries.
        jquery: "../assets/js/libs/jquery",
        jqueryUI: "../assets/js/plugins/jquery-ui/js/jquery-ui-1.10.1.custom",
        lodash: "../assets/js/libs/lodash",
        backbone: "../assets/js/libs/backbone"

        // Plugins
        //imagesLoaded: "../assets/js/plugins/jquery/imagesloaded.min.js",
        //cycle: "../assets/js/plugins/jquery/cycle.js"

    },
    shim: {
        // Backbone library depends on lodash and jQuery.
        backbone: {
            deps: [ "lodash", "jquery" ],
            exports: "Backbone"
        },

        // Plugins
        jqueryUI: ["jquery"],
        "plugins/imagesloaded.min": ["jquery"],
        "plugins/cycle": ["jquery"],

        // Backbone.LayoutManager depends on Backbone.
        "plugins/backbone.layoutmanager": [ "backbone" ]
    }

});
