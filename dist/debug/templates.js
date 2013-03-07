this["JST"] = this["JST"] || {};

this["JST"]["app/templates/controls/arrows.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="ZEEGA-prev controls-arrow arrow-left disabled"></a>\r\n<a href="#" class="ZEEGA-next controls-arrow arrow-right disabled"></a>';
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

this["JST"]["app/templates/plugins/audio.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
}
return __p;
};

this["JST"]["app/templates/plugins/geo.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
}
return __p;
};

this["JST"]["app/templates/plugins/image.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<img src="'+
( attr.uri )+
'" width=\'100%\' />';
}
return __p;
};

this["JST"]["app/templates/plugins/link.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href=\'#\' class=\'ZEEGA-link-inner\'></a>';
}
return __p;
};

this["JST"]["app/templates/plugins/popup-image.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'ZEEGA-popup-click-content popup-image\' style="\r\n  background: url('+
( attr.popup_content.uri )+
') no-repeat center center;\r\n  -webkit-background-size: contain;\r\n  -moz-background-size: contain;\r\n  -o-background-size: contain;\r\n  background-size: contain;\r\n">\r\n  <a href="#" class="popup-close">close</a>\r\n</div>\r\n';
}
return __p;
};

this["JST"]["app/templates/plugins/popup-video.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'ZEEGA-popup-click-content popup-video\' >\r\n  <a href="#" class="popup-close">close</a>\r\n</div>\r\n';
}
return __p;
};

this["JST"]["app/templates/plugins/popup.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a\r\n  href="#"\r\n  class="ZEEGA-popup-click-target"\r\n  ';
 if ( attr.popup_target ) { 
;__p+='\r\n  style="\r\n    background: url('+
( attr.popup_target.uri )+
') no-repeat center center;\r\n    -webkit-background-size: cover;\r\n    -moz-background-size: cover;\r\n    -o-background-size: cover;\r\n    background-size: cover;\r\n  "\r\n  ';
 } 
;__p+='\r\n  data-caption="';
 if ( attr.popup_content ) { 
;__p+=''+
( attr.popup_content.title )+
'';
 } 
;__p+='"\r\n  >\r\n  ';
 if ( attr.popup_content ) { 
;__p+='<span class="popup-title" style=\'display:none\'>'+
( attr.popup_content.title )+
'</span>';
 } 
;__p+='\r\n</a>';
}
return __p;
};

this["JST"]["app/templates/plugins/rectangle.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
}
return __p;
};

this["JST"]["app/templates/plugins/slideshow-metadata.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'slide-title\'>'+
( title )+
'</div>\r\n<div class=\'slide-description\'>'+
( description )+
'</div>\r\n<a href="'+
( attribution_uri )+
'" target=\'blank\' class=\'attribution-link\'>\r\n    '+
( media_creator_username )+
'\r\n    <i class=\'slideshow-icon-'+
( archive.toLowerCase() )+
' ssarchive\'></i>\r\n</a>\r\n';
}
return __p;
};

this["JST"]["app/templates/plugins/slideshow.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href=\'#\' class=\'slideshow-arrow arrow-left slideshow-control-prev disabled\'></a>\r\n<a href=\'#\' class=\'slideshow-arrow arrow-right slideshow-control-next\'></a>\r\n\r\n<div class=\'slideshow-container\'>\r\n\t';
 _.each( attr.slides, function(slide,i){ 
;__p+='\r\n\t\t<div class=\'slideshow-slide slideshow-slide-'+
( i )+
'\' style=\'\r\n      background:url('+
( slide.attr.uri )+
') no-repeat center center;\r\n      -webkit-background-size: ';
 if( slides_bleed ) { 
;__p+='cover';
 } else { 
;__p+='contain';
 } 
;__p+=';\r\n      -moz-background-size: ';
 if( slides_bleed ) { 
;__p+='cover';
 } else { 
;__p+='contain';
 } 
;__p+=';\r\n      -o-background-size: ';
 if( slides_bleed ) { 
;__p+='cover';
 } else { 
;__p+='contain';
 } 
;__p+=';\r\n      background-size: ';
 if( slides_bleed ) { 
;__p+='cover';
 } else { 
;__p+='contain';
 } 
;__p+=';\r\n    \'></div>\r\n\t';
 }) 
;__p+='\r\n</div>';
}
return __p;
};

this["JST"]["app/templates/plugins/slideshowthumbslider.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'slideshow-thumb-wrapper\'>\r\n    <ul>\r\n        ';
 _.each(attr.slides, function(slide, i){ 
;__p+='\r\n            <li>\r\n                <div class=\'slideshow-thumbnail\' style="background:url('+
( slide.attr.thumbnail_url )+
'); background-repeat:no-repeat;background-size:100%;background-position:center">\r\n                    <a href=\'#\' class=\'slider-thumb\' data-slidenum="'+
( i )+
'"></a>\r\n                </div>\r\n            </li>\r\n        ';
 });
;__p+='\r\n    </ul>\r\n</div>';
}
return __p;
};

this["JST"]["app/templates/plugins/text-link.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="http://'+
( attr.link )+
'" data-bypass="true" target="blank">\r\n    '+
( attr.content )+
'\r\n</a>';
}
return __p;
};

this["JST"]["app/templates/plugins/text.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+=''+
( attr.content )+
'';
}
return __p;
};

this["JST"]["app/templates/plugins/video.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
}
return __p;
};