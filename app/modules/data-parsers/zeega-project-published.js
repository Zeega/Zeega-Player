define(["lodash"],

function() {
    var type = "zeega-project-published",
        Parser = {};

    Parser[ type ] = { name: type };

    Parser[ type ].validate = function( response ) {

        if ( response.items && response.items[0].media_type == "project"&& response.items.length==1) {
            return true;
        }
        return false;
    };

    // no op. projects are already formatted
    Parser[type].parse = function( response, opts ) {
        return response.items[0].text;
    };

    return Parser;
});
