// parsers.flickr

define(["lodash"],

function()
{
	var type = 'flickr';
	var Parser = {};
	Parser[type] = { name: type };

	Parser[type].parse = function( res, opts )
	{
		// layers from timebased items
		var layers = generateLayerArrayFromItems( res.items );
		// frames from timebased items
		var frames = generateFrameArrayFromItems( res.items );

		var sequence = {
			id : 0,
			title : "flickr collection",
			persistent_layers : [],
			frames : _.pluck( frames, 'id')
		};

		return _.extend( res, {
			sequences : [ sequence ],
			frames : frames,
			layers : layers
		});
	};

	Parser[type].validate = function( res )
	{
		if( res.generator && res.generator == 'http://www.flickr.com/' ) return true;
		return false;
	};

	var generateLayerArrayFromItems = function(itemsArray)
	{
		var layerDefaults = {
			width:100,
			top:0,
			left:0
		};
		return _.map( itemsArray, function(item){
			item.uri = item.media.m;
			return {
				attr: _.defaults(item,layerDefaults),
				type : "Image",
				id : item.link
				//target_div : divID
			};
		});
	};

	var generateFrameArrayFromItems = function(itemsArray, persistentLayers)
	{
		return _.map( itemsArray, function(item){
			return {
				id : item.link,
				layers : _.compact( [item.link].concat(persistentLayers) ),
				attr : { advance : 0 }
			};
		});
	};

	return Parser;
});