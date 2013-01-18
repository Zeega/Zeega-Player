define(["lodash"],

function() {
    var type = "zeega-project",
        Parser = {};

    Parser[ type ] = { name: type };

    Parser[ type ].validate = function( response ) {

        if ( response.sequences && response.frames && response.layers ) {
            return true;
        }
        return false;
    };

    // no op. projects are already formatted
    Parser[type].parse = function( response, opts ) {
        return response;
    };

    return Parser;
});
