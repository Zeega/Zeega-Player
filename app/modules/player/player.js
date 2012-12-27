define([
    "zeega",

    "modules/player/data",

    "zeega_dir/player/frame",
    "zeega_dir/player/layer",

    // parsers
    "zeega_dir/parsers/_all",

    "modules/player/relay",
    "modules/player/status",

    "modules/player/player-layout"
],

function( Zeega, Data, Frame, Layer, Parser, Relay, Status, PlayerLayout ) {
    /**
    Player

    can accept:

    - valid ZEEGA data (json)

    - valid url returning valid ZEEGA data

    exposes the player API (play, pause, stop, destroy, getCitations, etc) // to be documented further

    broadcasts events (ready, play, pause, stop, timeupdate, frameadvance, etc) // to be documented further

    is the only external contact point

        // initialize player
        var player = new Player.Model({ `player attributes` });

        // minimum
        var player = new Player.Model({ url: "<valid url>"});
        var player = new Player.Model({ data: {<valid data>} });
        
    @class Player
    @constructor
    */

    Player = Zeega.Backbone.Model.extend({

        ready: false,          // the player is parsed and in the dom. can call play play. layers have not been preloaded yet
        state: "paused",
        relay: null,
        status: null,

        Layout: null,

        // default settings -  can be overridden by project data
        defaults: {
            /**
            Instance of a Data.Model

            @property data
            @type Object
            @default null
            **/

            data: null,

            /**
            Instance of a Frame.Collection

            @property frames
            @type Collection
            @default null
            **/

            frames: null,

            /**
            Instance of a Layer.Collection

            @property layers
            @type Collection
            @default null
            **/

            layers: null,

            /**
            number

            @property layers
            @type Collection
            @default null
            **/
            preloadRadius: 2,

            /**
            Instance of a Sequence.Collection

            @property sequences
            @type Collection
            @default null
            **/

            sequences: null,

            /**
            Capture the type of parser used. This can _only_ be set correctly by
            the parser itself during the vaildation phase.

            @property parser
            @type String
            @default true
            **/

            parser: null,

            /**
            Sets the player to play when data is successfully parsed and rendered to the dom

            @property autoplay
            @type Boolean
            @default true
            **/
            autoplay: true,
            /**
            Sets the collection project playback. "standard", "slideshow"

            @property collectionMode
            @type String
            @default "standard"
            **/
            collectionMode: "standard",

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
            Turns the keyboard controls on or off

            @property keyboard
            @type Boolean
            @default true
            **/
            keyboard: true,

            /**
            selector of element used to cueNext the Zeega

            @property next
            @type String
            @default null
            **/
            next: null,

            /**
            selector of element used to cuePrev the Zeega

            @property prev
            @type String
            @default null
            **/
            prev: null,

            /**
            The frame id to start the player

            @property startFrame
            @type Integer
            @default null
            **/
            startFrame: null,
            /**
            The id of the target div to draw the player into

            @property div
            @type String
            @default null
            **/
            divId: null,

            /**
            URL of loaded data, optional

            @property url
            @type String
            @default null
            **/
            url: null

        },


        /**
        * initialize the zeega player:
        *
        * can be initialized like so:
        *
        * var player = new Player.Model({ url: "<valid url>"} });
        *
        */

        initialize: function( attributes ) {
            this.relay = new Relay.Model();
            this.status = new Status.Model({ project: this });

            this.data = new Data.Model( attributes );
            this.data.url = attributes.url;

            this._load( attributes );
        },

        _load: function( attributes ) {
            var rawDataModel = new Zeega.Backbone.Model(); // throw away model. may contain extraneous data
            
            if ( attributes.url ) {
                rawDataModel.url = attributes.url;
                rawDataModel.fetch().success(function( response ) {
                    this._detectAndParseData( response );
                }.bind( this )).error(function() {
                    throw new Error("Ajax load fail");
                });
            } else if ( attributes.data ) {
                this._detectAndParseData( attributes.data );
            } else {
                throw new TypeError("`url` expected non null");
            }
        },

        _detectAndParseData: function( response ) {
            var parsed;

            // determine which parser to use
            _.each( Parser, function( p ) {
                if ( p.validate( response ) ) {
                    console.log( "parsed using: " + p.name );
                    // parse the response
                    this.parser = p.name;
                    parsed = p.parse( response, this.toJSON() );
                    return false;
                }
            }.bind( this ));

            if ( parsed !== undefined ) {
                // continue loading the player
                this.data.set( parsed );
                this._parseProjectData( parsed );
                
                this._listen();
            } else {
              throw new Error("Valid parser not found");
            }
        },

        _parseProjectData: function( parsed ) {
            var sequences, frames, layers, startFrame;

            layers = this.data.get("layers");
            frames = new Frame.Collection( this.data.get("frames") );
            sequences = new Zeega.Backbone.Collection( this.data.get("sequences") );

            // should be done another way ?
            _.each(layers, function( layer ) {
                layer.target_div = this.data.get("divId");
            }.bind( this ));
            frames.relay = this.relay;
            frames.status = this.status;

            // ugly
            frames.load( this.data.get("sequences"), layers, this.get("preloadRadius"), _ );

            // set start frame
            if ( this.get("startFrame") === null || frames.get( this.get("startFrame") ) === undefined ) {
                this.set({
                    startFrame: sequences.at(0).get("frames")[0]
                }, { silent: true });
            }

            this.set({
                frames: frames,
                sequences: sequences
            }, { silent: true });

            this._render();
            this.status.emit( "data_loaded", _.extend({}, this.data.toJSON() ) );
        },

        // attach listeners
        _listen: function() {
            this.on( "cue_frame", this.cueFrame, this );
            // relays
            this.relay.on( "change:current_frame", this._remote_cueFrame, this );
        },

        _remote_cueFrame: function( info, id ) {
            this.cueFrame(id);
        },

        // renders the player to the dom // this could be a _.once
        _render: function() {
            var divId = this.get('divId');

            this.Layout = new PlayerLayout.Layout({
                model: this,
                attributes: {
                    id: "ZEEGA-player-" + this.data.id,
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
                this._onRendered();
            }.bind(this), 100);

            console.log('zeega this', this);
        },

        _fadeIn: function() {
            this.Layout.$el.fadeTo( "fast", 1 );
        },

        _onRendered: function() {
            this.ready = true;
            this._initEvents(); // this should be elsewhere. in an onReady fxn?
            this.status.emit( "ready", this );

            this.preloadFramesFrom( this.get("startFrame") );

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
                startFrame = this.get("startFrame"),
                isCurrentNull, isStartNull;

            if ( !this.ready ) {
                this.render(); // render the player first!
            }
            else if ( this.state == "paused" ) {
                this._fadeIn();
                if ( currentFrame ) {
                    this.state = "playing";
                    this.status.emit( "play", this );
                    this.status.get("current_frame_model").play();
                }

                // TODO: Find out what values currentFrame and startFrame could possibly be
                // eg. current_frame, startFrame

                isCurrentNull = currentFrame === null;
                isStartNull = startFrame === null;

                // if there is no info on where the player is or where to start go to first frame in project
                if ( isCurrentNull && isStartNull ) {
                    this.cueFrame( this.get("sequences")[0].frames[0] );
                } else if ( isCurrentNull && !isStartNull && this.get("frames").get( startFrame ) ) {
                    this.cueFrame( startFrame );
                } else if ( !isCurrentNull ) {
                    // unpause the player
                } else {
                    throw new Error("Valid parser not found");
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

            if ( id !== undefined && this.get("frames").get(id) !== undefined ) {
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
            this.relay.set({"current_frame": id}, { silent: true });

            // render current frame // should trigger a frame rendered event when successful
            this.status.get("current_frame_model").render( oldID );

            if ( this.state !== "playing" ) {
                this.state = "playing";
                this.status.emit( "play", this );
            }
        },

        // if a next sequence exists, then cue and play it
        cueNextSequence: function() {
            var nextSequenceID = this.status.get("current_sequence_model").get("advance_to");

            if ( nextSequenceID && this.sequences.get( nextSequenceID ) ) {
                this.cueFrame( this.sequences.get( nextSequenceID ).get("frames")[0] );
            }
        },

        preloadFramesFrom: function( id ) {
            var _this = this,
                frame = this.get("frames").get( id );

            _.each( frame.get("preload_frames"), function( frameID ) {
                _this.get("frames").get( frameID ).preload();
            });
        },

        // returns project metadata
        getProjectData: function() {
            var frames = this.get("frames").map(function( frame ) {
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
                    { layers: this.status.get("current_frame_model").layers.toJSON() }
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
                _this.get("frames").each(function(frame) { frame.destroy(); });
                _this.status.emit("player_destroyed");
            });
        },

        /**
        resize the players based on the current browser window dimensions

        @method fitPlayer
        **/
        fitWindow: function() {
            this.Layout.resizeWindow();
        }


    });

    Zeega.player = Player;

    return Zeega;
});
