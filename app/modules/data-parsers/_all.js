/*

parser manifest file

this should be auto generated probably!!

*/

define([
    "zeega_dir/data-parsers/zeega-project",
    "zeega_dir/data-parsers/zeega-project-published",
    "zeega_dir/data-parsers/zeega-project-collection",
    "zeega_dir/data-parsers/zeega-collection",
    "zeega_dir/data-parsers/flickr",
    "zeega_dir/data-parsers/youtube"
],
function(
    zProject,
    zProjectPublished,
    zProjectCollection,
    zCollection,
    flickr,
    youtube
) {
    // extend the plugin object with all the layers
    var Parsers = {};

    return _.extend(
        Parsers,
        zProject,
        zProjectPublished,
        zProjectCollection,
        zCollection,
        flickr,
        youtube
    );
});
