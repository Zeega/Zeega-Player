define([
	"zeega",
	"zeega_dir/player/frame",

	// parsers
	"zeega_dir/parsers/_all"
],

function(Zeega, Frame, Parser)
{
	/**
	Player

	can accept:
	
	- valid ZEEGA data (json)
	
	- valid url returning valid ZEEGA data
	
	exposes the player API (play, pause, stop, destroy, getCitations, etc) // to be documented further
	
	broadcasts events (ready, play, pause, stop, timeupdate, frameadvance, etc) // to be documented further
	
	is the only external contact point

		// initialize player
		var player = new Player.Model({ url: "<valid url>"} });
		// or
		var player = new Player.Model({ data: {<valid data>} });
		// or
		var player  = new Player.Model();
		player.on('all', fxn); // log all events
		player.load({data: {<valid data>}})

	@class Player
	@constructor
	*/

	Player = Zeega.Backbone.Model.extend({

		ready : false,			// the player is parsed and in the dom. can call play play. layers have not been preloaded yet
		complete : false,		// have all layers been preloaded
		initialized : false,	// has the project data been loaded and parsed
		status : 'paused',

		currentFrame : null,

		// default settings -  can be overridden by project data
		defaults : {
			/**
			Sets the player to play when data is successfully parsed and rendered to the dom

			@property autoplay 
			@type Boolean
			@default true
			**/
			autoplay : true,
			/**
			Creates a player with no visual controls. Useful if wrapping the player in custom UI

			@property chromeless 
			@type Boolean
			@default true
			**/
			chromeless : true,

			/**
			Sets the collection project playback

			@property collection_mode 
			@type String
			@default 'standard'
			**/
			collection_mode : 'standard',

			/**
			Time to wait after player is ready before playing project

			overrides any overlay attributes

			@property delay
			@type Integer
			@default 0
			**/
			delay : 0,
			/**
			Sets if the project be escaped through user input (esc or close buttons)

			@property escapable
			@type Boolean
			@default true
			**/
			escapable : true,
			/**
			If there are overlays, do they fade out?

			@property fade_overlays
			@type Boolean
			@default true
			**/
			fade_overlays : true,
			/**
			ms the player takes to fade in

			@property fadeIn
			@type Integer
			@default 500
			**/
			fadeIn : 500,
			/**
			ms the player takes to fade out

			@property fadeOut
			@type Integer
			@default 500
			**/
			fadeOut : 500,
			/**
			Sets if the player be set to fullscreen

			@property fullscreenEnable
			@type Boolean
			@default true
			**/
			fullscreenEnable : true,
			/**
			Turns the keyboard controls on or off

			@property keyboard
			@type Boolean
			@default true
			**/
			keyboard : true,
			/**
			Sets the player mode

			@property mode
			@type String
			@default 'standalone'
			@deprecated
			**/
			mode :'standalone',
			/**
			Sets the individual properties of overlays

			@property overlays
			@type Object
			@default mixed
			**/
			overlays : {
				/**
				Turn on/off arrows

				@property overlays.arrows
				@type Boolean
				@default true
				**/
				arrows : true,
				/**
				Turn on/off Zeega branding

				@property overlays.branding
				@type Boolean
				@default true
				**/
				branding : true,
				/**
				Turn on/off Zeega layer level citations

				@property overlays.citations_layers
				@type Boolean
				@default true
				**/
				citations_layer : true,
				/**
				Turn on/off frame level citations

				@property overlays.citations_frame
				@type Boolean
				@default true
				**/
				citations_frame : true,
				/**
				Turn on/off frame project level citations

				@property overlays.citations_project
				@type Boolean
				@default true
				**/
				citations_project : true,
				/**
				Turn on/off social share icons

				@property overlays.social
				@type Boolean
				@default true
				**/
				social : true
			},

			/**
			The number of frames to attempt preload on
			
			@property preload_ahead
			@type Integer
			@default 2
			**/
			preload_ahead : 2,
			
			/**
			The frame id to start the player
			
			@property start_frame
			@type Integer
			@default null
			**/
			start_frame : null,
			/**
			The id of the target div to draw the player into
			
			@property div
			@type String
			@default null
			**/
			div_id : null,
			/**
			Defines whether or not the player is fullscreen or scales to fit the browser.

			@property window_fit
			@type Boolean
			@default false
			**/
			window_fit : false,
			/**
			Defines aspect ratio of the Zeega project

			@property window_ratio
			@type Float
			@default 4/3
			**/
			window_ratio : 4/3
		},


		/**
		* initialize the zeega player:
		*
		* can be initialized like so:
		*
		* var player = new Player.Model({ url: "<valid url>"} });
		* var player = new Player.Model({ data: {<valid data>} });
		*
		* or
		*
		* var player  = new Player.Model();
		* player.on('all', fxn); // log all events
		* player.load({data: {<valid data>}})
		*/

		initialize : function( obj )
		{
			if( !_.isUndefined(obj) ) this.load(obj); // allow for load later
		},

		/**
		* load 
		* loads the project with data or supplied project_url
		*
		* @method load
		* @param {Object} setup Setup object
		* @param {String} [setup.project_url] A complete project_url pointing to a valid Zeega project data file.
		* @param {Object} [setup.data]A valid Zeega project data object.
		*/

		load : function( obj )
		{
			this.off('data_loaded', this.start); // cancel previous listeners
			this.on('data_loaded', this.start, this); // make a new listener
			// this if may be able to be replaced by a _.once(**)
			if( !this.initialized )
			{
				var _this = this;
				this.set(obj,{silent:true}); // overwrite project settings and add data
				
				if( obj && obj.data && _.isObject( obj.data ) )
				{
					this._dataDetect(obj.data);
				}
				else if( obj && obj.url && _.isString( obj.url ) )
				{
					// try to load project from project_url
					this.url = obj.url;
					this.fetch({silent: true})
						.success(function(res){
							_this._dataDetect(res);
						})
						.error(function(){ _this._onError('3 - fetch error. bad project_url?'); });
				}
				else this._onError('1 - invalid or missing data. could be setting up player. nonfatal.');
			}
			else this._onError('2 - already loaded');
		},

		_dataDetect : function(res)
		{
			var _this = this;
			var parsed;
			//determine which parser to use
			_.each(Parser,function(p){
				if(p.validate(res))
				{
					console.log('parsed using: '+ p.name);
					// parse the response
					parsed = p.parse(res, _this.toJSON() );
					return false;
				}
			});

			if( !_.isUndefined(parsed) )
			{
				// continue loading the player
				_this.set( parsed, {silent:true} );
				parseProject( _this );
				_this._listen();
			}
			else _this._onError('4 - no valid parser found');
		},

		_listen : function()
		{
			var _this = this;
			this.frames.on('all',function(e,obj){
				_this.trigger(e,obj);
			});

			this.on('cue_frame', this.cueFrame, this);
		},

		// renders the player to the dom // this could be a _.once
		render : function()
		{
			var _this = this;
			this.Layout = new PlayerLayout({
				model: this,
				attributes: {
					id : 'ZEEGA-player-'+ this.id,
					'data-projectID' : this.id
				}
			});
			// draw the player in to the target div if defined. or append to the body
			if( this.get('div_id') )
			{
				$('#'+ this.get('div_id')).css('position','relative').html(this.Layout.el);
			}
			else $('body').append(this.Layout.el);
			this.Layout.render();
			
			_.delay( function(){_this.onRendered();},100);
			
		},

		_fadeIn : function()
		{
			console.log('fade in1111',this.Layout.$el );
			this.Layout.$el.fadeTo('fast',100);
			//this.Layout.$el.css('opacity',1);
		},

		onRendered : function()
		{
			this.ready = true;
			this._initEvents(); // this should be elsewhere. in an onReady fxn?
			this.trigger('ready');

			this.preloadFramesFrom( this.get('start_frame') );

			if( this.get('autoplay') ) this.play();
		},

		_initEvents : function()
		{
			var _this = this;
			if( this.get('keyboard') )
			{
				$(window).keyup(function(e){
					switch( e.which )
					{
						case 27: // esc
							if(_this.get('escapable')) _this.destroy();
							break;
						case 37: // left arrow
							_this.cuePrev();
							break;
						case 39: // right arrow
							_this.cueNext();
							break;
						case 32: // spacebar
							_this.playPause();
							break;
					}
				});
			}
		},

		start : function()
		{
			this.render();
		},

		// if the player is paused, then play the project
		// if the player is not rendered, then render it first
		/**
		* play 
		* plays the project
		* -if the player is paused, then play the project
		* -if the player is not rendered, then render it first
		*
		* @method play
		*/

		play : function()
		{
			if( !this.ready )
			{
				this.render(); // render the player first!
			}
			else if( this.status == 'paused' )
			{
				this._fadeIn();
				if( this.currentFrame )
				{
					this.status ='playing';
					this.currentFrame.play();
				}
				// if there is no info on where the player is or where to start go to first frame in project
				if( _.isNull(this.currentFrame) && _.isNull( this.get('start_frame') ) )
				{
					this.cueFrame( this.get('sequences')[0].frames[0] );
				}
				else if( _.isNull(this.currentFrame) && !_.isNull( this.get('start_frame') ) && this.frames.get( this.get('start_frame') ) )
				{
					this.cueFrame( this.get('start_frame') );
				}
				else if( !_.isNull(this.currentFrame) )
				{
					// unpause the player
				}
				else this._onError('3 - could not play');
			}
		},

		// if the player is playing, pause the project
		pause : function()
		{
			if( this.status == 'playing' )
			{
				this.status ='paused';
				// pause each frame - layer
				this.currentFrame.pause();
				// pause auto advance
				this.trigger('pause');
			}
		},

		playPause : function()
		{
			if( this.status == 'paused' ) this.play();
			else this.pause();
		},

		// goes to the next frame after n ms
		cueNext : function(ms)
		{
			this.cueFrame( this.currentFrame.get('next'), ms );
		},

		// goes to the prev frame after n ms
		cuePrev : function(ms)
		{
			this.cueFrame( this.currentFrame.get('prev'), ms );
		},

		// goes to specified frame after n ms
		cueFrame : function( id, ms)
		{
			if( !_.isUndefined(id) && !_.isUndefined( this.frames.get(id) ) )
			{
				var _this = this;
				var time = ms || 0;
				if( time !== 0 ) _.delay(function(){ _this.goToFrame(id); }, time);
				else this.goToFrame(id);
			}
		},

		// should this live in the cueFrame method so it's not exposed?
		goToFrame :function(id)
		{
			this.preloadFramesFrom( id );
			var oldID;
			if(this.currentFrame)
			{
				this.currentFrame.exit( id );
				oldID = this.currentFrame.id;
			}
			// unrender current frame
			// swap out current frame with new one
			this.currentFrame = this.frames.get( id );
			// render current frame // should trigger a frame rendered event when successful
			this.currentFrame.render( oldID );

			if( this.status != 'playing' )
			{
				this.status = 'playing';
				this.trigger('play');
			}
		},

		preloadFramesFrom : function( id )
		{
			var _this = this;
			var frame = this.frames.get( id );
			_.each( frame.get('preload_frames'), function(frameID){
				_this.frames.get(frameID).preload();
			});
		},

		// returns project metadata
		getProjectData : function()
		{
			var frames = this.frames.map(function(frame){
				return _.extend({},
					frame.toJSON(),
					{ layers: frame.layers.toJSON() }
				);
			});
			return _.extend({},
				this.toJSON(),
				{ frames : frames }
			);
		},

		getFrameData : function()
		{
			var _this = this;
			if( this.currentFrame ) return _.extend({},
				_this.currentFrame.toJSON(),
				{ layers: _this.currentFrame.layers.toJSON() }
			);
			return false;
		},

		// returns the frame structure for the project // not implemented
		getProjectTree : function()
		{
			return false;
		},

		// completely obliterate the player. triggers event
		destroy : function()
		{
			var _this = this;
			this.Layout.$el.fadeOut( this.get('fadeOut'), function(){
				// destroy all layers before calling player_destroyed
				_this.frames.each(function(frame){ frame.destroy(); });
				_this.trigger('player_destroyed');
			});
		},

		/**
		resize the players based on the current browser window dimensions

		@method fitPlayer
		**/
		fitWindow : function()
		{
			this.Layout.resizeWindow();
		},

		/**
		Fired when an error occurs...

		@event onError
		@param {String} str A description of the error
		**/
		_onError : function(str)
		{
			this.trigger('error', str);
			console.log('Error code: ' + str );
		},

		parse : function(res)
		{
			// parses zeega collections pulled from the library api
			if( res.items && res.items[0].child_items)
			{
				res = res.items[0];
				res.items = res.child_items;
			}
			return res;
		}

	});

	/*
		parse the project and trigger data_loaded when finished

		private
	*/
	var parseProject = function( player )
	{
		addTargetDivToLayers(player.get('layers'), player.get('div_id'));
		
		var frames = new Frame.Collection( player.get('frames') );
		frames.load( player.get('sequences'), player.get('layers'), player.get('preload_ahead') );
			
		console.log('parse project', player, frames);
		
		player.frames = frames;

		// set start frame
		if(_.isNull(player.get('start_frame')) || _.isUndefined( player.frames.get(player.get('start_frame'))) )
		{
			player.set({'start_frame': player.get('sequences')[0].frames[0]},{silent:true});
		}

		player.initialized = true;
		player.trigger('data_loaded');
	};

	var addTargetDivToLayers = function(layerArray, targetDiv)
	{
		_.each(layerArray, function(layer){
			layer.target_div = targetDiv;
		});
	};


	/*
		the player layout

		# contains resize logic
		# renders the window target for frames/layers

		private
	*/
	var PlayerLayout = Zeega.Backbone.Layout.extend({

		fetch: function(path) {
			// Initialize done for use in async-mode
			var done;

			// Concatenate the file extension.
			path = 'app/templates/layouts/'+ path + ".html";

			// If cached, use the compiled template.
			if (JST[path]) {
				return JST[path];
			} else {
				// Put fetch into `async-mode`.
				done = this.async();

				// Seek out the template asynchronously.
				return $.ajax({ url: Zeega.root + path }).then(function(contents) {
					done(JST[path] = _.template(contents));
				});
			}
		},

		template : 'player-layout',
		className : 'ZEEGA-player',

		initialize : function()
		{
			var _this = this;
			// debounce the resize function so it doesn't bog down the browser
			var lazyResize = _.debounce(function(){ _this.resizeWindow(); }, 300);
			// attempt to detect if the parent container is being resized
			if(this.model.get('div_id')) $('#'+ this.model.get('div_id') ).resize(lazyResize); // < ——— not sure if this works
			else $(window).resize(lazyResize);
		},

		serialize : function(){ return this.model.toJSON(); },

		afterRender : function()
		{
			// correctly size the player window
			this.$('.ZEEGA-player-window').css( this.getWindowSize() );
		},

		resizeWindow : function()
		{
			// animate the window size in place
			var css = this.getWindowSize();
			this.$('.ZEEGA-player-window').animate( css );
			this.model.trigger('window_resized', css );
		},

		// calculate and return the correct window size for the player window
		// uses the player's window_ratio attribute
		getWindowSize : function()
		{
			var css = {};
			var winWidth =  this.model.get('div_id') ? $('#'+ this.model.get('div_id')).width() : window.innerWidth;
			var winHeight = this.model.get('div_id') ? $('#'+ this.model.get('div_id')).height() : window.innerHeight;
			var winRatio = winWidth / winHeight;

			if(this.model.get('window_fit'))
			{
				if( winRatio > this.model.get('window_ratio') )
				{
					css.width = winWidth + 'px';
					css.height = winWidth / this.model.get('window_ratio') +'px';
				}
				else
				{
					css.width = winHeight * this.model.get('window_ratio') +'px';
					css.height = winHeight +'px';
				}
			}
			else
			{
				if( winRatio > this.model.get('window_ratio') )
				{
					css.width = winHeight * this.model.get('window_ratio') +'px';
					css.height = winHeight +'px';
				}
				else
				{
					css.width = winWidth + 'px';
					css.height = winWidth / this.model.get('window_ratio') +'px';
				}
			}
			return css;
		}
	});

	Zeega.player = Player;

	return Zeega;
});