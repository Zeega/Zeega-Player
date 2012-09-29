define([ "zeega" ],

function(Zeega)
{

	var Helpers = Zeega.module();

	Helpers.getHost = function()
	{
			return  window.location.protocol + "//" + window.location.host;        
	};

	Helpers.getBaseURL = function()
	{
		var currPath = window.location.pathname.split("/");        
		var splitIdx = currPath.indexOf("/web/");        
		var urlPath = window.location.pathname.substring(0,splitIdx+4);
		return urlPath;
	};

	Helpers.convertTime = function(seconds)
	{
		var m=Math.floor(seconds/60);
		var s=Math.floor(seconds%60);
		if(s<10) s="0"+s;
		return m+":"+s;
	};

	Helpers.convertTime = function(seconds)
	{
		var m=Math.floor(seconds/60);
		var s=Math.floor(seconds%60);
		if(s<10) s="0"+s;
		return m+":"+s;
	};

	Helpers.deconvertTime = function(minutes,seconds)
	{
		return 60 * minutes + parseInt( seconds , 10);
	};

	Helpers.getMinutes = function(seconds)
	{
		return Math.floor( parseInt( seconds , 10 ) / 60.0 );
	};

	Helpers.getSeconds = function(seconds)
	{
		var s=Math.floor((seconds%60)*10)/10.0;
		if(s<10) s="0"+s;
		return s;
	};

	Helpers.isInt = function(x)
	{
		var y = parseInt(x,10);
		if (isNaN(y)) return false;
		return x==y && x.toString()==y.toString();
	};

	Helpers.isPercent = function(x)
	{
		return isInt(x) && parseInt(x,10) <= 100;
	};

	Helpers.rgbToHex = function(R,G,B)
	{
		return toHex(R)+toHex(G)+toHex(B);
	};

	Helpers.toHex = function(n)
	{
		n = parseInt(n,10);
		if (isNaN(n)) return "00";
		n = Math.max(0,Math.min(n,255));
		return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
	};

	// make capital case
	String.prototype.toCapitalCase = function()
	{
		return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
	};

	String.prototype.toRGB = function()
	{
		var cutHex = function(h){ return (h.charAt(0)=="#") ? h.substring(1,7) : h ;};
		var rgb = '';
		rgb += parseInt( ( cutHex(this) ).substring( 0,2 ) , 16 ) +',';
		rgb += parseInt( ( cutHex(this) ).substring( 2,4 ) , 16 ) +',';
		rgb += parseInt( ( cutHex(this) ).substring( 4,6 ) , 16 );
		return rgb;
	};

	// Required, return the module for AMD compliance
	return Helpers;

});


// what is this?

/**  LAYER GLOBAL EVENT LISTENERS  **/

// var LayerGlobals = new Array();

// function addGlobal(layerId,event,elementId)
// {
//		if(!LayerGlobals[layerId])LayerGlobals[layerId]={};
//		
eval('LayerGlobals[layerId].'+event+'= function(data){$("#'+elementId+'").trigger("'+event+'",data);}');
// }