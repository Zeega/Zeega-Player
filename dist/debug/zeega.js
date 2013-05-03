/*

copyright 2012

ZEEGA LICENSE INFO HERE

*/
this["JST"] = this["JST"] || {};

this["JST"]["app/templates/controls/arrows.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="ZEEGA-prev controls-arrow arrow-left disabled"></a>\n<a href="#" class="ZEEGA-next controls-arrow arrow-right disabled"></a>';
}
return __p;
};

this["JST"]["app/templates/controls/close.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="ZEEGA-close">&times;</a>';
}
return __p;
};

this["JST"]["app/templates/controls/playpause.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="ZEEGA-playpause pause-zcon"></a>';
}
return __p;
};

this["JST"]["app/templates/layouts/player-layout.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'ZEEGA-player-window\'></div>';
}
return __p;
};

this["JST"]["app/zeega-parser/plugins/layers/audio/audio-flash.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div id="audio-flash-'+
( id )+
'" data-src="'+
( attr.uri )+
'"  data-cue="'+
( attr.cue_in )+
'"  >\n    <div id="flash-'+
( id )+
'" %>" > \n    </div>\n</div>';
}
return __p;
};

this["JST"]["app/zeega-parser/plugins/layers/audio/audio.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<audio id="audio-el-'+
( id )+
'" src="'+
( attr.uri )+
'"\n    ';
 if ( attr.loop ) { 
;__p+='\n        loop\n    ';
 } 
;__p+='\n    preload\n></audio>';
}
return __p;
};

this["JST"]["app/zeega-parser/plugins/layers/image/image.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="visual-target">\n    <img src="'+
( attr.uri )+
'" width=\'100%\' />\n</div>\n<div class="controls-inline"></div>';
}
return __p;
};

this["JST"]["app/zeega-parser/plugins/layers/link/frame-chooser.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="modal-close">&times;</a>\n<div class="modal-content">\n    <div class="modal-title">Where do you want your link to go?</div>\n    <div class="modal-body">\n        <a href="#" class="link-new-page"><i class="icon-plus icon-white"></i></br>New Page</a>\n        <div class="divider">or</div>\n        <ul class="page-chooser-list clearfix"></ul>\n        <div class="bottom-chooser">\n            <a href="#" class="submit btnz btnz-submit btnz-inactive">OK</a>\n        </div>\n    </div>\n</div>\n';
}
return __p;
};

this["JST"]["app/zeega-parser/plugins/layers/link/link.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div href=\'#\' class=\'ZEEGA-link-inner\'></div>';
}
return __p;
};

this["JST"]["app/zeega-parser/plugins/layers/rectangle/rectangle.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="visual-target"></div>\n<div class="controls-inline"></div>';
}
return __p;
};

this["JST"]["app/zeega-parser/plugins/layers/text/text.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="visual-target">'+
( attr.content )+
'</div>\n<div class="controls-inline"></div>';
}
return __p;
};

this["JST"]["app/zeega-parser/plugins/layers/text_v2/text-v2.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="visual-target">'+
( attr.content )+
'</div>\n<div class="controls-inline"></div>';
}
return __p;
};

this["JST"]["app/zeega-parser/plugins/layers/text_v2/textmodal.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="modal-content">\n    <div class="modal-title">Edit your text</div>\n    <div class="modal-body">\n\n        <textarea rows="4" cols="59" maxlength="140">'+
( attr.content )+
'</textarea>\n\n        <div class="textarea-info">max 140 characters</div>\n\n        <div class="text-controls clearfix">\n            <div class="color-selector">\n                <input class="simple-color" value="'+
( attr.color )+
'"/>\n            </div>\n            <a href="#" class="btnz btnz-light text-btn-bold"><i class="icon-bold"></i></a>\n            <a href="#" class="btnz btnz-light text-btn-italic"><i class="icon-italic"></i></a>\n            <a href="#" class="btnz btnz-light text-btn-align-left"><i class="icon-align-left"></i></a>\n            <a href="#" class="btnz btnz-light text-btn-align-center"><i class="icon-align-center"></i></a>\n            <a href="#" class="btnz btnz-light text-btn-align-right"><i class="icon-align-right"></i></a>\n\n            <select class="font-list" style=""></select>\n\n            <div class="control-module">\n                <div class="control-title">font size</div>\n                <select class="size-list" style="">\n                    <option value="100">8</option>\n                    <option value="125">10</option>\n                    <option value="150">12</option>\n                    <option value="175">14</option>\n                    <option value="200">18</option>\n                    <option value="250">24</option>\n                    <option value="375">36</option>\n                    <option value="500">48</option>\n                    <option value="800">72</option>\n                    <option value="1600">144</option>\n                    <option value="2400">200</option>\n                    <option value="3600">300</option>\n                </select>\n            </div>\n\n            <div class="control-module">\n                <div class="control-title">line height</div>\n                <select class="line-height-list">\n                    <option value="1">1</option>\n                    <option value="1.25">1.25</option>\n                    <option value="1.5">1.5</option>\n                    <option value="1.75">1.75</option>\n                    <option value="2">2</option>\n                </select>\n            </div>\n\n            <div class="control-module">\n                <div class="control-title">mobile position</div>\n                <select class="text-position-list">\n                    <option value="top">top</option>\n                    <option value="middle">middle</option>\n                    <option value="bottom">bottom</option>\n                </select>\n            </div>\n            \n        </div>\n\n        <div class="sample-header">sample</div>\n        <div class="text-sample">'+
( attr.content )+
'</div>\n\n        <div class="bottom-chooser clearfix">\n            <a href="#" class="submit btnz btnz-submit">OK</a>\n        </div>\n    </div>\n</div>\n';
}
return __p;
};

this["JST"]["app/zeega-parser/plugins/layers/youtube/youtube.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div   class="youtube-player"  class="visual-target">\n    \n\n    <iframe id="yt-player-'+
( id )+
'" type="text/html" width="100%" height="100%"\n        src="http://www.youtube.com/embed/'+
( attr.uri )+
'?enablejsapi=1&iv_load_policy=3&showinfo=0';
 if ( !/iPad/i.test(navigator.userAgent) ) { 
;__p+='&controls=0';
 } 
;__p+='&modestbranding=1&disablekb=1&rel=0&wmode=opaque"\n        frameborder="0">\n    </iframe>\n</div>\n<div class="play-button"></div>\n<div class="ipad-cover"> pause video to return to Zeega </div>\n<div class="controls-inline"></div>\n\n';
}
return __p;
};