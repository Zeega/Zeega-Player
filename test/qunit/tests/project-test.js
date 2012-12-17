var fixtures, handlers;


fixtures = [
    {
        id: "fx-00",
        node: null,
        src: "fixtures/index.html"
    }
];


// Each test subject will have a handler registered here.
//
//  - Handlers may be reused for several tests of the
//    same subject type. ie. Event tests
//
handlers = {

    project: function( payload ) {
        var keys;

        // write Project related tests here
        //

        console.log( payload );

        // compare with
        player.shape

    },

    event: function( payload ) {
        // Event related tests here
        //
        //  - Currently there is no restriction on the number of
        //    events that are tested.
        //
        var type = eventDomain( payload.event );

        test( payload.event + " delivers a relevant data object", 2, function() {
            var result, shape, keys;

            result = true;

            if ( payload.data === null ) {
                result = false;
            }

            ok( result, payload.event + " has data object" );

            // Relevant object shape expectations.
            shape = eventDomain.shapes[ type ];
            keys = Object.keys( shape );

            // Ensure that every expected shape key is present
            if ( keys.length ) {
                result = keys.every(function( key ) {
                    return key in shape;
                });
            } else {
                result = false;
            }
            // TODO: Issues...
            //
            //  - This is not solid, Need to ensure all eventDomain.shapes are accounted for.
            //
            ok( result, payload.event + "'s data object meets the expected shape criteria" );

        });

        /*
        TODO:

        - Layer events deliver a layer object
        - Frame events deliver a frame object
        - Data events deliver a data object (currently not the case)
        - Sequence events deliver a sequence object
        */
    }
};



// Two Step Test Reporting!
//
// 1. Assign window message handler
//
window.onmessage = function( event ) {
    var response = JSON.parse( event.data );

    if ( handlers[ response.type ] ) {
        handlers[ response.type ]( response.payload );
    } else {
        console.warn( "Unhandled Response: ", response );
    }
};

//
// 2. Force all fixtures to be reloaded
//
fixtures.forEach(function( fixture, k ) {
    fixture.node = document.getElementById( fixture.id );

    // Trigger fixture loading
    fixture.node.src = fixture.src;
});
