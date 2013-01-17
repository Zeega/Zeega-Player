define([
    "lodash"
],
function() {
    var type = "zeega-project-collection",
        Parser = {};

    Parser[ type ] = { name: type };

    Parser[ type ].validate = function( response ) {
        if ( response.items && response.items.length>1 ) {
            _.each(response.items,function(item){
                if(item.media_type!="project"){
                    return false;
                }
            });
            return true;
        }
        return false;
    };

    Parser[ type ].parse = function( response, opts ) {
        
        

        var project = {

            title : response.request.tags,
            sequences : [],
            frames : [],
            layers : []
        };

        _.each(response.items, function(item){
            project.layers = _.union(project.layers,item.text.layers);
            project.frames = _.union(project.frames,item.text.frames);
            if(project.sequences.length>0){
                console.log(item);
                project.sequences[project.sequences.length-1].advance_to=item.text.sequences[0].id;
            }
            project.sequences = _.union(project.sequences,item.text.sequences);

        });

        console.log("PROJECT",project);
        return project;
    };



    return Parser;
});
