define([
    "app",

    "zeega_parser/parser",

    "modules/relay",
    "modules/status",
    "modules/player-layout"
],

function( app, ZeegaParser, Relay, Status, PlayerLayout ) {
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

    Player = app.Backbone.Model.extend({

        ready: false,          // the player is parsed and in the dom. can call play play. layers have not been preloaded yet
        state: "paused",
        relay: null,
        status: null,
        gmapAPI: "waiting",
        Layout: null,

        // default settings -  can be overridden by project data
        defaults: {

             /**
            sets the default visual controls. "none" or object with desired controls { arrows: true, close: false }
            @property controls
            @type Mixed
            @default "none"
            **/
            controls: true,

            /**
            Tells the player how to handle extra space around the player. Can be true, false, "horizontal", or "vertical"
            @property cover
            @type mixed
            @default false
            **/
            cover: false,

            /**
            Instance of a Data.Model

            @property data
            @type Object
            @default null
            **/

            data: null,

            /**
            Turns on verbose console logs of player events

            @property debugEvents
            @type Boolean
            @default false
            **/

            debugEvents: false,

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
            Layer options object

            @property layerOptions
            @type object
            @default {}
            **/

            layerOptions: {},

            /**
            Sets the player to operate in a mobile browser environment

            @property mobile
            @type Boolean
            @default false
            **/

            mobile: false,

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
            The aspect ratio that the zeega should be played in (width/height)

            @property windowRatio
            @type Float
            @default 4/3
            **/
            windowRatio: 4/3,

            /**
            The frame id to start the player

            @property startFrame
            @type Integer
            @default null
            **/
            startFrame: null,

            /**
            The selector or node of target div

            @property target
            @type String or Node
            @default null
            **/
            target: null,

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
            this.loadSoundtrack = _.once(function() {
                console.log("loadSoundtrack")
                app.soundtrack.on("layer_ready", function() {
                    app.soundtrack.play();
                });
                app.soundtrack.render();
            });

            this._mergeAttributes( attributes );
            this.relay = new Relay.Model();
            this.status = new Status.Model({ project: this });
            app.status = this.status; // booooo

            this._setTarget();
            this._load( attributes );
        },

        _mergeAttributes: function( attributes ) {
            var attr = _.pick( attributes, _.keys( this.defaults ) );

            this.set( attr, { silent: true });
            app.attributes = this.toJSON();
        },

        _load: function( attributes ) {
            var rawDataModel = new app.Backbone.Model(); // throw away model. may contain extraneous data

            if ( attributes.url ) {
                rawDataModel.url = attributes.url;
                rawDataModel.fetch().success(function( response ) {
                    this._parseData( response );
                }.bind( this )).error(function() {
                    throw new Error("Ajax load fail");
                });
            } else if ( attributes.data ) {
                this._parseData( attributes.data );
            } else {
                throw new TypeError("`url` expected non null");
            }
        },

        // |target| may be a Selector, Node or jQuery object.
        // If no |target| was provided, default to |document.body|
        _setTarget: function() {
            var target = app.$( this.get("target") || document.body );

            this.status.target = target;
            this.put({
                target: target
            });
        },

        _parseData: function( response ) {
            this.project = new ZeegaParser.parse( response,
                _.extend({},
                    this.toJSON(),
                    {
                        attach: {
                            status: this.status,
                            relay: this.relay
                        }
                    })
                );

            this._setStartFrame();

            this.status.emit( "data_loaded", _.extend({}, this.project.toJSON() ) );
            this._render();
            this._listen();
        },

        _setStartFrame: function() {
            if ( this.get("startFrame") === null || this.project.getFrame( this.get("startFrame") ) === undefined ) {
                this.put({
                    startFrame: this.project.sequences.at(0).get("frames")[0]
                });
            }
        },

        // attach listeners
        _listen: function() {
            this.on("cue_frame", this.cueFrame, this );
            // relays
            this.relay.on("change:current_frame", this._remote_cueFrame, this );
        },

        _remote_cueFrame: function( info, id ) {
            this.cueFrame( id );
        },

        // renders the player to the dom // this could be a _.once
        _render: function() {
            var target = this.get("target");

            this.Layout = new PlayerLayout.Layout({
                model: this,
                attributes: {
//                    id: "ZEEGA-player-" + this.data.id,
                    "data-projectID": this.id
                }
            });

            // do not apply relative style if the zeega is in appended to the body
            if ( !target.is("body") ) {
                target.css( "position", "relative" );
            }
            target.append( this.Layout.el );

            this.Layout.render();

            _.delay(function() {
                this._onRendered();
            }.bind(this), 100);
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
                app.$(window).keyup(function( event ) {
                    switch( event.which ) {
                        case 37: // left arrow
                            _this.cuePrev();
                            break;
                        case 39: // right arrow
                            var adv = this.status.get("current_frame_model").get("attr").advance;
                            
                            if ( adv === 0 || adv === undefined ) {
                                _this.cueNext();
                            }
                            break;
                        case 32: // spacebar
                            _this.playPause();
                            break;
                    }
                }.bind( this ));
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

            this.loadSoundtrack();

            if ( !this.ready ) {
                this.render(); // render the player first!
            } else if ( this.state == "paused" || this.state == "suspended" ) {
                this._fadeIn();
                if ( currentFrame ) {
                    this.state = "playing";
                    app.soundtrack.play();
                    this.status.emit( "play", this );
                    this.status.get("current_frame_model").play();
                }

                // TODO: Find out what values currentFrame and startFrame could possibly be
                // eg. current_frame, startFrame
                isCurrentNull = currentFrame === null;
                isStartNull = startFrame === null;

                // if there is no info on where the player is or where to start go to first frame in project
                if ( isCurrentNull && isStartNull ) {
                    this.cueFrame( this.project.sequences.get("sequences")[0].frames[0] );
                } else if ( isCurrentNull && !isStartNull && this.project.getFrame( startFrame ) ) {
                    this.cueFrame( startFrame );
                } else if ( !isCurrentNull ) {
                    // unpause the player
                } else {
                    throw new Error("Valid parser not found");
                }
            }
        },

        loadSoundtrack: null,

        // if the player is playing, pause the project
        pause: function() {
            if ( this.state == "playing" ) {
                this.state ="paused";
                // pause each frame - layer
                this.status.get("current_frame_model").pause();
                app.soundtrack.pause();
                // pause auto advance
                this.status.emit("pause");
            }
        },

        suspend: function() {
            if ( this.state == "playing" ) {
                this.state ="suspended";
                // pause each frame - layer
                this.status.get("current_frame_model").pause();
                // pause auto advance
                this.status.emit("suspend");
            }
        },

        playPause: function() {
            if ( this.state == "paused" || this.state == "suspended" ) this.play();
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

        // goes to previous frame in history
        cueBack: function() {

            this.status.onBack();
            var history = this.status.get("frameHistory");
            if( history.length > 0 ){
                this.cueFrame( history [ history.length - 1 ] );
            }

        },

        // goes to specified frame after n ms
        cueFrame: function( id, ms ) {
            ms = ms || 0;
            if ( id !== undefined && id !== null && this.project.getFrame( id ) !== undefined ) {
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

        // mobile only hack
        mobileLoadAudioLayers: function() {
            this.project.sequences.each(function( sequence ) {
                sequence.frames.each(function( frame ) {
                    frame.layers.each(function( layer ) {
                        if ( layer.get("type") == "Audio") {
                            var audio = document.getElementById("audio-el-" + layer.id );
                            
                            audio.load();
                        }
                    });
                });
            });
        },

        // should this live in the cueFrame method so it"s not exposed?
        _goToFrame:function( id ) {
            var oldID ;

            this.preloadFramesFrom( id );

            if ( this.status.get("current_frame") ) {
                this.status.get("current_frame_model").exit( id );
                oldID = this.status.get("current_frame_model").id;
            }

            // unrender current frame
            // swap out current frame with new one
            // Use |set| to ensure that a "change" event is triggered
            // from this.status
            this.status.set( "current_frame", id );
            // Use |put| to ensure that NO "change" event is triggered
            // from this.relay
            this.relay.put( "current_frame", id );
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

            if ( nextSequenceID && this.get("sequences").get( nextSequenceID ) ) {
                this.cueFrame( this.get("sequences").get( nextSequenceID ).get("frames")[0] );
            }
        },

        // if a prev sequence exists, then cue and play it
        cuePrevSequence: function() {
            var seqHist = this.status.get("sequenceHistory"),
                prevSequenceID;

            seqHist.pop();
            this.status.set("sequenceHistory", seqHist );
            prevSequenceID = seqHist[ seqHist.length - 1 ];
            if ( prevSequenceID ) {
                this.cueFrame( this.get("sequences").get( prevSequenceID ).get("frames")[0] );
            }
        },

        preloadFramesFrom: function( id ) {
            if ( id ) {
                var frame = this.project.getFrame( id );

                _.each( frame.get("preload_frames"), function( frameID ) {
                    this.project.getFrame( frameID ).preload();
                }, this );
            }
        },

        // TODO: update this
        // returns project metadata
        getProjectData: function() {
            var frames = [],
                layers = [];

            this.project.sequences.each(function( sequence ) {
                sequence.frames.each(function( frame ) {
                    var l, f;

                    l = frame.layers.toJSON();
                    f = _.extend({},
                        frame.toJSON(),
                        { layers: l }
                    );

                    layers.push( l );
                    frames.push( f );
                });
            });

            layers = _.flatten( layers );
            layers = _.uniq( layers, function( lay) {
                return lay.id;
            });

            return _.extend({},
                this.toJSON(),
                {
                    sequences: this.project.sequences.toJSON(),
                    frames: frames,
                    layers: layers
                }
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

            this.Layout.$el.fadeOut( this.get("fadeOut"), function() {
                // destroy all layers before calling player_destroyed
                this.project.sequences.each(function( sequence ) {
                    sequence.frames.each(function( frame ) {
                        if ( frame ) {
                            // frame.destroy();
                            frame.layers.each(function( layer ) {
                                layer.destroy();
                            });
                        }
                    });
                });
                this.Layout.remove();
                this.status.emit("player_destroyed");
            }.bind( this ));
        },

        /**
        resize the players based on the current browser window dimensions

        @method fitPlayer
        **/
        fitWindow: function() {
            this.Layout.resizeWindow();
        }


    });

    app.player = Player;

    return app;
});
