var params = Params.from( window.location.search );

$(document).on("ready", function() {
    console.log( "FIXTURE READY", params.test );
});
$(window).bind("zeega_ready", function() {

    var player, a, b, warn, response, payload, sources;


    console.log( "FIXTURE LOADED", params.test );

    // Each numbered block corresponds to a test unit

    // 1
    if ( params.test === 1 ) {
        payload = {};

        // Initialize a player w/o args
        a = new Zeega.player({
            url: "example-data.json"
          }, {
            divId: 'player',
            next : '.next',
            prev : '.prev'
          });

        b = new Zeega.player({
            url: "example-data.json"
          }, {
            divId: 'player',
            next : '.next',
            prev : '.prev'
          });


        // Since |b| must load data before it can be analyzed,
        // commit to reporting the results only after |b| has
        // fired its can_play event
        b.on( "can_play", function( type ) {
            Test.report( params, {
                type: "player",
                payload: {
                    attributes: [
                        {
                            player: "a",
                            attributes: a.attributes
                        },
                        {
                            player: "b",
                            attributes: b.attributes
                        }
                    ]
                }
            });
        });
    }

    // 2
    if ( params.test === 2 ) {

        // Initialize a player w/ args
        player = new Zeega.player({
            window_fit: true,
            autoplay: true,
            divId: "player",
            next: ".next",
            prev: ".prev",
            url: "example-data.json"
        });

        // Since |player| must load data before it can be analyzed,
        // commit to reporting the results only after |player| has
        // fired its data_loaded event
         player.on( "data_loaded", function( type ) {
            Test.report( params, {
                type: "player",
                payload: {
                    attributes: [ player.data.attributes ]
                }
            });
        });
    }

    // 3
    if ( params.test === 3 ) {
        payload = {};

        player = new Zeega.player({
            window_fit: true,
            autoplay: true,
            divId: "player",
            next: ".next",
            prev: ".prev",
            url: params.url
        });

        player.on( "data_loaded", function() {
            Test.report( params, {
                type: "player",
                payload: {
                    actual: player.parser,
                    expected: params.parser
                }
            });
        });
    }

    // 4
    if ( params.test === 4 ) {

        // Initialize a player w/ args: MISSING data and url
        try {
            player = new Zeega.player({
                window_fit: true,
                autoplay: true,
                divId: "player",
                next: ".next",
                prev: ".prev"
            });
            // This SHOULD NEVER be reached
            Test.report( params, {
                type: "player",
                payload: {
                    actual: false
                }
            });
        } catch ( e ) {
            Test.report( params, {
                type: "player",
                payload: {
                    actual: true
                }
            });
        }
    }

});
