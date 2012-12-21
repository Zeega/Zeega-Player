/*

parser manifest file

this should be auto generated probably!!

*/

define([
    "zeega_dir/parsers/zeega-project",
    "zeega_dir/parsers/zeega-project-published",
    "zeega_dir/parsers/zeega-collection",
    "zeega_dir/parsers/zeega-dynamic-collection",
    "zeega_dir/parsers/flickr",
    "zeega_dir/parsers/youtube"
],
function(
    zProject,
    zProjectPublished,
    zCollection,
    zDynamicCollection,
    flickr,
    youtube
) {
    // extend the plugin object with all the layers
    var Parsers = {};

    return _.extend(
        Parsers,
        zProject,
        zProjectPublished,
        zCollection,
        zDynamicCollection,
        flickr,
        youtube
    );
});
