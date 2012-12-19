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


        if ( response.test === 0 ) {

            /*
                QUESTION:
                Why are instance construction and load separated
                into different tasks?

                var player = new Zeega.Player();
                player.load(...)?
            */

            /*
                PROBLEM/BUG:

                Validating instance shape is impossible until all player
                instances have the SAME properties, whether or not they
                are defined or left null/empty.

                * Seems to be related to the question under
                  "response.test === 1"
            */

            /*
                FAIL:

                Without having a definitive "player-type", there is no way to
                verify whether or not it was constructed correctly.
             */
            shape = Object.keys( Test.shapes.player ).sort();

            payload.attributes.forEach(function( result, k ) {
                var compare = Object.keys( result.attributes ).sort();

                deepEqual(
                    compare, shape, "'" + result.player + "' has expected attribute shape"
                );
            });

            complete();
        }

        if ( response.test === 1 ) {
            /*
                QUESTION/BUG:

                Why is loaded |data| being assigned directly to |player| instances?

                A loaded |data| object should create it's own instance of an internal
                (or external facing) Data constructor that is then assigned to a
                specific own property of the |player| instance for which it was loaded.

                Not doing this has created a number of problems that will only get
                worse over time as Player continues to be developed, its own instance
                property list will be forever in fear of overwriting by loaded data properties.

            */

            /*
                FAIL:

                Ideally this would compare our known example-data.json
                with whatever the Zeega.Player has loaded, but that's
                basically impossible since all the loaded data properties
                are just dumped, wholesale, into the player instance.
            */
            jQuery.ajax({
                url: "fixtures/example-data.json",
                type: "get",
                success: function( data ) {
                    var shape = Object.keys( data );

                    // See "FAIL" above.
                    ok( false, "There is no way to verify data integrity" );

                    complete();
                }
            });
        }

        if ( response.test === 2 ) {

            if ( counters[ 2 ] === undefined ) {
                counters[ 2 ] = 0;
            }

            equal(
                payload.actual, payload.expected,
                "'" + payload.actual + "' used for '" + response.url + "'"
            );

            if ( ++counters[ 2 ] === 3 ) {
                console.log( "test 2 is complete" );
                complete();
            }
        }

        if ( response.test === 3 ) {
            console.log( response.test, payload );
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

asyncTest( "Player is initialized with player arguments passed in (or not)", function() {
    expect( 2 );

    Register({
        params: {
            test: 0
        },
        complete: function() {
            start();
        }
    });
});

asyncTest( "Fetch data from the |url| attribute if |data| is not defined", function() {
    expect( 1 );

    Register({
        params: {
            test: 1
        },
        complete: function() {
            start();
        }
    });
});

/*

TODO:

Make individual Parser tests

*/
asyncTest( "Detect which parser to use based on its structure", function() {
    expect( 3 );

    [
        {
            parser: "zeega-project",
            url: "example-data.json"
        },
        {
            parser: "flickr",
            url: "http://api.flickr.com/services/feeds/photos_public.gne?tags=puppies&format=json&jsoncallback=?"
        },
        {
            parser: "youtube",
            url: "http://gdata.youtube.com/feeds/api/playlists/PL70DDAC628461F8E9?v=2&alt=json"
        }
    ].forEach(function( data, k ) {
        Register({
            params: {
                test: 2,
                parser: data.parser,
                url: data.url
            },
            complete: function() {
                start();
            }
        });
    });
});

/*
asyncTest( "Matching parser returns valid Zeega data back to the player", function() {
    expect( 3 );




    Register({
        params: {
            test: 3
        },
        complete: function() {
            start();
        }
    });
});
*/
/*

* the valid data is then parsed again by the player into `sequences`, `frames` (fames contain `layers`)

  * this process does a lot of precalculation about how the project can be navigated by determining adjacent frames (through position in the containing sequence, or by user defined links) and adjusting when to move layers on/off of the stage in the case of persistent layers (layers that exist over multiple frames). This data is then baked into the sequence, frame, & layer models.

  * every model is preloaded with a`status` object to allow access to info on the current status of the player and to allow player events to be triggered from anywhere via emit()

  * every model is preloaded with a `relay` object which the player is listening for changes to `current_frame` which triggers _remote_cueFrame() in the player.

 */







// module("Events");