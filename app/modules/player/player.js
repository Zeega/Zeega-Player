define([ "zeega" ],

function(Zeega)
{
	/*
		Player.Model

		# can accept:
			- valid ZEEGA data (json)
			- valid url returning valid ZEEGA data

		# exposes the player API (play, pause, stop, destroy, getCitations, etc) // to be documented further
		
		# broadcasts events (ready, play, pause, stop, timeupdate, frameadvance, etc) // to be documented further

		# is the only external contact point
	*/

	Player = Backbone.Model.extend({

		ready : false,
		initialized : false,
		status : 'waiting',

		// default settings -  can be overridden by project data
		defaults : {
			autoplay : true,
			chromeless : false,
			fade_overlays : true,
			fullscreenEnable : true,
			keyboard : true,
			mode :'standalone',
			overlays : {
				arrows : true,
				branding : true,
				citations_layer : true,
				citations_frame : true,
				citations_project : true,
				social : true
			},
			start_frame : null,
			viewport_fit : true,
			viewport_ratio : 4/3
		},

		// initialize the zeega player:
		// var player = new Player.Model({ url: "<valid url>"} });
		// var player = new Player.Model({ data: {<valid data>} });
		//
		// or
		//
		// var player  = new Player.Model();
		// player.on('all', fxn); // log all events
		// player.load({data: {<valid data>}})
		
		initialize : function( obj )
		{
			if( !_.isUndefined(obj) ) this.load(obj); // allow for load later
		},

		load : function( obj )
		{
			// this if may be able to be replaced by a _.once(**)
			if( !this.initialized )
			{
				if( obj && obj.data && _.isObject( obj.data ) )
				{
					// the project should be valid json
					this.initialized = true;
					this.set(obj); // overwrite project settings and add data
					parseProject( this );
				}
				else if( obj && obj.url && _.isString( obj.url ) )
				{
					// try to load project from url
					var _this = this;
					this.initialized = true;
					this.url = obj.url;
					this.fetch({silent: true})
						.success(function(){ parseProject( _this ); })
						.error(function(){ _this.onError('3 - fetch error. bad url?'); });
				}
				else this.onError('1 - invalid or missing data');
			}
			else this.onError('2 - already loaded');
		},

		onError : function(str)
		{
			this.trigger('error', str);
			alert('Error code: ' + str );
		},

		// renders the player to the dom // this could be a _.once
		render : function()
		{

			this.ready = true;
			this.trigger('ready');
		},

		// if the player is paused, then play the project
		// if the player is not rendered, then render it first
		play : function()
		{
			if( !this.ready ) this.render();
			else if( this.status == 'paused' )
			{

				this.trigger('play');
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

		},

		// goes to previous frame in sequence and returns the id or returns false if at beginning
		next : function()
		{
			return false;
		},

		// goes to next frame in sequence and returns the id or returns false if at end
		prev : function()
		{
			return false;
		},

		// skip to a specific frame in the project. returns false if no such frame exists
		goTo : function( id )
		{
			return false;
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
			this.trigger('player_destroyed');
		}

	});

	/*
		parses the project. but not exposed to the rest of the world
	*/
	var parseProject = function( player )
	{

		player.trigger('data_loaded');
		if( player.get('autoplay') ) player.play();
	};


	return Player;
});