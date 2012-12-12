define([
    "lodash"
],
function() {
    var type = "youtube",
        Parser = {};

    Parser[ type ] = { name: type };

    Parser[ type ].validate = function( res ) {
        if ( res.generator && res.generator == "http://gdata.youtube.com/" ) {
            return true;
        }
        return true;
    };

    Parser[ type ].parse = function( res, opts ) {
        // layers and frames from timebased items
        var layers = generateLayerArrayFromItems( res.feed.entry ),
            frames = generateFrameArrayFromItems( res.feed.entry ),
            sequence = {
                id: 0,
                title: "youtube playlist",
                persistent_layers: [],
                frames: _.pluck( frames, "id" )
            },
            project = _.extend(
            res,
            {
                sequences: [ sequence ],
                frames: frames,
                layers: layers
            });
        return project;
    };


    function generateUniqueId( string ) {
        var k = 0,
            i = 0,
            length = string.length;

        for ( ; i < length; i++ ) {
            k += string.charCodeAt( i );
        }
        return k;
    }

    function generateLayerArrayFromItems( itemsArray ) {
        var layerDefaults = {
            width:100,
            top:0,
            left:0,
            media_type: "Video",
            layer_type:"Youtube"
        };

        return _.map( itemsArray, function( item ) {

            return {
                attr: _.extend(
                    _.defaults( item, layerDefaults ),
                    {
                        attribution_uri:"http://www.youtube.com/watch?v=" + item.media$group.yt$videoid.$t
                    }),
                type: "Video",
                id: item.media$group.yt$videoid.$t,
                attribution_uri: "http://www.youtube.com/watch?v=" + item.media$group.yt$videoid.$t,
                uri: item.media$group.yt$videoid.$t
            };
        });
    }

    function generateFrameArrayFromItems( itemsArray, persistentLayers ) {

        return _.map( itemsArray, function( item ) {
            var id = item.media$group.yt$videoid.$t;
            return {
                id: id,
                layers: _.compact( [id].concat( persistentLayers ) ),
                attr: { advance: 0 }
            };
        });
    }

    return Parser;
});
