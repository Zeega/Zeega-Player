function report( message ) {
  try {
    top.postMessage( JSON.stringify(message) , "*");
  } catch ( e ) {
    console.log( e.message );
  }
}

$(window).bind("zeega_ready", function() {

    var project = new Zeega.player({ window_fit: true });

    /*
    // uncomment this line to see available zeega events as they fire
    project.on("all", function(e, obj){ if(e!="media_timeupdate") console.log("1: e:",e,obj);});
    */
    project.load({
        autoplay: true,
        div_id: "player",
        next: ".next",
        prev: ".prev",
        url: "example-data.json",
    });

    report({
        type: "project",
        payload: {
            attributes: project.attributes
        }
    });

    // debugger;
    project.on( "all", function( event, data ) {

        // if ( events.indexOf( event ) === -1 ) {
        //   window.events.push( event );
        // }


        // TODO: Ensure that all events have the second data param
        // Currently missing from events:
        // 1. data_loaded
        // 2. ready
        // 3. play
        // 4. can_play
        //
        console.log( event, data );


        report({
            type: "event",
            payload: {
                event: event,
                data: data ? data : null
                // (data.attributes ? data.attributes : null) : null
            }
        });
    });

    console.dir( "project", project );
});
