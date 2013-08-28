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
        soundtrackState: "waiting",
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
            this.emit("player player:ready", this );
            this._listenToZeega();
            this._renderLayout();
        },

        _listenToZeega: function() {
            this.zeega.on("all", function( event, attributes ) {
                this.emit( event, attributes );
            }, this );
        },

        // renders the player to the dom // this could be a _.once
        _renderLayout: function() {
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
            this.once("layout:rendered", this._onRendered, this );

            // do not apply relative style if the zeega is in appended to the body
            if ( !target.is("body") ) {
                target.css( "position", "relative" );
            }

            this.layout.render();
        },

        _onRendered: function() {
            this.ready = true;
            this._renderSoundtrack();
            this._initEvents();
            this.emit( "ready", this );

            if ( this.get("autoplay") ) this.play();

            this.zeega.getCurrentPage().once("layers:ready", function() {
                this.emit("player player:canplay", this );
            }, this );

            this.preloadPage( this.zeega.getCurrentPage() );

            this.zeega.on("project:soundtrack_switch", this.onSoundtrackSwitch, this );
        },

        onSoundtrackSwitch: function( soundtracks ) {
            if ( soundtracks.previous ) {
                soundtracks.previous.pause();
            }
            if ( soundtracks.next ) {
                if ( soundtracks.next.state != "ready" ) {
                    this._renderSoundtrack( soundtracks.next, true );
                } else {
                    soundtracks.next.play();
                }
            }
        },

        _renderSoundtrack: function( st, autoplay ) {
            var soundtrack = st || this.zeega.getSoundtrack();

            autoplay = autoplay || false;

            if ( soundtrack ) {
                this.emit("soundtrack soundtrack:loading", soundtrack );
                soundtrack.once("layer:ready", function() {
                        this._onSoundtrackReady( soundtrack, autoplay );
                    }, this );
                soundtrack.set("_target", this.layout.$(".ZEEGA-soundtrack") );
                soundtrack.render();
            }
        },

        _onSoundtrackReady: function( soundtrack, autoplay ) {
            this.soundtrackState = "ready";
            this.emit("soundtrack soundtrack:ready", soundtrack );

            if ( this.get("autoplay") || autoplay ) this.zeega.getSoundtrack().play();
        },

        play: function() {
            var page = this.zeega.getCurrentPage();
            var soundtrack = this.zeega.getSoundtrack();

            if ( !this.ready ) {
                this.renderLayout(); // render the player first! // this should not happen
            } else if ( this.state == "paused" || this.state == "suspended" ) {
                this._fadeIn();
                this.cuePage( page );
                
                if ( soundtrack ) {
                    this.zeega.getSoundtrack().play();
                }
                this.emit("player player:play", this );
            }
        },

                // if the player is playing, pause the project
        pause: function() {
            if ( this.state == "playing" ) {
                this.state ="paused";

                this.zeega.getCurrentPage().pause();
                if ( this.zeega.getSoundtrack() ) {
                    this.zeega.getSoundtrack().pause();
                }
                // pause auto advance
                this.emit("pause", this );
            }
        },

        playPause: function() {
            if ( this.state == "paused" || this.state == "suspended" ) this.play();
            else this.pause();
        },

        cuePage: function( page ) {
            if ( page.state == "ready" ) {
                this.state = "playing";
                this.zeega.focusPage( page );
            } else {
                this.playAndWaitForPageLoad( page );
            }
            this.preloadPage( page );
        },

        playAndWaitForPageLoad: function( page ) {
            this.state = "playing";
            this.zeega.focusPage( page );
        },

        preloadTimer: null,

        preloadPage: function( page ) {
            var nextPage = this.zeega.getNextPage( page );

            this.zeega.preloadNextZeega();
            clearTimeout( this.preloadTimer );

            page.preload();
            for ( var i = 0; i < this.get("preloadRadius"); i++ ) {
                if( nextPage ) {
                    nextPage.once("layers:ready", function() {
                        this.onPreloadFinish( nextPage );
                    }, this );
                    
                    nextPage.preload();
                    nextPage = this.zeega.getNextPage( nextPage );
                }
            }

        },

        onPreloadFinish: _.debounce(function( page ) {
            var newStartPage = _.find( this.zeega.getPages(), function( page ) {
                return page.state == "waiting";
            });

            if ( newStartPage ) {
                this.onPreloadIdle( newStartPage );
            }

        }, 1500),

        onPreloadIdle: function( page ) {
            var next = this.zeega.getNextPage( page );

            if ( next && next.state == "waiting" ) {
                next.once("layers:ready", function() {
                    this.preloadTimer = setTimeout(function() {
                        this.onPreloadIdle( next );
                    }.bind(this), 500 );
                }, this );

                next.preload();
            }
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

            if ( this.get("debugEvents") ) console.log("player evt: ", event, options );
        },

        // goes to the next frame after n ms
        cueNext: function() {
            var nextPage = this.zeega.getNextPage();

            if ( nextPage ) {
                this.cuePage( this.zeega.getNextPage() );
            }
        },

        // goes to the prev frame after n ms
        cuePrev: function( ms ) {
            var prevPage = this.zeega.getPreviousPage();

            if ( prevPage ) {
                this.cuePage( this.zeega.getPreviousPage() );
            }
        },

        // move this to layout
        _initEvents: function() {

            if ( this.get("keyboard") ) {

                app.$(window).bind("keyup.preview",function( event ) {
                    switch( event.which ) {
                        case 37: // left arrow
                            this.cuePrev();
                            break;
                        case 39: // right arrow
                        console.log("RIGHT")
                            this.cueNext();
                            break;
                        case 32: // spacebar
                            this.playPause();
                            break;
                    }
                }.bind( this ));


                // app.$(window).keyup(function( event ) {
                //     switch( event.which ) {
                //         case 37: // left arrow
                //             this.cuePrev();
                //             break;
                //         case 39: // right arrow
                //             this.cueNext();
                //             break;
                //         case 32: // spacebar
                //             this.playPause();
                //             break;
                //     }
                // }.bind( this ));
            }
        },

        _removeListeners: function() {
            if ( this.get("keyboard") ) {
                app.$(window).unbind("keyup.preview");
            }

            this.zeega.off("all");

            // this.off("cue_frame");
            // this.off("size_toggle");
            // relays
        },




