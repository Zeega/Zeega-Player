define([
	"zeega",
	"player/frame"
],

function(Zeega, Frame)
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

	Player = Backbone.Model.extend({

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
			The frame id to start the player

			@property start_frame
			@type Integer
			@default null
			**/
			start_frame : null,
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
		* loads the project with data or supplied url
		*
		* @method load
		* @param {Object} setup Setup object
		* @param {String} [setup.url] A complete url pointing to a valid Zeega project data file.
		* @param {Object} [setup.data]A valid Zeega project data object.
		*/

		load : function( obj )
		{
			// this if may be able to be replaced by a _.once(**)
			if( !this.initialized )
			{
				if( obj && obj.data && _.isObject( obj.data ) )
				{
					// the project should be valid json
					this.set(obj); // overwrite project settings and add data
					parseProject( this );
				}
				else if( obj && obj.url && _.isString( obj.url ) )
				{
					// try to load project from url
					var _this = this;
					this.url = obj.url;
					this.set(obj); // overwrite project settings and add data
					this.fetch({silent: true})
						.success(function(){ parseProject( _this ); })
						.error(function(){ _this.onError('3 - fetch error. bad url?'); });
				}
				else this.onError('1 - invalid or missing data');
			}
			else this.onError('2 - already loaded');
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
			$('body').append(this.Layout.el);
			this.Layout.render();
			this.Layout.$el.fadeIn(this.get('fadeIn'),function(){
				_this.onRendered();
			});
		},

		onRendered : function()
		{
			this.ready = true;
			this.initEvents(); // this should be elsewhere. in an onReady fxn?
			this.trigger('ready');
			if(this.get('autoplay') ) this.play();
		},

		initEvents : function()
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
			if( !this.ready ) this.render();
			else if( this.status == 'paused' )
			{
				this.trigger('play');
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
				else this.onError('3 - could not play');
			}
		},

		// if the player is playing, pause the project
		pause : function()
		{
			if( this.status == 'playing' )
			{

				this.trigger('pause');
			}
		},

		playPause : function()
		{
			console.log('play pause');
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
			console.log('gotoframe', id);
			var oldID;
			if(this.currentFrame)
			{
				this.currentFrame.unrender( id );
				oldID = this.currentFrame.id;
			}
			// unrender current frame
			// swap out current frame with new one
			this.currentFrame = this.frames.get( id );
			// render current frame // should trigger a frame rendered event when successful
			this.currentFrame.render( oldID );
			Zeega.router.navigate('/frame/'+ id);
		},

		// returns project metadata
		getMetadata : function()
		{
			return false;
		},

		// returns an array of citation information from the current frames layers
		getCitations : function()
		{
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
		Fired when an error occurs...

		@event onError 
		@param {String} str A description of the error
		**/
		onError : function(str)
		{
			this.trigger('error', str);
			alert('Error code: ' + str );
		}

	});

	/*
		parse the project and trigger data_loaded when finished

		private
	*/
	var parseProject = function( player )
	{
		var frames = new Frame.Collection( player.get('frames') );
		frames.load( player.get('sequences'), player.get('layers') );
		player.frames = frames;
		player.initialized = true;
		player.trigger('data_loaded');
		if( player.get('autoplay') ) player.play();
	};

	/*
		the player layout

		# contains resize logic
		# renders the window target for frames/layers

		private
	*/
	var PlayerLayout = Backbone.Layout.extend({
		template : 'player-layout',
		className : 'ZEEGA-player',

		initialize : function()
		{
			var _this = this;
			// debounce the resize function so it doesn't bog down the browser
			var lazyResize = _.debounce(function(){ _this.resizeWindow(); }, 300);
			$(window).resize(lazyResize);
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
			var winWidth = window.innerWidth;
			var winHeight = window.innerHeight;
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


	return Player;
});