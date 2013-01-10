define([
    "zeega",
    "libs/modernizr",
    "vendor/popcorn/popcorn-complete"
],

function(Zeega) {

    var Player = {Views:{}};

    Player.Views.Player = Zeega.Backbone.View.extend({

        className: "media-player-container",

        defaults: {
            control_mode: "none", // none / simple / standard / editor
            control_fade: true,

            media_target: null,
            controls_target: null,

            autoplay: false,
            cue_in: 0,
            cue_out: null,
            volume: 0.5,
            fade_in: 0,
            fade_out: 0
        },

        initialize: function( options ) {
            var clone, format, settings, model;
            // defaults
            model = null;

            if ( this.model !== undefined ) {
                //_.extend( this.defaults, this.options );
                //if there is a model then figure out what kind it is
                clone = _.extend({}, this.model.toJSON());

                settings = _.defaults(
                    _.extend( clone.attr, this.options ), this.defaults
                );

                if ( this.model.get("uri") !== undefined ) {
                    // it must be from an item
                    format = this.getFormat( clone.attribution_uri );
                } else if ( clone.attr && clone.attr.uri ) {
                    // it must be from a layer
                    format = this.getFormat( clone.attr.attribution_uri );
                    settings.id = this.model.id;
                } else {
                    console.log("I dont know what kind of media this is:(");
                }

                this.format = format;
                this.settings = settings;
                this.settings.model = model;
            }

            this.model.on( "pause_play", this.playPause, this );
        },

        render: function() {
            // move this to the CSS !!!  .media-player-container{ height, width}
            this.$el.css({
                "width": "100%",
                "height": "100%"
            });

            // choose which template to use
            var format = this.templates[ this.format ] ? this.format: "defaulttemplate";

            this.$el.html(
                _.template( this.templates[format](), this.settings )
            );

            //attach controls. is this the right place?
            this.controls = new Player.Views.Player.Controls[ this.settings.control_mode ]({
                model: this.model,
                detached_controls: !_.isNull(this.settings.controls_target)
            });
            //draw the controls
            if ( _.isNull(this.settings.controls_target) ) {
                this.$el.append( this.controls.render().el );
            } else {
                Zeega.$( this.settings.controls_target ).html( this.controls.render().el );
            }

            return this;
        },

        placePlayer: function() {
            var _this = this,
                type = this.model.get("type");

            if ( !this.isVideoLoaded ) {

                switch( this.format ) {
                    case "html5":
                        if ( (type == "Audio" && Modernizr.audio.mp3 === "") ||
                             (type == "Video" && Modernizr.audio.h264 === "") ) {
                            this.useFlash();
                        } else {
                            this.useHTML5();
                        }
                        break;
                    case "flashvideo":
                        this.useFlash();
                        break;
                    case "youtube":
                        this.useYoutube();
                        break;
                    case "vimeo":
                        this.useVimeo();
                        break;
                    default:
                        console.log("none set");
                }

                this.initPopcornEvents();

                this.isVideoLoaded = true;
            }
        },

        initPopcornEvents: function() {
            if ( this.popcorn ) {

                this.popcorn.on( "canplay", function() {
                    this.private_onCanPlay();
                    this.onCanplay();
                }.bind(this));

                this.popcorn.on( "timeupdate", function() {
                    this.private_onTimeUpdate();
                }.bind(this));

                this.popcorn.on( "ended", function() {
                    this.onEnded();
                }.bind(this));
            }
        },

        addPopcornToControls: function() {
            if ( this.controls && this.popcorn && this.settings.control_mode != "none" ) {
                this.controls.addPopcorn( this.popcorn );
            }
        },

        useHTML5: function() {
            var _this = this,
                target = "#media-player-html5-" + this.model.id,
                model = this.model;

            this.popcorn = Popcorn( target );
            this.addPopcornToControls();
            this.setVolume(0);

            this.popcorn.on( "canplay", function() {

                //_this.$el.spin(false);
                if ( _this.settings.fade_in === 0 ) {
                    _this.setVolume( _this.settings.volume );
                }

                if ( _this.settings.cue_in !== 0 ) {
                    this.on( "seeked", function() {
                        model.can_play = true;
                        model.trigger( "visual_ready", _this.model.id );
                    });
                    _this.setCurrentTime( _this.settings.cue_in );
                }
                else {
                    model.can_play = true;
                    model.trigger( "visual_ready", _this.model.id );
                }
            });
        },
        useYoutube: function() {
            var _this = this,
                target = "#media-player-" + this.model.id,
                src = this.model.get("attr").attribution_uri,
                model = this.model;

            this.popcorn = Popcorn.youtube( target, src, {
                volume: this.settings.volume * 100,
                cue_in: this.settings.cue_in
            });

            this.addPopcornToControls();
            this.setVolume(0);

            this.popcorn.on( "canplaythrough",function() {
                _this.popcorn.play();
                _this.popcorn.pause();

                model.can_play = true;
                model.trigger( "visual_ready", _this.model.id );

                if ( model.get("attr").fade_in === 0 ) {
                    _this.volume( model.get("attr").volume );
                }
                _this.popcorn.pause();
            });

        },
        useFlash: function() {
            var _this = this,
                target = "#media-player-" + this.model.id,
                src = this.model.get("attr").uri,
                model = this.model;

            this.popcorn = Popcorn.flashvideo( target, src, {
                volume: this.settings.volume,
                cue_in: this.settings.cue_in
            });

            this.popcorn.on( "loadeddata",function() {
                //_this.$el.spin(false);

                model.can_play = true;
                model.trigger( "visual_ready", _this.model.id );

                if ( model.get("attr").fade_in === 0 ) {
                    _this.volume( model.get("attr").volume );
                }
            });
        },

        useVimeo: function() {
            this.popcorn = Popcorn.vimeo( "#media-player-"+ this.model.id, this.get("url") );
            this.popcorn.on( "loadeddata",function() {
                _this.trigger("video_canPlay");
                _this.popcorn.currentTime( _this.get("cue_in") );
            });
        },
        private_onCanPlay: function() {
            this.model.set( "duration", this.popcorn.duration() );

            if ( this.model.get("cue_out") === null ) {
                this.model.set( "cue_out", this.popcorn.duration() );
            }
        },
        onCanplay: function() {
            if ( this.settings.autoplay && this.popcorn ) {
                this.popcorn.play();
            }
        },

        _onEnded: function() {
            this.model.trigger( "media_ended", this.model.toJSON() );
        },

        // getters && setters //

        setVolume: function( vol ) {
            var volume;
            // constrain volume to 0 < v < 1, defend against string, object, etc...
            volume = isNaN( +( volume = vol < 0 ? 0 : vol > 1 ? 1 : vol ) ) ? 0 : volume;

            this.popcorn.volume( volume );
        },
        getVolume: function() {
            return this.popcorn.volume();
        },

        setCurrentTime: function( t ) {
            if ( _.isNumber( t ) )  {
                this.popcorn.currentTime(t);
            }
        },
        getCurrentTime: function() {
            return this.popcorn.currentTime();
        },

        private_onTimeUpdate: function() {
            var cueOut = this.settings.cue_out;

            // pause if player gets to the cue out point

            if ( cueOut === 0 ) {
                this.settings.cue_out = cueOut = his.getDuration();
            }

            if ( cueOut !== null && this.popcorn.currentTime() >= cueOut ) {
                this.pause();
                this.popcorn.currentTime( this.settings.cue_in );
            }
        },

        getDuration: function() {
            return this.popcorn.duration();
        },

        play: function() {
            if ( this.popcorn && this.popcorn.paused() ) {
                this.popcorn.play();
            }
        },
        pause: function() {
            if ( this.popcorn && !this.popcorn.paused() ) {
                this.popcorn.pause();
            }
        },
        playPause: function() {
            if ( this.popcorn ) {
                if ( this.popcorn.paused() ) {
                    this.popcorn.play();
                } else {
                    this.popcorn.pause();
                }
            }
        },

        destroy: function() {
            if ( this.popcorn ) {
                this.popcorn.pause();
                Popcorn.destroy( this.popcorn );
            }
        },

        getFormat: function( url ) {
            var format = "html5";

            // TODO: This regex might be overkill
            // Popcorn qualifies youtube urls with:
            // /(?:http:\/\/www\.|http:\/\/|www\.|\.|^)(youtu)/.test( url)
            if ( url.match(/http:\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#\!)v=)([\w\-]{11}).*/gi) ) {
                format = "youtube"; // linted?
            }
            // TODO: same as above:
            // This can probably be simplified as well...
            if ( url.match(/^http:\/\/(?:www\.)?vimeo.com\/(.*)/) ) {
                format = "vimeo";
            }

            // Force flash for html5 in Firefox browser
            if ( /Firefox/.test( navigator.userAgent ) && format === "html5" ) {
                format = "flashvideo";
            }
            return format;
        },


        templates: {

            html5: function() {
                html = "<div id='media-player-<%= id %>' class='media-container'><video id='media-player-html5-<%= id %>' class='media-element media-type-<%= media_type %>' src='<%= uri %>'></video></div>";

                return html;
            },

            flashvideo: function() {
                html = "<div id='media-player-<%= id %>' class='media-container' style='width:100%;height:100%;'></div>";

                return html;
            },

            defaulttemplate: function() {
                html = "<div id='media-player-<%= id %>' class='media-container' style='width:100%;height:100%;'></div>";

                return html;
            }
        }
    });


    /*****************************

        CONTROLS

    *****************************/

    Player.Views.Player.Controls = Player.Views.Player.Controls || {};

    Player.Views.Player.Controls.none = Zeega.Backbone.View.extend({
        className: "controls playback-controls controls-none",
        item_mode: false,

        initialize: function() {
            if ( this.options.detached_controls ) {
                this.$el.addClass("playback-layer-controls");
            }

            if ( this.model.get("uri") ) {
                this.item_mode = true;
            }
            this.init();
        },

        init: function() {}
    });

    Player.Views.Player.Controls.simple = Player.Views.Player.Controls.none.extend({

        className: "controls playback-controls controls-simple",

        addPopcorn: function( pop ) {
            this.popcorn = pop;
            this.initPopcornEvents();
        },

        initPopcornEvents: function() {
            var _this = this;

            // TODO: Can this be DRY'ed out?
            this.popcorn.on( "canplay", function() { _this.onCanPlay(); });
            this.popcorn.on( "canplaythrough", function() { _this.onCanPlay(); });
            this.popcorn.on( "ended", function() { _this.onEnded(); });
            this.popcorn.on( "playing", function() { _this.onPlaying(); });
            this.popcorn.on( "pause", function() { _this.onPause(); });
        },

        render: function() {
            this.$el.html( this.getTemplate() );
            return this;
        },

        events: {
            "click": "playPause",
            "mouseover": "onMouseover",
            "mouseout": "onMouseout"
        },

        onCanPlay: function() {
            this.updatePlayPauseIcon();
            this.updateCues();
        },

        updateCues: function() {
            var isItemMode = this.item_mode,
                attrs = this.model.get("attr");

            this.cueIn = isItemMode ? this.model.get("cue_in") : attrs.cue_in;
            this.cueOut = isItemMode ? this.model.get("cue_out") : attrs.cue_out;

            if ( !this.cueOut ) {
                this.cueOut = this.duration;
            }
        },

        playPause: function() {

            if ( this.popcorn ) {
                if ( this.popcorn.paused() ) {
                    this.popcorn.play();
                } else {
                    this.popcorn.pause();
                }
                this.updatePlayPauseIcon();
            }
            // TODO: Why return false?
            return false;
        },

        updatePlayPauseIcon: function() {
            if ( this.popcorn ) {
                this.$el.find(".pause-play i")
                    .removeClass( !this.popcorn.paused() ? "icon-play" : "icon-pause" )
                        .addClass( !this.popcorn.paused() ? "icon-pause" : "icon-play" );
            }
        },

        onPlaying: function() {
            // fade out after play
            if ( this.model.get("control_fade") ) {
                this.setFadeTimeout();
            }
            // TODO: Why is this called twice?
            this.updatePlayPauseIcon();
            this.updatePlayPauseIcon();
        },

        setFadeTimeout: function() {
            if ( this.timer ) {
                clearTimeout( this.timer );
            }

            this.timer = setTimeout(function() {
                this.fadeOutControls();
                clearTimeout( this.timer );
            }.bind(this), 3500);
        },

        onMouseover: function() {
            if ( this.model.get("control_fade") && !this.popcorn.paused() ) {
                if ( this.timer ) {
                    clearTimeout( this.timer );
                }

                this.fadeInControls();
            }
        },
        onMouseout: function() {
            if ( this.model.get("control_fade") && !this.popcorn.paused() ) {
                this.setFadeTimeout();
            }
        },

        fadeOutControls: function() {
            var playControl = this.$el.find(".player-control-inner");

            if ( playControl.is(":visible") && !this.popcorn.paused() ) {
                playControl.fadeOut("slow");
            }
        },
        fadeInControls: function() {
            var playControl = this.$el.find(".player-control-inner");

            if ( playControl.is(":hidden") ) {
                playControl.fadeIn("fast");
            }
        },

        onPause: function() {
            if ( this.timer ) {
                clearTimeout( this.timer );
            }

            // make sure  controls are visible
            this.fadeInControls();
            this.updatePlayPauseIcon();
        },

        onEnded: function() {
            this.$el.find(".pause-play i").addClass("icon-play").removeClass("icon-pause");
        },

        getTemplate: function() {
            var html = "<div class='player-control-inner'><a href='#' class='pause-play pull-left'><i class='icon-pause icon-white'></i></a></div>";

            return html;
        }
    });

    Player.Views.Player.Controls.standard = Player.Views.Player.Controls.simple.extend({

        isSeeking: false,

        className: "controls playback-controls controls-standard",

        addPopcorn: function( pop ) {
            this.popcorn = pop;
            this.initPopcornEvents();
        },

        initPopcornEvents: function() {
            var _this = this;

            // TODO: same DRY-out concern as above
            this.popcorn.on( "canplay", function() { _this.onCanPlay(); });
            this.popcorn.on( "canplaythrough", function() { _this.onCanPlay(); });
            this.popcorn.on( "ended", function() { _this.onEnded(); });
            this.popcorn.on( "playing", function() { _this.onPlaying(); });
            this.popcorn.on( "pause", function() { _this.onPause(); });
            this.popcorn.on( "timeupdate", function() { _this.updateElapsed(); });
        },

        events: {
            "click .pause-play": "playPause",
            "mouseover": "onMouseover",
            "mouseout": "onMouseout"
        },

        onCanPlay: function() {
            this.updateDuration();
            this.updateCues();
            this.updatePlayPauseIcon();
            this.initScrubber();
        },

        initScrubber: function() {
            var _this = this;

            this.$(".media-scrubber").slider({
                range: "min",
                min: 0,
                max: this.duration,

                slide: function( e, ui ) {
                    _this.scrub( ui.value );
                },
                stop: function( e, ui ) {
                    _this.seek( ui.value );
                }
            });
        },

        updateDuration: function() {
            this.duration = this.popcorn.duration();
            this.$(".media-time-duration").html( convertTime(this.duration) );
        },
        updateElapsed: function() {
            var elapsed = this.popcorn.currentTime();
            console.log('update', elapsed);
            this.$(".media-time-elapsed").html( convertTime( elapsed ) );
            this.$(".media-scrubber").slider("value", elapsed);
        },

        scrub: function( time ) {
            var _this = this;
            this.isSeeking = true;

        },
        seek: function( time ) {
            var isPlaying = !this.popcorn.paused();

            if ( isPlaying ) {
                this.popcorn.pause();
            }

            if ( time < this.cueIn ) {
                time = this.cueIn;
            } else if ( time > this.cueOut ) {
                time = this.cueOut;
            }

            this.$el.find(".media-scrubber").slider( "value", time );

            this.popcorn.currentTime( time );

            if ( isPlaying ) {
                this.popcorn.play();
            }
        },

        getTemplate: function() {
            var html =
            "<div class='player-control-inner'>"+
                "<div class='media-scrubber'></div>"+
                "<div class='control-panel-inner'>"+
                    "<a href='#' class='pause-play pull-left'><i class='icon-pause icon-white'></i></a>"+
                    "<div class='pull-right'><span class='media-time-elapsed'>0:00</span> / <span class='media-time-duration'>0:00</span></div>"+
                "</div>"+
            "</div>";

            return html;
        }
    });

    Player.Views.Player.Controls.editor = Player.Views.Player.Controls.standard.extend({

        className: "controls playback-controls controls-editor",

        initPopcornEvents: function() {
            var _this = this;

            // TODO: Same concern as above
            this.popcorn.on( "canplay", function() { _this.onCanPlay(); });
            this.popcorn.on( "canplaythrough", function() { _this.onCanPlay(); });
            this.popcorn.on( "ended", function() { _this.onEnded(); });
            this.popcorn.on( "timeupdate", function() { _this.updateElapsed(); });
            this.popcorn.on( "playing", function() { _this.onPlaying(); });
            this.popcorn.on( "pause", function() { _this.onPause(); });
        },

        events: {
            "click .pause-play": "playPause",
            "mouseover": "onMouseover",
            "mouseout": "onMouseout",
            "mousedown .progress-outer": "scrub"
        },

        onCanPlay: function() {
            this.updateDuration();
            this.updateCues();
            this.updatePlayPauseIcon();

            this.initScrubber();
            this.initCropTool();
        },

        updateDuration: function() {
            this.duration = this.popcorn.duration();
            this.$el.find(".media-time-duration").html( convertTime(this.duration) );
        },
        updateElapsed: function() {
            var elapsed = this.popcorn.currentTime();
            this.$(".media-time-elapsed").html( convertTime( elapsed ) );
            this.$(".media-scrubber").slider("value", elapsed);
            if (elapsed >= this.cueOut) this.popcorn.pause();
        },

        initCropTool: function() {
            var _this = this;

            //this.cueIn = this.item_mode ? this.model.get("cue_in"): this.model.get("attr").cue_in;
            //this.cueOut = (this.item_mode ? this.model.get("cue_out"): this.model.get("attr").cue_out) || this.duration;

            this.$el.find(".crop-time-left .time").text( convertTime( this.cueIn ) );
            this.$el.find(".crop-time-right .time").text( convertTime( this.cueOut ) );

            this.$el.find(".crop-slider").slider({
                range:true,
                min:0,
                max:_this.duration,
                values: [ _this.cueIn , _this.cueOut ],
                slide: function(e,ui) { _this.onCropSlide(e,ui); },
                stop: function(e,ui) { _this.onCropStop(e,ui); }
            });

            this.$el.find(".crop-time-left .time").unbind("keypress").keypress(function(e) {
                var sec;

                // TODO: This needs refactoring
                if ( (e.which >= 48 && e.which <= 58) || e.which == 13 ) {
                    if ( e.which == 13 ) {
                        sec = _this.convertToSeconds( Zeega.$(this).text() );

                        if ( sec === false ) {
                            Zeega.$(this).text( convertTime(_this.model.get("cue_in")) );
                        } else {

                            sec = sec < 0 ? 0: sec;
                            sec = sec > _this.model.get("cue_out") ? _this.model.get("cue_out"): sec;
                            Zeega.$(this).text( convertTime(sec) );
                            _this.$el.find(".crop-slider").slider("values",0, sec );
                            _this.cueIn =sec;
                            _this.model.update({ "cue_in": sec });
                            _this.seek( sec );
                        }
                        this.blur();
                        return false;
                    }
                }
                else return false;
            });
            this.$el.find(".crop-time-right .time").unbind("keypress").keypress(function(e) {
                var sec;

                if ( (e.which >= 48 && e.which <= 58) || e.which == 13 ) {
                    if ( e.which == 13 ) {
                        sec = _this.convertToSeconds( Zeega.$(this).text() );

                        if ( sec === false ) {
                            Zeega.$(this).text( convertTime(_this.model.get("cue_out")) );
                        } else {
                            sec = sec > _this.duration ? _this.duration: sec;
                            sec = sec < _this.model.get("cue_in") ? _this.model.get("cue_in"): sec;
                            Zeega.$(this).text( convertTime(sec) );
                            _this.$el.find(".crop-slider").slider("values",1, sec );
                            _this.cueOut = sec;
                            _this.seek( Math.max(sec-5,_this.cueIn) );
                            _this.model.update({ "cue_out": sec });
                        }
                        this.blur();
                        return false;

                    }
                }
                else return false;
            });

            //Temp fix, this should be removed
            Zeega.$(".time").mousedown(function() {
                Zeega.$(this).focus();
            });
        },

        // TODO: If this is converting SMPTE strings, then I'd recommend
        // using Popcorn.util.toSeconds(), as it's well tested
        convertToSeconds: function( string ) {
            var st = string.split(/:/),
                flag = false,
                sec = 0;

            _.each( st.reverse(), function( number,i ) {
                var num;

                if ( number.length > 2 ) {
                    flag = true;
                    return false;
                } else {
                    num = parseInt(number,10);

                    if ( !_.isNumber(num) ) {
                        flag = true;
                        return false;
                    } else {
                        if (i) {
                            sec += num * i * 60;
                        } else {
                            sec += num;
                        }
                    }
                }
            });

            // TODO: What does this mean??
            if ( flag ) {
                return false;
            } else {
                return sec;
            }
        },

        onCropSlide: function( e, ui ) {
            this.$el.find(".crop-time-left .time").html( convertTime(ui.values[0]) );
            this.$el.find(".crop-time-right .time").html( convertTime(ui.values[1]) );
        },

        onCropStop: function( e, ui ) {
            this.cueIn = ui.values[0];
            this.cueOut = ui.values[1];

            if ( !this.item_mode ) {
                this.model.update({
                    "cue_in": ui.values[0],
                    "cue_out": ui.values[1]
                });
            }

            this.popcorn.pause();
            this.seek( ui.values[0] );
        },

        getTemplate: function() {
            var html =
            "<div class='player-control-inner'>" +

                "<div class='crop-wrapper'>" +
                    "<div class='crop-time-values clearfix'><span class='crop-time-left'>in [<span class='time' contenteditable='true'>0:00</span>]</span><span class='crop-time-right'>out [<span class='time' contenteditable='true'>0:00</span>]</span></div>" +
                    "<div class='crop-slider'></div>" +
                "</div>" +

                "<div class='media-scrubber'></div>" +

                "<div class='control-panel-inner'>" +
                    "<a href='#' class='pause-play pull-left'><i class='icon-play icon-white'></i></a>" +
                    "<div class='pull-right'><span class='media-time-elapsed'>0:00</span> / <span class='media-time-duration'>0:00</span></div>" +
                "</div>" +

            "</div>";

            return html;
        }
    });


    return Player;

});
