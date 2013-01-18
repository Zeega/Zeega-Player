define([
    "lodash"
],
function() {
    var type = "zeega-project-collection",
        Parser = {};

    Parser[ type ] = { name: type };

    Parser[ type ].validate = function( response ) {
        if ( response.items && response.items.length > 1 ) {
            var mediaTypes = _.pluck( response.items, "media_type" );
                nonProjects = _.without( mediaTypes, "project");

            if ( nonProjects.length === 0 ) {
                return true;
            }
        }
        return false;
    };

    Parser[ type ].parse = function( response, opts ) {
        var project = {
            title: response.request.query.tags,
            sequences: [],
            frames: [],
            layers: []
        };
        
        _.each( response.items, function( item ) {
            if ( item.text !== "" ) {
                project.layers = _.union( project.layers, item.text.layers );
                project.frames = _.union( project.frames, item.text.frames );
                if ( project.sequences.length > 0 ) {
                    project.sequences[ project.sequences.length - 1 ].advance_to = item.text.sequences[0].id;
                }
                project.sequences = _.union( project.sequences, item.text.sequences );
            }
        });

        return project;
    };



    return Parser;
});
