// parsers.zeega-collection

define(["lodash"],

function()
{
	var type = 'zeega-collection';
	var Parser = {};
	Parser[type] = { name: type };

	Parser[type].parse = function( res, opts )
	{
		var project = {};
		if(opts.collection_mode == 'slideshow' && res.items[0].child_items.length > 0 ) project = parseSlideshowCollection( res );
		else project = parseStandardCollection( res );

		return project;
	};

	Parser[type].validate = function( res )
	{
		if( res.items && res.items[0] && res.items[0].child_items ) return true;
		return false;
	};

	var parseStandardCollection = function( res )
	{
		// layers from timebased items
		var layers = generateLayerArrayFromItems( res.items[0].child_items );
		// frames from timebased items
		var frames = generateFrameArrayFromItems( res.items[0].child_items );

		var sequence = {
			id : 0,
			title : "collection",
			persistent_layers : [],
			frames : _.pluck( frames, 'id')
		};

		return _.extend( res.items[0], {
			sequences : [ sequence ],
			frames : frames,
			layers : layers
		});
	};

	var parseSlideshowCollection = function( res )
	{
		var frames,slideshowLayer;
		var imageLayers = [];
		var timebasedLayers = [];
		_.each( res.items[0].child_items, function(item){
			if(item.layer_type == 'Image') imageLayers.push(item);
			else if( item.layer_type == 'Audio' || item.media_type == 'Video' ) timebasedLayers.push(item);
		});

		// slideshow layer from image items
		if(imageLayers.length) slideshowLayer = generateSlideshowLayer( imageLayers );
		// layers from timebased items
		var layers = generateLayerArrayFromItems( timebasedLayers );
		if(slideshowLayer) layers.push(slideshowLayer);

		if( timebasedLayers.length )
		{
			// frames from timebased items
			frames = generateFrameArrayFromItems( timebasedLayers, slideshowLayer ? [ slideshowLayer.id ] : [] );
		}
		else
		{
			// create single frame if no timebased layers exist
			frames = [{
				id : 1,
				layers : [1],
				attr : { advance : 0 }
			}];
		}

		var sequence = {
			id : 0,
			title : "collection",
			persistent_layers : slideshowLayer ? [ slideshowLayer.id ] : [],
			frames : _.pluck( frames, 'id')
		};

		return _.extend( res.items[0], {
			sequences : [ sequence ],
			frames : frames,
			layers : layers
		});
	};

	var generateLayerArrayFromItems = function(itemsArray)
	{
		var layerDefaults = {
			width:100,
			top:0,
			left:0,
			loop:false
		};
		return _.map( itemsArray, function(item){
			return {
				attr: _.defaults(item,layerDefaults),
				type : item.layer_type,
				id : item.id
				//target_div : divID
			};
		});
	};

	var generateFrameArrayFromItems = function(itemsArray, persistentLayers)
	{
		return _.map( itemsArray, function(item){
			var layers = item.media_type == 'Video' ? [item.id] : _.compact( [item.id].concat(persistentLayers) );
			return {
				id : item.id,
				layers : layers,
				attr : { advance : 0 }
			};
		});
	};

	var generateSlideshowLayer = function( imageLayerArray )
	{
		var layerDefaults = {
			keyboard : false,
			width:100,
			top:0,
			left:0
		};
		var slides = _.map( imageLayerArray, function(item){
			return {
				attr: item,
				type : item.layer_type,
				id : item.id
			};
		});

		return {
			attr : _.defaults( {slides:slides}, layerDefaults),
			type : 'SlideShow',
			id : 1
		};
	};

	return Parser;
});