define([
    "backbone",
    "jquery",
    "spin",
    "jqueryUI",
    "plugins/backbone.layoutmanager",
],

function( Backbone, jquery, Spinner ) {
    // Provide a global location to place configuration settings and module
    // creation.
    var app = {
        // The root path to run the application.
        root: "/",
        gmapAPI: "waiting",
        spinner: new Spinner({
            lines: 13, // The number of lines to draw
            length: 7, // The length of each line
            width: 4, // The line thickness
            radius: 20, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: '#fff', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 100, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        })
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
