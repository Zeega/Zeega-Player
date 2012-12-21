/*
    data.js

    model that contains _only_ data to be synced with the server

*/

define([
    "zeega"
],
function( Zeega ) {

    var Data = {};

    Data.Model = Zeega.Backbone.Model.extend({

        url: null,

        defaults: {
            authors: null,
            cover_image: null,
            date_created: null,
            date_published: null,
            date_updated: null,
            description: null,
            enabled: true,
            estimated_time: null,
            frames: [],
            id : 3662,
            item_id : null,
            layers: [],
            location : null,
            published : false,
            sequences: [],
            tags: null,
            title: null,
            // url: null,
            user_id: null
            // window_fit: false,
            // window_ratio: 4/3
        }

    });

    return Data;
});
