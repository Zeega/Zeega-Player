// parsers.youtube

define(["lodash"],

function()
{
	var type = 'youtube';
	var Parser = {};
	Parser[type] = { name: type };

	Parser[type].parse = function( res, opts )
	{
		// layers from timebased items
		var layers = generateLayerArrayFromItems( res.feed.entry );
		// frames from timebased items
		
		var frames = generateFrameArrayFromItems( res.feed.entry );

		var sequence = {
			id : 0,
			title : "youtube playlist",
			persistent_layers : [],
			frames : _.pluck( frames, 'id')
		};

		var project= _.extend( res, {
			sequences : [ sequence ],
			frames : frames,
			layers : layers
		});
		console.log(project);
		return project;
	};

	Parser[type].validate = function( res )
	{
		if( res.generator && res.generator == 'http://gdata.youtube.com/' ) return true;
		return true;
	};
	var generateUniqueId=function(string){
		var k=0;
		for(var i=0;i<string.length;i++){
			k+=string.charCodeAt(i);
		}
		return k;
	};

	var generateLayerArrayFromItems = function(itemsArray)
	{
		var layerDefaults = {
			width:100,
			top:0,
			left:0,
			media_type : "Video",
			layer_type:"Youtube"
		};
		return _.map( itemsArray, function(item){
			
			
			return {
				attr: _.extend(_.defaults(item,layerDefaults),{attribution_uri:"http://www.youtube.com/watch?v="+item.media$group.yt$videoid.$t}),
				type: 'Video',
				id : item.media$group.yt$videoid.$t,
				attribution_uri:"http://www.youtube.com/watch?v="+item.media$group.yt$videoid.$t,
				uri : item.media$group.yt$videoid.$t

				//target_div : divID
			};
		});
	};

	var generateFrameArrayFromItems = function(itemsArray, persistentLayers)
	{
		return _.map( itemsArray, function(item){
			var id= item.media$group.yt$videoid.$t;
			return {
				id :id,
				layers : _.compact( [id].concat(persistentLayers) ),
				attr : { advance : 0 }
			};
		});
	};

	return Parser;
});