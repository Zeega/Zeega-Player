var handlers, counters;


counters = [];

// Each test subject will have a handler registered here.
//
//  - Handlers may be reused for several tests of the
//    same subject type. ie. Event tests
//
handlers = {

    player: function( response, complete ) {
        var shape, title,
            payload = response.payload;

        title = "TEST: " + response.test;


        if ( response.test === 1 ) {

            shape = Object.keys( Test.shapes.player ).sort();

            payload.attributes.forEach(function( result, k ) {
                var compare = result.keys.sort();

                deepEqual(
                    compare, shape, "'" + result.player + "' has expected attribute shape"
                );
            });

            complete();
        }

        if ( response.test === 2 ) {

            jQuery.ajax({
                url: "fixtures/example-data.json",
                type: "get",
                success: function( data ) {

                    var shape = Object.keys( $.parseJSON( data ) ).sort(),
                        payload = response.payload.sort();

                    deepEqual(
                        payload, shape, "player.data has expected attribute shape"
                     );

                    complete();
                }
            });
        }

        if ( response.test === 3 ) {
            if ( counters[ response.test ] === undefined ) {
                counters[ response.test ] = 0;
            }

            equal(
                payload.actual, payload.expected,
                "'" + payload.actual + "' used for '" + response.url + "'"
            );

            if ( ++counters[ response.test ] === 2 ) {
                complete();
            }
        }

        if ( response.test === 4 ) {
            equal(
                payload.actual, true,
                "Missing data and url throws TypeError"
            );
            complete();
        }

        if ( response.test === 5 ) {
            equal(
                payload.actual, true,
                "Supported targets: empty, Node, jQuery"
            );
            complete();
        }

    },

    error: function( response, complete ) {

    },

    event: function( response, complete ) {
        // Event related tests here
        //
        //  - Currently there is no restriction on the number of
        //    events that are tested. (Intentional variant)
        //
        var payload, type, which;

        // All test payload data
        payload = response.payload;
        // Which type of event was this?
        type = Test.event.domain( payload.event );
        //
        which = response.which;

        //test( payload.event + " delivers a relevant data object", 2, function() {
        //     var result, shape, keys;

        //     result = true;

        //     if ( payload.data === null ) {
        //         result = false;
        //     }

        //     ok( result, payload.event + " has data object" );

        //     // Relevant object shape expectations.
        //     shape = Test.shapes[ type ];
        //     keys = Object.keys( shape );

        //     // Ensure that every expected shape key is present
        //     if ( keys.length ) {
        //         result = keys.every(function( key ) {
        //             return key in shape;
        //         });
        //     } else {
        //         result = false;
        //     }
        //     // TODO: Issues...
        //     //
        //     //  - This is not solid, Need to ensure all Test.shapes are accounted for.
        //     //
        //     ok( result, payload.event + "'s data object meets the expected shape criteria" );


        //     complete();
        // //});

        /*
        TODO:

        - Layer events deliver a layer object
        - Frame events deliver a frame object
        - Data events deliver a data object (currently not the case)
        - Sequence events deliver a sequence object
        */
    }
};


module("Player");

// 1
asyncTest( "Player is initialized with data or url", function() {
    expect( 2 );

    Register({
        params: {
            test: 1
        },
        complete: function() {
            start();
        }
    });
});

// 2
asyncTest( "Fetch data from the |url| attribute if |data| is not defined", function() {
    expect( 1 );

    Register({
        params: {
            test: 2
        },
        complete: function() {
            start();
        }
    });
});

// 3
asyncTest( "Detect which parser to use based on its structure", function() {
    expect( 2 );

    [
        {
            parser: "zeega-project",
            url: "example-data.json"
        },
        {
            parser: "flickr",
            url: "http://api.flickr.com/services/feeds/photos_public.gne?tags=puppies&format=json&jsoncallback=?"
        }
    ].forEach(function( data, k ) {

        Register({
            params: {
                test: 3,
                parser: data.parser,
                url: data.url
            },
            complete: function() {
                start();
            }
        });
    });
});

// 4
asyncTest( "Player throws when no data is provided (data or url)", function() {
    expect( 1 );
    Register({
        params: {
            test: 4
        },
        complete: function() {
            start();
        }
    });
});


// 5
asyncTest( "Player target: blank target defaults to body", function() {
    expect( 1 );
    Register({
        params: {
            test: 5
        },
        complete: function() {
            start();
        }
    });

});



module("Zeega.Backbone")

test( "Zeega.Backbone.Model.prototype.put (|set| curried w/ silent: true option)", 3, function() {
    var Foo, foo;

    Foo = Zeega.Backbone.Model.extend({});

    ok( Zeega.Backbone.Model.prototype.put, "|put| exists" );
    equal( typeof Zeega.Backbone.Model.prototype.put, "function", "|put| is a function" );

    foo = new Foo();

    // "change" event trap:
    // If this is triggered, then |put| is not actually silent.
    // The unexpected assertion will cause the unit to fail.
    foo.on("change", function() {
        ok( false, "change event should not be fired for |put|" );
    });

    foo.put("a", "alpha");

    equal( foo.get("a"), "alpha", "|put| correctly delegates to |set|" );
});

/*

* the valid data is then parsed again by the player into `sequences`, `frames` (fames contain `layers`)

  * this process does a lot of precalculation about how the project can be navigated by determining adjacent frames (through position in the containing sequence, or by user defined links) and adjusting when to move layers on/off of the stage in the case of persistent layers (layers that exist over multiple frames). This data is then baked into the sequence, frame, & layer models.

  * every model is preloaded with a`status` object to allow access to info on the current status of the player and to allow player events to be triggered from anywhere via emit()

  * every model is preloaded with a `relay` object which the player is listening for changes to `current_frame` which triggers _remote_cueFrame() in the player.

 */







// module("Events");
