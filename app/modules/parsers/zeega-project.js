// parsers.zeega_project

define(["lodash"],

function()
{
	var type = 'zeega-project'
	var Parser = {};
	Parser[type] = {};

	Parser[type].parse = function( res, opts )
	{
		// no op
		return res;
	};

	Parser[type].validate = function( res )
	{
		if( res.sequences && res.frames && res.layers ) return true;
		return false;
	};

	return Parser;
});