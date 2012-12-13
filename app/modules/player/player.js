define([
    "zeega",
    "zeega_dir/player/frame",

    // parsers
    "zeega_dir/parsers/_all",

    "modules/player/relay",
    "modules/player/status",

    "modules/player/player-layout"
],

function( Zeega, Frame, Parser, Relay, Status, PlayerLayout ) {
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
        player.on("all", fxn); // log all events
        player.load({data: {<valid data>}})

    @class Player
    @constructor
    */

    Player = Zeega.Backbone.Model.extend({

        ready: false,          // the player is parsed and in the dom. can call play play. layers have not been preloaded yet
        complete: false,       // have all layers been preloaded
        initialized: false,    // has the project data been loaded and parsed
        state: "paused",

        // default settings -  can be overridden by project data
        defaults: {
            /**
            Sets the player to play when data is successfully parsed and rendered to the dom

            @property autoplay
            @type Boolean
            @default true
            **/
            autoplay: true,
            /**
            Sets the collection project playback. "standard", "slideshow"

            @property collection_mode
            @type String
            @default "standard"
            **/
            collection_mode: "standard",

            start_slide: null,
            start_slide_id: null,

            /**
            Time to wait after player is ready before playing project

            overrides any overlay attributes

            @property delay
            @type Integer
            @default 0
            **/
            delay: 0,

            /**
            If there are overlays, do they fade out?

            @property fade_overlays
            @type Boolean
            @default true
            **/
            fade_overlays: true,
            /**
            ms the player takes to fade in

            @property fadeIn
            @type Integer
            @default 500
            **/
            fadeIn: 500,
            /**
            ms the player takes to fade out

            @property fadeOut
            @type Integer
            @default 500
            **/
            fadeOut: 500,
            /**
            Sets if the player be set to fullscreen

            @property fullscreenEnable
            @type Boolean
            @default true
            **/
            fullscreenEnable: true,
            /**
            Turns the keyboard controls on or off

            @property keyboard
            @type Boolean
            @default true
            **/
            keyboard: true,
            /**
            Sets the player mode

            @property mode
            @type String
            @default "standalone"
            @deprecated
            **/
            mode:"standalone",

            /**
            selector of element used to cueNext the Zeega

            @property next
            @type String
            @default null
            **/
            next: null,
            /**
            The number of frames to attempt preload on

            @property preload_ahead
            @type Integer
            @default 2
            **/
            preload_ahead: 2,

            /**
            selector of element used to cuePrev the Zeega

            @property prev
            @type String
            @default null
            **/
            prev: null,

            /**
            The frame id to start the player

            @property start_frame
            @type Integer
            @default null
            **/
            start_frame: null,
            /**
            The id of the target div to draw the player into

            @property div
            @type String
            @default null
            **/
            div_id: null,
            /**
            Defines whether or not the player is fullscreen or scales to fit the browser.

            @property window_fit
            @type Boolean
            @default false
            **/
            window_fit: false,
            /**
            Defines aspect ratio of the Zeega project

            @property window_ratio
            @type Float
            @default 4/3
            **/
            window_ratio: 4/3
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
        * player.on("all", fxn); // log all events
        * player.load({data: {<valid data>}})
        */

        initialize: function( obj ) {
            this.relay = new Relay.Model();
            this.status = new Status.Model();
            this.status.project = this;
            if ( obj !== undefined ) {
                this.load( obj ); // allow for load later
            }
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

        load: function( obj ) {
            var _this = this,
                error;

            this.off( "data_loaded", this.start ); // cancel previous listeners
            this.on( "data_loaded", this.start, this ); // make a new listener
            // this if may be able to be replaced by a _.once(**)
            if ( !this.initialized ) {
                this.set( obj, { silent: true }); // overwrite project settings and add data

                if ( obj && obj.data && _.isObject( obj.data ) ) {
                    this._dataDetect( obj.data );
                } else if ( obj && obj.url && _.isString( obj.url ) ) {
                    // try to load project from project_url
                    this.url = obj.url;
                    this.fetch({ silent: true })
                        .success(function( res ) {
                            _this._dataDetect(res);
                        })
                        .error(function() {
                            _this._onError("3 - fetch error. bad project_url?");
                        });
                } else {
                    error = "1 - invalid or missing data. could be setting up player. nonfatal.";
                }
            } else {
                error = "2 - already loaded";
            }

            if ( error ) {
                this._onError( error );
            }
        },

        _dataDetect: function( res ) {
            var _this = this,
                parsed;

            // determine which parser to use
            _.each( Parser,function( p ) {
                if ( p.validate(res) ) {
                    console.log( "parsed using: " + p.name );
                    // parse the response
                    parsed = p.parse( res, _this.toJSON() );
                    return false;
                }
            });

            if ( parsed !== undefined ) {
                // continue loading the player
                this.set( parsed, { silent: true } );
                parseProject( this );
                this._listen();
            }
            else this._onError("4 - no valid parser found");
        },

        _listen: function() {
            this.on( "cue_frame", this.cueFrame, this );

            // relays
            this.relay.on( "change:current_frame", this._remote_cueFrame, this );
        },

        _remote_cueFrame: function( info, id ) {
            this.cueFrame(id);
        },

        // renders the player to the dom // this could be a _.once
        render: function() {
            var divId = this.get('div_id');

            this.Layout = new PlayerLayout.Layout({
                model: this,
                attributes: {
                    id: "ZEEGA-player-" + this.id,
                    "data-projectID": this.id
                }
            });
            // draw the player in to the target div if defined. or append to the body
            if ( divId ) {
                $("#" + divId ).css( "position", "relative" ).html( this.Layout.el );
            }
            else {
                $("body").append( this.Layout.el );
            }

            this.Layout.render();

            _.delay(function() {
                this.onRendered();
            }.bind(this), 100);
        },

        _fadeIn: function() {
            this.Layout.$el.fadeTo( "fast", 1 );
        },

        onRendered: function() {
            this.ready = true;
            this._initEvents(); // this should be elsewhere. in an onReady fxn?
            this.status.emit("ready");

            this.preloadFramesFrom( this.get("start_frame") );

            if ( this.get("autoplay") ) {
                this.play();
            }
        },

        _initEvents: function() {
            var _this = this;

            if ( this.get("keyboard") ) {
                $(window).keyup(function( event ) {
                    switch( event.which ) {
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

        start: function() {
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

        play: function() {
            var currentFrame = this.status.get("current_frame"),
                startFrame = this.get("start_frame"),
                isCurrentNull, isStartNull;

            if ( !this.ready ) {
                this.render(); // render the player first!
            }
            else if ( this.state == "paused" ) {
                this._fadeIn();
                if ( currentFrame ) {
                    this.state = "playing";
                    this.status.emit("play");
                    this.status.get("current_frame_model").play();
                }

                // TODO: Find out what values currentFrame and startFrame could possibly be
                // eg. current_frame, start_frame

                isCurrentNull = currentFrame === null;
                isStartNull = startFrame === null;

                // if there is no info on where the player is or where to start go to first frame in project
                if ( isCurrentNull && isStartNull ) {
                    this.cueFrame( this.get("sequences")[0].frames[0] );
                } else if ( isCurrentNull && !isStartNull && this.frames.get( startFrame ) ) {
                    this.cueFrame( startFrame );
                } else if ( !isCurrentNull ) {
                    // unpause the player
                } else {
                    this._onError("3 - could not play");
                }
            }
        },

        // if the player is playing, pause the project
        pause: function() {
            if ( this.state == "playing" ) {
                this.state ="paused";
                // pause each frame - layer
                this.status.get("current_frame_model").pause();
                // pause auto advance
                this.status.emit("pause");
            }
        },

        playPause: function() {
            if ( this.state == "paused" ) this.play();
            else this.pause();
        },

        // goes to the next frame after n ms
        cueNext: function( ms ) {
            this.cueFrame( this.status.get("current_frame_model").get("_next"), ms );
        },

        // goes to the prev frame after n ms
        cuePrev: function( ms ) {
            this.cueFrame( this.status.get("current_frame_model").get("_prev"), ms );
        },

        // goes to specified frame after n ms
        cueFrame: function( id, ms ) {
            ms = ms || 0;

            if ( id !== undefined && this.frames.get(id) !== undefined ) {
                if ( ms > 0 ) {
                    _.delay(function() {
                        this._goToFrame( id );
                    }.bind(this), ms );
                }
                else {
                    this._goToFrame( id );
                }
            }
        },

        // should this live in the cueFrame method so it"s not exposed?
        _goToFrame:function( id ) {
            var oldID;

            this.preloadFramesFrom( id );

            if (this.status.get("current_frame")) {
                this.status.get("current_frame_model").exit( id );
                oldID = this.status.get("current_frame_model").id;
            }
            // unrender current frame
            // swap out current frame with new one
            this.status.set( "current_frame", id );

            // render current frame // should trigger a frame rendered event when successful
            this.status.get("current_frame_model").render( oldID );

            if ( this.state !== "playing" ) {
                this.state = "playing";
                this.status.emit("play");
            }
        },

        preloadFramesFrom: function( id ) {
            var _this = this,
                frame = this.frames.get( id );

            _.each( frame.get("preload_frames"), function( frameID ) {
                _this.frames.get( frameID ).preload();
            });
        },

        // returns project metadata
        getProjectData: function() {
            var frames = this.frames.map(function( frame ) {
                return _.extend({},
                    frame.toJSON(),
                    { layers: frame.layers.toJSON() }
                );
            });
            return _.extend({},
                this.toJSON(),
                { frames: frames }
            );
        },

        getFrameData: function() {
            if ( this.status.get("current_frame") ) {

                return _.extend({},
                    this.status.get("current_frame_model").toJSON(),
                    { layers: _this.status.get("current_frame_model").layers.toJSON() }
                );
            }

            return false;
        },

        // returns the frame structure for the project // not implemented
        getProjectTree: function() {
            return false;
        },

        // completely obliterate the player. triggers event
        destroy: function() {
            // TODO: Investigate whether or not this-alias can be safely
            // replaced by bind(this)
            var _this = this;

            this.Layout.$el.fadeOut( this.get("fadeOut"), function() {
                // destroy all layers before calling player_destroyed
                _this.frames.each(function(frame) { frame.destroy(); });
                _this.status.emit("player_destroyed");
            });
        },

        /**
        resize the players based on the current browser window dimensions

        @method fitPlayer
        **/
        fitWindow: function() {
            this.Layout.resizeWindow();
        },

        /**
        Fired when an error occurs...

        @event onError
        @param {String} str A description of the error
        **/
        _onError: function( str ) {
            this.status.emit( "error", str );
            console.log( "Error code: " + str );
        },

        parse: function( res ) {
            // parses zeega collections pulled from the library api
            if ( res.items && res.items[0].child_items ) {
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
    function parseProject( player ) {
        var frames,
            layers = player.get("layers"),
            startFrame = player.get("start_frame");

        addTargetDivToLayers( layers, player.get("div_id"));

        frames = new Frame.Collection( player.get("frames") );


        frames.relay = player.relay;
        frames.status = player.status;

        frames.load( player.get("sequences"), layers, player.get("preload_ahead"), _ );

        player.sequences = new Zeega.Backbone.Collection(player.get("sequences"));
        player.frames = frames;

        // set start frame
        if ( startFrame === null || player.frames.get(startFrame) === undefined ) {
            player.set({
                "start_frame": player.get("sequences")[0].frames[0]
            }, { silent: true });
        }

        player.initialized = true;
        player.status.emit("data_loaded");

        // TODO: Investigate why no explicit return
    };

    function addTargetDivToLayers( layerArray, targetDiv ) {
        _.each(layerArray, function( layer ) {
            layer.target_div = targetDiv;
        });

        // TODO: Investigate why no explicit return
    };

    Zeega.player = Player;

    return Zeega;
});
