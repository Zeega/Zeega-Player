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
        root: "/"
    };

    // Localize or create a new JavaScript Template object.
    var JST = window.JST = window.JST || {};

    var zeegaJQuery = jquery;
    $.noConflict(); // return $ to prev owner
    var zeegaBackbone = Backbone.noConflict(); // return backbone
    zeegaBackbone.$ = zeegaJQuery; // set backbone jquery

    // Curry the |set| method with a { silent: true } version
    // to avoid repetitious boilerplate code throughout project
    zeegaBackbone.Model.prototype.put = function() {
        var args = [].slice.call( arguments ).concat([ { silent: true } ]);
        return this.set.apply( this, args );
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
