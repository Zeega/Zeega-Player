var params = Params.from( window.location.search );

$(document).on("ready", function() {
    console.log( "FIXTURE READY", params.test );
});
$(window).bind("zeega_ready", function() {

    var player, a, b, warn, response, payload, sources;


    console.log( "FIXTURE LOADED", params.test );

    // Each numbered block corresponds to a test unit

    // 0) Player is initialized with player arguments passed in (or not)
    if ( params.test === 0 ) {
        payload = {};

        // Initialize a player w/o args
        a = new Zeega.player();

        // Initialize a player w/ args
        b = new Zeega.player({ window_fit: true });

        // Provide loading instructions
        b.load({
            autoplay: true,
            div_id: "player",
            next: ".next",
            prev: ".prev",
            url: "example-data.json"
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

    // 1) Fetch data from the |url| attribute if |data| is not defined
    if ( params.test === 1 ) {

        /*
            BUG:
            Making the assumption that we can fetch a |url| if |data| is
            not defined doesn't address the case where both are missing
         */

        // Initialize a player w/ args
        player = new Zeega.player({ window_fit: true });
        // Provide loading instructions
        player.load({
            autoplay: true,
            div_id: "player",
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
                    attributes: player.attributes
                }
            });
        });
    }

    // 2) Detect which parser to use based on it's structure
    if ( params.test === 2 || params.test === 3 ) {
        payload = {};

        player = new Zeega.player({ window_fit: true });

        player.load({
            autoplay: true,
            div_id: "player",
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

});
