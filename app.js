define([
    "engineVendor/spin",
    "backbone",
    "jqueryUI",
    "plugins/backbone.layoutmanager"
],

function( Spinner ) {

    var app = {
        mode: "player",
        // The root path to run the application.
        root: "/",

        metadata: $("meta[name=zeega]").data(),

        attributes: {},
        parserPath: "app/zeega-parser/",
        hasSoundtrack: false,

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

    var zeegaJQuery = $;
    var zeegaBackbone = Backbone;
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
