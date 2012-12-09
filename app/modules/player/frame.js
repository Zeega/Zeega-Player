define([
	"zeega",
	"zeega_dir/player/layer"
],

function(Zeega, Layer)
{
	var Frame = Zeega.module();

	var FrameModel = Zeega.Backbone.Model.extend({

		ready : false,
		state : 'waiting', // waiting, loading, ready, destroyed
		hasPlayed : false,

		// frame render as soon as it's loaded. used primarily for the initial frame
		renderOnReady : null,

		defaults : {
			attr : { advance : 0 },
			common_layers : {},			// ids of frames and their common layers for loading
			layers : [],				// ids of layers contained on frame
			link_to : [],				// ids of frames this frame can lead to
			link_from : [],				// ids of frames this frame can be accessed from
			preload_frames : [],
			_next : null,				// id of the next frame
			_prev : null					// id of the previous frame
		},

		// for convenience
		getNext : function(){ return this.get('_next'); },
		getPrev : function(){ return this.get('_prev'); },

		// sets the sequence adjacencies as a string
		setConnections : function()
		{
			if( !_.isNull(this.get('prev')) && !_.isNull(this.get('next')) ) this.set('connections','lr');
			else if( !_.isNull(this.get('prev')) && _.isNull(this.get('next')) ) this.set('connections','l');
			else if( _.isNull(this.get('prev')) && !_.isNull(this.get('next')) ) this.set('connections','r');
			else this.set('connections','none');
		},

		preload : function() {
			if(!this.ready) {
				var _this = this;
				this.layers.each(function(layer){
					if( layer.state == 'waiting' || layer.state == 'loading' ) {
						layer.on('layer_ready', _this.onLayerReady, _this);
						layer.render();
					}
				});
			}
		},

		// render from frame.
		render : function( oldID )
		{
			// if frame is completely loaded, then just render it
			// else try preloading the layers
			var _this = this;
			if( this.ready )
			{
				// only render non-common layers. allows for persistent layers
				var commonLayers = this.get('common_layers')[oldID] || [];
				// if the frame is 'ready', then just render the layers
				this.layers.each(function(layer){
					if( !_.include(commonLayers, layer.id) ) layer.render();
				});

				// update status
				this.status.set('current_frame',this.id);
			}
			else
			{
				this.renderOnReady = oldID;
			}

			/* determines the z-index of the layer in relation to other layers on the frame */
			this.layers.each(function(layer, i){
				layer.updateZIndex( i );
			});
		},

		onLayerReady : function( layer ) {

			this.status.emit('layer_ready', layer );

			if( this.isFrameReady() && !this.ready ) this.onFrameReady();

			// trigger events on layer readiness
			var states = this.layers.map(function(layer){ return layer.state; });
		},

		onFrameReady : function() {
			this.ready = true;
			this.state = 'ready';
			this.status.emit('frame_ready',{ frame: this.toJSON(),layers: this.layers.toJSON() });
			if( !_.isNull(this.renderOnReady) )
			{
				this.status.emit('can_play');
				this.render( this.renderOnReady );
				this.renderOnReady = null;
			}
		},

		getLayerStates : function()
		{
			var states = {};
			states.ready =		_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.state == 'ready'; }), function(layer){ return layer.attributes; });
			states.waiting =	_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.state == 'waiting'; }), function(layer){ return layer.attributes; });
			states.loading =	_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.state == 'loading'; }), function(layer){ return layer.attributes; });
			states.destroyed =	_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.state == 'destroyed'; }), function(layer){ return layer.attributes; });
			states.error =		_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.state == 'error'; }), function(layer){ return layer.attributes; });
			return states;
		},

		isFrameReady : function()
		{
			var states = this.getLayerStates();
			if( states.ready.length + states.error.length  == this.layers.length ) return true;
			return false;
		},

		pause : function()
		{
			this.layers.each(function(layer){
				layer.pause();
			});
		},

		play : function()
		{
			this.layers.each(function(layer){
				layer.play();
			});
		},

		exit : function( newID )
		{
			var commonLayers = this.get('common_layers')[newID] || [];
			this.layers.each(function(layer){
				if( !_.include(commonLayers, layer.id) ) layer.exit();
			});
		},

		unrender : function( newID )
		{
			// not sure I need this
		},

		// manages the removal of all child layers
		destroy : function()
		{
			// do not attempt to destroy if the layer is waiting or destroyed
			if( this.state!= 'waiting' && this.state != 'destroyed' )
			{
				this.layers.each(function(layer){ layer.destroy(); });
				this.state = 'destroyed';
			}
		}

	});

	Frame.Collection = Zeega.Backbone.Collection.extend({
		model : FrameModel,

		// logic that populates the frame with information about it's connections, state, and position within the project
		load : function( sequences,layers, preload_ahead )
		{
			var _this = this;
			// create a layer collection. this does not need to be saved anywhere
			var layerCollection = new Layer.Collection(layers);

			this.each(function(frame){

				var linkedArray = [];
				// make a layer collection inside the frame
				frame.layers = new Layer.Collection();
				frame.relay = _this.relay;
				frame.status = _this.status;
				// add each layer to the collection
				_.each( frame.get('layers'), function(layerID){
					frame.layers.add( layerCollection.get(layerID) );
				});
				// make connections by sequence>frame order
				_.each( sequences, function(sequence){
					var index = _.indexOf( sequence.frames, frame.id );
					if( index > -1 )
					{
						var prev = sequence.frames[index-1] || null;
						var next = sequence.frames[index+1] || null;
						frame.set({
							_prev : prev,
							_next : next,
							_sequence: sequence.id
						});
						frame.setConnections();
					}
				});

				// make connections by link layers
				// get all a frame's link layers
				var linkLayers = frame.layers.where({type:'Link'});
				var linkTo = [];
				var linkFrom = [];
				_.each( linkLayers, function(layer){
					// links that originate from this frame
					if( layer.get('attr').from_frame == frame.id )
						linkTo.push( layer.get('attr').to_frame );
					else
					{
						// links that originate on other frames
						// remove layer model from collection because it shouldn't be rendered
						frame.layers.remove( layer );
						linkFrom.push( layer.get('attr').from_frame );
					}
				});
				frame.set({
					link_to : linkTo,
					link_from : linkFrom
				});


				frame.layers.each(function(layer){
					layer.relay = _this.relay;
					layer.status = _this.status;
				});

/*
				// listen for layer events and propagate through the frame to the player
				frame.layers.on('all',function(e,obj){
					var info = _.extend({},obj,{frame:frame.id});
					_this.status.emit(e, info);
				});
*/
				
			});
			
			// another for loop that has to happen after all link layers are populated
			this.each(function(frame){
				// set common layers object
				// {
				//		123 : [a,b,c],
				//		234 : [c,d,e]
				// }
				var commonLayers = {};
				var allConnected = _.uniq( _.compact( _.union( frame.get('prev'), frame.get('next'), frame.get('link_to'), frame.get('link_from') ) ) );
				_.each( allConnected, function(frameID){
					commonLayers[frameID] = _.intersection( frame.layers.pluck('id'), _this.get(frameID).layers.pluck('id') );
				});
				frame.set({ common_layers: commonLayers });
			});

			// figure out the frames that should preload when this frame is rendered
			var preloadAhead = preload_ahead || 0;
			if(preloadAhead)
			{

				this.each(function(frame){

					var framesToPreload = [frame.id];
					var targetArray = [frame.id];

					var loop = function() {
						_.each( targetArray, function(frameID){
							targetArray = _.compact([ frame.get('_prev'), frame.get('_next') ]);
							framesToPreload = _.union( framesToPreload, targetArray, frame.get('link_to'), frame.get('link_from'));
						});
					};

					for( var i = 0 ; i < preloadAhead ; i++) loop();

					frame.set('preload_frames', framesToPreload );
				});

			}
		}

		

	});

	

	return Frame;
});