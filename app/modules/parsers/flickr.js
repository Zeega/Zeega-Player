define([
    "lodash"
],
function() {
    var type = "flickr",
        Parser = {};

    Parser[ type ] = { name: type };

    // parser validation. returns true if data conforms to parameters
    Parser[ type ].validate = function( response ) {

        if ( response.generator && response.generator == "http://www.flickr.com/" ) {
            return true;
        }
        return false;
    };

    // parser returns valid Zeega data object
    Parser[ type ].parse = function( response, opts ) {

        // layers and frames from timebased items
        var layers = generateLayerArrayFromItems( response.items ),
            frames = generateFrameArrayFromItems( response.items ),
            sequence = {
                id: 0,
                title: "flickr collection",
                persistent_layers: [],
                frames: _.pluck( frames, "id")
            };

        return _.extend(
            response,
            {
                sequences: [ sequence ],
                frames: frames,
                layers: layers
            });
    };

    function generateLayerArrayFromItems( itemsArray ) {
        var layerDefaults = {
            width:100,
            top:0,
            left:0
        };

        return _.map( itemsArray, function( item ) {
            item.uri = item.media.m;
            return {
                attr: _.defaults(item,layerDefaults),
                type: "Image",
                id: item.link
            };
        });
    }

    function generateFrameArrayFromItems( itemsArray, persistentLayers ) {

        return _.map( itemsArray, function( item ) {
            return {
                id: item.link,
                layers: _.compact( [item.link].concat(persistentLayers) ),
                attr: { advance: 0 }
            };
        });
    }

    return Parser;
});
