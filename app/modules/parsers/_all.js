/*

parser manifest file

this should be auto generated probably!!

*/

define([
	'zeega_dir/parsers/zeega-project',
	'zeega_dir/parsers/zeega-collection',
	'zeega_dir/parsers/zeega-dynamic-collection'
],
	function(
		zProject,
		zCollection,
		zDynamicCollection
	)
	{
		var Parsers = {};
		_.extend( Parsers, zProject, zCollection, zDynamicCollection ); // extend the plugin object with all the layers
		return Parsers;
	}
);