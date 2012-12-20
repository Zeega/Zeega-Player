/*
    data.js

    model that contains _only_ data to be synced with the server

*/

define([
    "zeega"
],
function( Zeega ) {

    var Data = {};

    Data.RawModel = Zeega.Backbone.Model.extend({
        url: function() {
            return this.get("url");
        }
    });

    Data.Model = Zeega.Backbone.Model.extend({

        defaults: {
            authors: null,
            autoplay: true,
            cover_image: null,
            date_created: null,
            date_published: null,
            date_updated: null,
            delay: 0,
            description: null,
            enabled: true,
            estimated_time: null,
            fadeIn: 500,
            fadeOut: 500,
            frames: [],
            id : 3662,
            item_id : null,
            keyboard: true,
            layers: [],
            location : null,
            published : false,
            preload_radius: 2,
            prev: "prev",
            next: "next",
            sequences: [],
            start_frame: null,
            tags: null,
            title: null,
            url: null,
            user_id: null,
            window_fit: false,
            window_ratio: 4/3
        },

        url: function() {
            return this.get("url");
        },

        initialize: function() {}

    });

    return Data;
});
