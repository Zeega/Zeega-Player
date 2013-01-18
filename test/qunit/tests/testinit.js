(function( global ) {
    var rules, domains, fixtures;

    fixtures = [
        "<iframe id='%%KEY%%' src='fixtures/index.html%%QUERY%%'></iframe>"
    ];

    domains = {
        frame: [ "frame_ready", "frame_rendered" ],
        layer: [ "layer_loading", "layer_ready" ],
        player: [ "can_play", "play", "ready" ],
        data: [ "data_loaded" ],
        sequence: [ "sequence_enter" ]
    };

    rules = {
        layer: /^layer_/,
        frame: /^frame_/,
        data: /^data_/,
        sequence: /^sequence_/,
        player: /^(ready|play|can_)/
    };

    global.Abstract = {
        // [[Put]] props from dictionary onto |this|
        // MUST BE CALLED FROM WITHIN A CONSTRUCTOR:
        //  Abstract.put.call( this, dictionary );
        put: function( dictionary ) {
            // For each own property of src, let key be the property key
            // and desc be the property descriptor of the property.
            Object.getOwnPropertyNames( dictionary ).forEach(function( key ) {
                this[ key ] = dictionary[ key ];
            }, this);
        },
        merge: function() {
            return [].slice.call( arguments ).reduce(function( initial, obj ) {
                return Abstract.assign( initial, obj );
            }, {});
        },
        // Shims ES6 Object.assign()
        assign: function( O, dictionary ) {
            Abstract.put.call( O, dictionary );

            return O;
        },
        // Shims ES6 Object.mixin()
        mixin: function( receiver, supplier ) {
            return Object.keys( supplier ).reduce(function( receiver, property ) {
                return Object.defineProperty(
                    receiver, property, Object.getOwnPropertyDescriptor( supplier, property )
                );
            }, receiver );
        }
    };

    Abstract.combine = Abstract.merge;


    global.Test = {
        // Get the "domain" by event type
        event: {
            domain: function( type ) {
                return Object.keys( rules ).reduce(function( initial, rule ) {
                    return rules[ rule ].test( type ) ? rule : initial;
                }, "");
            }
        },

        project: {
            //...
        },

        //
        report: function( params, response ) {
            var message = Abstract.combine( params, response );

            try {
                top.postMessage( JSON.stringify(message) , "*");
            } catch ( e ) {
                console.log(
                    e.message, [ params, response ]
                );
            }
        },

        setup: function( properties ) {
            var params = Params.from( properties || {} ),
                query = ( params ? "?" + params : "" );

            if ( !Test.reset.fixture ) {
                Test.reset.fixture = document.getElementById("zeega-fixture");
            }


            Test.reset.fixture.innerHTML += fixtures.reduce(function( html, fixture ) {
                var interpolated = fixture.replace( /%%QUERY%%/g, query )
                                        .replace( /%%KEY%%/, params.key );

                return ( html += interpolated, html );
            }, "");

            return true;
        },
        reset: function( properties ) {
            var params = Params.from( properties || {} ),
                query = ( params ? "?" + params : "" );

            if ( !Test.reset.fixture ) {
                Test.reset.fixture = document.getElementById("zeega-fixture");
            }

            Test.reset.fixture.removeChild( document.getElementById( params.key ) )

            return true;
        },

        key: function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(chr) {
                var rnd = Math.random() * 16 | 0;
                return (chr === "x" ? rnd : (rnd & 0x3 | 0x8)).toString(16);
            }).toUpperCase();
        }
    };

    function queryToObject( subject ) {
        var query, keyvals, pair, pairs, value;

        query = subject || window.location.search;
        keyvals = [];
        pairs = {};

        console.log( "queryToObject", query );

        if ( query ) {
            query = query.replace(/^\?|\#\w+/g, "");
            keyvals = query.split("&");

            while ( keyvals.length ) {
                pair = keyvals.shift().split("=");
                value = decodeURIComponent( pair[1] );

                // Convert to valid numbers where possible
                if ( (+value + "") === value ) {
                    value = +value;
                }
                pairs[ pair[0] ] = value;
            }
        }

        return pairs;
    }

    function objectToQuery( params ) {
        var keys = Object.keys( params );

        if ( keys.length === 0 ) {
            return "";
        }

        return keys.reduce(function( str, key ) {
            return (( str += key + "=" + encodeURIComponent( params[ key ] ) + "&" ), str);
        }, "").slice( 0, -1 );
    }

    global.Params = {
        from: function( arg ) {
            if ( typeof arg === "string" ) {
                return queryToObject( arg );
            }
            return objectToQuery( arg );
        }
    };

}( this ));



// Provide sane set of rules for Event data objects to validate
// them as relevant to the event that was emitted.
//
// TODO: Make the values represent values that we'd expect to see
//        on the actual object that we're analyzing.
//
Test.shapes = {
    data: {

    },
    frame: {
        _next: Number,
        _prev: Number,
        _sequence: Object,
        attr: Object,
        common_layers: Object,
        connections: String,
        id: Number,
        layers: Array,
        link_from: Array,
        link_to: Array,
        preload_frames: Array
    },
    layer: {
        aspect: Number,
        attr: Object,
        citation: Boolean,
        default_controls: Boolean,
        draggable: Boolean,
        has_controls: Boolean,
        height: Number,
        id: Number,
        left: Number,
        linkable: Boolean,
        mode: String,
        opacity: Number,
        project_id: String,
        resizable: Boolean,
        target_div: String,
        title: String,
        top: Number,
        type: String,
        url: String,
        width: Number
    },
    /*
        PROBLEM:

        Validating instance shape is impossible until all player
        instances have the SAME properties, whether or not they
        are defined or left null/empty.
     */

    player: {
        data: Object,
        debugEvents: Boolean,
        frames: Object,
        layers: Object,
        layerOptions: Object,
        sequences: Object,
        parser: String,
        autoplay: Boolean,
        collectionMode: String,
        target: Object,
        fadeIn: Number,
        fadeOut: Number,
        keyboard: Boolean,
        next: String,
        preloadRadius: Number,
        prev: String,
        startFrame: Number,
        url: String
    },
    sequence: {
        attr: Array,
        frames: Array,
        id: Number,
        persistent_layers: Array,
        title: String
    }
};

function Register( instruct ) {
    if ( !(this instanceof Register) ) {
        return new Register( instruct );
    }
    Abstract.mixin( this, instruct );

    this.key = instruct.params.key = Test.key();
    this.cleanup = function() {
        if ( this.complete ) {
            this.complete();
        }
        Test.reset( this.params );
    }.bind(this);

    Register.queue[ this.key ] = this;

    Test.setup( this.params );
}

Register.queue = {};

if ( window === top ) {
    window.addEventListener( "message", function handler( event ) {
        var response, instruct, handler, cleanup;

        response = JSON.parse( event.data );
        instruct = Register.queue[ response.key ];
        handler = handlers[ response.type ];
        cleanup = function() {
            delete Register.queue[ response.key ];
            if ( instruct ) {
                instruct.cleanup();
            }
        };

        if ( handler ) {
            handler( response, cleanup );
        } else {
            console.warn( "Unhandled Response: ", response );
        }
    }, false );
}
