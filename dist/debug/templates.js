this["JST"] = this["JST"] || {};

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
__p+='<a href=\'#\' class=\'ZEEGA-link-inner\'>\n  ';
 if( mode == 'editor' && !_.isNull( attr.to_frame ) ) { 
;__p+='\n    <i class="icon-share go-to-sequence"></i>\n  ';
 } 
;__p+='\n</a>';
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

this["JST"]["app/templates/plugins/slideshow.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href=\'#\' class=\'slideshow-arrow arrow-left slideshow-control-prev disabled\'></a>\n<a href=\'#\' class=\'slideshow-arrow arrow-right slideshow-control-next\'></a>\n\n<div class=\'slideshow-container\' style=\'width:'+
( (attr.slides.length *100) +'%' )+
'\'>\n\t';
 _.each( attr.slides, function(slide,i){ 
;__p+='\n\t\t<div class=\'slideshow-slide slideshow-slide-'+
( i )+
'\' style=\'width:'+
( (100 / attr.slides.length) +'%' )+
';background:url('+
( slide.attr.uri )+
') no-repeat center center;-webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;\'></div>\n\t';
 }) 
;__p+='\n</div>';
}
return __p;
};

this["JST"]["app/templates/plugins/slideshowthumbslider.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href=\'#\' class=\'arrow arrow-left slideshow-slider-control-prev\'></a>\n<a href=\'#\' class=\'arrow arrow-right slideshow-slider-control-next\'></a>\n\n<ul>\n\t';
 _.each(attr.slides, function(slide, i){ 
;__p+='\n\t\t<li>\n\t\t\t<div class=\'slideshow-thumbnail\' style="background:url('+
( slide.attr.uri )+
'); background-repeat:no-repeat;background-size:100%;background-position:center">\n\t\t\t\t<a href=\'#\' class=\'slider-thumb\' data-slidenum="'+
( i )+
'"></a>\n\t\t\t\t<div class=\'thumb-title\'>\n\t\t\t\t\t<a href="'+
( slide.attr.attribution_uri )+
'" target=\'blank\'>\n\t\t\t\t\t\t';
 if(slide.attr.media_creator_username.replace(/\s+/g, '') != ''){ 
;__p+=''+
( slide.attr.media_creator_username )+
'';
 }else{ 
;__p+='unknown';
 } 
;__p+='\n\t\t\t\t\t\t<i class=\'slideshow-icon-'+
( slide.attr.archive.toLowerCase() )+
' ssarchive\'></i>\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t</div>\t\t\t\n\t\t</li>\n\t';
 });
;__p+='\n</ul>';
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