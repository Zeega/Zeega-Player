define([
    "lodash"
],
function() {
    var type = "zeega-collection",
        Parser = {};

    Parser[ type ] = { name: type };

    Parser[ type ].validate = function( response ) {
        // TODO: this works, but may not be valid with new API!!
        if ( response.items && response.items[0] && response.items[0].child_items ) {
            return true;
        }
        return false;
    };

    Parser[ type ].parse = function( response, opts ) {
        var project = {};
        if ( opts.layerOptions && opts.layerOptions.slideshow && opts.layerOptions.slideshow.display && response.items.length > 0 ) {
            project = parseSlideshowCollection( response, opts );
        } else {
            project = parseStandardCollection( response, opts );
        }
        return project;
    };

    var parseStandardCollection = function( response, opts ) {
        // layers from timebased items
        var layers = generateLayerArrayFromItems( response.items ),
            frames = generateFrameArrayFromItems( response.items ),
            sequence = {
                id: 0,
                title: "collection",
                persistent_layers: [],
                frames: _.pluck( frames, "id" )
            };

        return _.extend(
            response.items[0],
            {
                sequences: [ sequence ],
                frames: frames,
                layers: layers
            });
    };

    function parseSlideshowCollection( response, opts ) {
        var frames,slideshowLayer,
            imageLayers = [],
            timebasedLayers = [];

        _.each( response.items, function( item ) {
            if ( item.layer_type == "Image" ) {
                imageLayers.push(item);
            } else if ( item.layer_type == "Audio" || item.media_type == "Video" ) {
                timebasedLayers.push(item);
            }
        });
        // slideshow layer from image items
        if ( imageLayers.length ) {
            slideshowLayer = generateSlideshowLayer( imageLayers, opts.layerOptions );
        }
        // layers from timebased items
        var layers = generateLayerArrayFromItems( timebasedLayers );
        if ( slideshowLayer ) {
            layers.push( slideshowLayer );
        }
        // frames from timebased items
        if ( timebasedLayers.length ) {
            frames = generateFrameArrayFromItems( timebasedLayers, slideshowLayer ? [ slideshowLayer.id ] : [] );
        } else {
            // create single frame if no timebased layers exist
            frames = [{
                id: 1,
                layers: [1],
                attr: { advance : 0 }
            }];
        }

        var sequence = {
            id: 0,
            title: "collection",
            persistent_layers: slideshowLayer ? [ slideshowLayer.id ] : [],
            frames: _.pluck( frames, "id")
        };

        return _.extend(
            response.items[0],
            {
                sequences: [ sequence ],
                frames: frames,
                layers: layers
            });
    }

    function generateLayerArrayFromItems( itemsArray ) {
        var layerDefaults = {
            width: 100,
            top: 0,
            left: 0,
            loop: false
        };

        return _.map( itemsArray, function( item ) {
            return {
                attr: _.defaults(item,layerDefaults),
                type: item.layer_type,
                id: item.id
            };
        });
    }

    function generateFrameArrayFromItems( itemsArray, persistentLayers ) {

        return _.map( itemsArray, function( item ) {
            var layers = item.media_type == "Video" ?
                [item.id] : _.compact( [item.id].concat( persistentLayers ) );

            return {
                id: item.id,
                layers: layers,
                attr: { advance : 0 }
            };
        });
    }

    function generateSlideshowLayer( imageLayerArray, layerOptions ) {
        var layerDefaults = {
                keyboard: false,
                width: 100,
                top: 0,
                left: 0
            },
            slides = _.map( imageLayerArray, function( item ) {
                return {
                    attr: item,
                    type: item.layer_type,
                    id: item.id
                };
            });

        return {
            attr: _.defaults({ slides: slides }, layerDefaults ),
            start_slide: parseInt( layerOptions.slideshow.start, 10 ) || 0,
            start_slide_id: parseInt( layerOptions.slideshow.start_id, 10 ) || null,
            slides_bleed: layerOptions.slideshow.bleed,
            transition: layerOptions.slideshow.transition,
            speed: layerOptions.slideshow.speed,
            type: "SlideShow",
            id: 1
        };
    }

    return Parser;
});
