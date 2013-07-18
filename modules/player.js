define([
    "app",
    "engine/engine",
    "player/modules/relay",
    "player/modules/status",
    "player/modules/player-layout"
],

function( app, Engine, Relay, Status, PlayerLayout ) {

    return app.Backbone.Model.extend({

        ready: false,          // the player is parsed and in the dom. can call play play. layers have not been preloaded yet
        state: "paused",
        layout: null,

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
            @default false
            **/

            data: false,

            /**
            Turns on verbose console logs of player events

            @property debugEvents
            @type Boolean
            @default false
            **/

            debugEvents: false,

            /**
            Turns on the end/credit frame at the end of the project

            @property endPage
            @type Boolean
            @default false
            **/

            endPage: false,

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
            the beginning state of the preview. vertical or fullscreen mode

            @property previewMode
            @type String
            @default "standard"
            **/
            previewMode: "standard", // or mobile

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
            windowRatio: 0.75,

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


        projects: null,

        initialize: function( attributes ) {
            this.getData();
        },

        // prefers 'fresh' data from url
        getData: function() {
            if ( this.get("url") ) {
                $.getJSON( this.get("url"), function( data ) {
                    this.initialParse( data );
                }.bind(this));
            } else if ( this.get("data") ) {
                this.initialParse( this.get("data") );
            } else {
                throw new TypeError("`url` expected non null");
            }
        },

        initialParse: function( data ) {
            this.zeega = new Engine.generateZeega( data,
                _.extend({},
                    this.toJSON(),
                    {
                        mode: "player"
                    })
                );

            this._render();
        },

        // renders the player to the dom // this could be a _.once
        _render: function() {
            var target;

            this._setTarget();
            target = this.get("target");

            this.layout = new PlayerLayout({
                model: this,
                attributes: {
                    "data-projectID": this.id
                }
            });
            target.append( this.layout.el );

            this.once("layout_rendered", this._onRendered, this );

            // do not apply relative style if the zeega is in appended to the body
            if ( !target.is("body") ) {
                target.css( "position", "relative" );
            }

            this.layout.render();
        },

        _onRendered: function() {
            this.ready = true;
            this._initEvents(); // this should be elsewhere. in an onReady fxn?
            // this.emit( "ready", this );

            if ( this.get("autoplay") ) this.play();
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
            var page = this.zeega.getCurrentPage();

            // this.loadSoundtrack( app );
            if ( !this.ready ) {
                this.render(); // render the player first! // this should not happen
            } else if ( this.state == "paused" || this.state == "suspended" ) {
                this._fadeIn();
                this.cuePage( page );
            }
        },

        cuePage: function( page ) {
            if ( page.state == "waiting" ) {
                // preload
                this.zeega.once("page_ready:" + page.id, this._playPage, this );
                this.preloadPage( page );
            } else if ( page.state == "loading" ) {
                // wait for ready event
            } else if ( page.state == "ready" ) {
                this.state = "playing";
                // if ( app.soundtrack ) app.soundtrack.play();
                this.emit( "play", this );
                this.zeega.getCurrentPage().play();
            }
        },

        preloadPage: function( page ) {
            var nextPage = this.zeega.getNextPage( page );

            page.preload();

            for ( var i = 0; i < this.get("preloadRadius"); i++ ) {
                if( nextPage ) {
                    nextPage.preload();
                    nextPage = this.zeega.getNextPage( nextPage );
                }
            }
            
        },

        // can only be called if a page is preloaded and ready
        _playPage: function( page ) {
            page.play();
        },

        _fadeIn: function() {
            this.layout.$el.fadeTo("fast", 1 );
        },

        // |target| may be a Selector, Node or jQuery object.
        // If no |target| was provided, default to |document.body|
        _setTarget: function() {
            var target = app.$( this.get("target") || document.body );

            this.put({ target: target });
        },

        emit: function( event, options ) {
            this.trigger( event, options );
        },






/////





        // attach listeners
        _listen: function() {
            this.on("cue_frame", this.cueFrame, this );
            this.on("size_toggle", this.toggleSize, this );
            // relays
            this.relay.on("change:current_frame", this._remote_cueFrame, this );
        },

        toggleSize: function() {
            this.layout.toggleSize();
        },

         // move this to layout
        _initEvents: function() {
            var _this = this;

            if ( this.get("keyboard") ) {
                app.$(window).keyup(function( event ) {
                    switch( event.which ) {
                        case 37: // left arrow
                            _this.cueBack();
                            break;
                        case 39: // right arrow
                            _this.cueNext();
                            break;
                        case 32: // spacebar
                            _this.playPause();
                            break;
                    }
                }.bind( this ));
            }
        },

        
        loadSoundtrack: _.once(function( app ) {

                console.log("load soundtrack")
                // this can be done better // TODO 6/8/13
                app.soundtrack = this.project.sequences.at(0).soundtrackModel;

                if ( app.soundtrack ) {
                    if ( app.soundtrack.state == "ready" ) {
                        app.soundtrack.play();
                    } else {
                        app.soundtrack.on("layer_ready", function() {
                            app.soundtrack.play();
                        });
                    }
                    app.soundtrack.render();
                }
            }),

        mute: function() {
            // TODO
        },

        unMute: function() {
            // TODO
        },

        // if the player is playing, pause the project
        pause: function() {
            if ( this.state == "playing" ) {
                this.state ="paused";
                // pause each frame - layer
                this.status.get("current_frame_model").pause();
                if ( app.soundtrack ) {
                    app.soundtrack.pause();
                }
                // pause auto advance
                this.status.emit("pause");
            }
        },

        suspend: function() {
            if ( this.state == "playing" ) {
                this.state ="suspended";
                // pause each frame - layer
                this.status.get("current_frame_model").pause();
                if ( app.soundtrack ) {
                    app.soundtrack.pause();
                }
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

        // mobile only hack
        // TODO -- this blows -j
        mobileLoadAudioLayers: function() {
            this.project.sequences.each(function( sequence ) {
                sequence.frames.each(function( frame ) {
                    frame.layers.each(function( layer ) {
                        if ( layer.get("type") == "Audio") {
                            var audio = document.getElementById("audio-el-" + layer.id );
                            
                            audio.load();
                            
                            return audio;
                        }
                    });
                });
            });
        },


        // returns project data
        getProjectData: function() {
            return this.project.getProjectJSON();
        },

        getSoundtrack: function() {
            return app.soundtrack;
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

        // completely obliterate the player. triggers event
        destroy: function() {

            this.layout.$el.fadeOut( this.get("fadeOut"), function() {
                // destroy all layers before calling player_destroyed
                this.project.sequences.each(function( sequence ) {
                    sequence.frames.each(function( frame ) {
                        if ( frame ) {
                            // frame.destroy();
                            if ( app.soundtrack ) {
                                app.soundtrack.destroy();
                            }
                            frame.layers.each(function( layer ) {
                                layer.destroy();
                            });
                        }
                    });
                });
                this.layout.remove();
                this.status.emit("player_destroyed");
            }.bind( this ));
        },

        /**
        resize the players based on the current browser window dimensions

        @method fitPlayer
        **/
        fitWindow: function() {
            this.layout.resizeWindow();
        }

    });
});
