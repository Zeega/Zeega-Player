define([
    "zeega",
    "zeega_parser/parser"

],
function( Zeega, ZeegaParser ) {


    return function( attributes ) {
        var parseThis, parsed;

        parseThis = function( response ) {
            return new ZeegaParser.parse( response, attributes );
        };

        if ( attributes.url ) {
            var rawDataModel = new Zeega.Backbone.Model();

            rawDataModel.url = attributes.url;
            rawDataModel.fetch().success(function( response ) {
                parsed = parseThis( response );
                if ( attributes.callback ) {
                    attributes.callback( parsed, response );
                }
                return parsed;

            }.bind( this )).error(function() {
                throw new Error("Ajax load fail");
            });
        } else if ( attributes.data ) {
            parsed = parseThis( attributes.data );

            if ( attributes.callback ) {
                attributes.callback( parsed, response );
            }

            return data;
        } else {
            throw new TypeError("`url` expected non null");
        }
    };

});
