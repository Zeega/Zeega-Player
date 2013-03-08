define([
    "backbone",
    "jquery",
    "jqueryUI",
    "plugins/backbone.layoutmanager"
],

function( Backbone, jquery ) {
    // Provide a global location to place configuration settings and module
    // creation.
    var app = {
        // The root path to run the application.
        root: "/",
        gmapAPI: "waiting"
    };

    // Localize or create a new JavaScript Template object.
    var JST = window.JST = window.JST || {};

    var zeegaJQuery = jquery;
    var zeegaBackbone = Backbone;
    zeegaBackbone.$ = zeegaJQuery; // set backbone jquery

    // Curry the |set| method with a { silent: true } version
    // to avoid repetitious boilerplate code throughout project
    zeegaBackbone.Model.prototype.put = function() {
        var args = [].slice.call( arguments ).concat([ { silent: true } ]);
        return this.set.apply( this, args );
    };

    zeegaBackbone.View.prototype.fetch = function( path ) {
        // Initialize done for use in async-mode
        var done;

        // Concatenate the file extension.
        path = "app/templates/"+ path + ".html";

        // If cached, use the compiled template.
        if ( JST[ path ] ) {
            return JST[ path ];
        } else {
            // Put fetch into `async-mode`.
            done = this.async();

            // Seek out the template asynchronously.
            return Zeega.$.ajax({ url: Zeega.root + path }).then(function(contents) {
                done( JST[path] = _.template(contents) );
            });
        }
    };

    // Mix Backbone.Events, modules, and layout management into the app object.
    return _.extend(app, {
        // Create a custom object with a nested Views object.
        module: function( additionalProps ) {
            return _.extend({ Views: {} }, additionalProps);
        },

        Backbone: zeegaBackbone,
        $: zeegaJQuery

    }, zeegaBackbone.Events );

});