/////





        // attach listeners
        _listen: function() {
            console.log("**************_listen")
            this.on("cue_frame", this.cueFrame, this );
            this.on("size_toggle", this.toggleSize, this );
        },

        toggleSize: function() {
            this.layout.toggleSize();
        },

        mute: function() {
            // TODO
        },

        unMute: function() {
            // TODO
        },

        mobileLoadAudioLayers: function() {
            if ( app.player.zeega.getSoundtrack().state != "ready" ) {
                var audio = document.getElementById("audio-el-" + app.player.zeega.getSoundtrack().id );
                
                if ( audio ) {
                    audio.load();
                    audio.addEventListener("canplay",function() {
                        app.player.zeega.getSoundtrack().state = "ready";
                        audio.removeEventListener("canplay");
                        audio.play();
                    });
                }
            }
        },


        // returns project data
        getProjectData: function() {
            return this.zeega.getProjectJSON();
        },

        getSoundtrack: function() {
            return app.soundtrack;
        },

        getFrameData: function() {
            if ( this.zeega.getCurrentPage() ) {
                return _.extend({},
                    this.zeega.getCurrentPage().toJSON(),
                    { layers: this.zeega.getCurrentPage().layers.toJSON() }
                );
            }

            return false;
        },

        // completely obliterate the player. triggers event
        destroy: function() {
            this._removeListeners();
            this.layout.$el.fadeOut( this.get("fadeOut"), function() {
                this.zeega.destroy();
                this.layout.remove();
                this.emit("player_destroyed");
                this.clear();
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
