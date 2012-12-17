function eventDomain( type ) {
    return Object.keys( eventDomain.rules ).reduce(function( initial, rule ) {
        var pattern = eventDomain.rules[ rule ];

        return pattern.test( type ) ? rule : initial;
    }, "");
}

eventDomain.rules = {
    layer: /^layer_/,
    frame: /^frame_/,
    data: /^data_/,
    sequence: /^sequence_/,
    player: /^(ready|play|can_)/
};


eventDomain.domains = {
    frame: [ "frame_ready", "frame_rendered" ],
    layer: [ "layer_loading", "layer_ready" ],
    player: [ "can_play", "play", "ready" ],
    data: [ "data_loaded" ],
    sequence: [ "sequence_enter" ]
};


// Provide sane set of rules for Event data objects to validate
// them as relevant to the event that was emitted.
//
// TODO: Make the values represent values that we'd expect to see
//        on the actual object that we're analyzing.
//
eventDomain.shapes = {
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
    data: {

    },
    sequence: {
        attr: Array,
        frames: Array,
        id: Number,
        persistent_layers: Array,
        title: String
    },
    player: {

    }
};


var player = {};


player.shape = {
    autoplay: Boolean,
    collection_mode: String,
    delay: Number,
    div_id: String,
    fadeIn: Number,
    fadeOut: Number,
    fade_overlays: Boolean,
    fullscreenEnable: Boolean,
    keyboard: Boolean,
    mode: String,
    next: String,
    preload_ahead: Number,
    prev: String,
    start_frame: Number,
    start_slide: Number,
    start_slide_id: Number,
    url: String,
    window_fit: Boolean,
    window_ratio: Number
};
