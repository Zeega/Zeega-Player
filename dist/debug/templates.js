this['JST'] = this['JST'] || {};

this['JST']['app/templates/layouts/player-layout.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
 if( !chromeless ) { 
;__p+='\n\t<div class=\'ZEEGA-player-overlay\'></div>\n';
 } 
;__p+='\n<div class=\'ZEEGA-player-window\'></div>';
}
return __p;
};

this['JST']['app/templates/plugins/audio.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
}
return __p;
};

this['JST']['app/templates/plugins/image.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<img src="'+
( attr.uri )+
'" width=\'100%\' />';
}
return __p;
};

this['JST']['app/templates/plugins/link.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href=\'#\' style=\'position:absolute;width:100%;height:100%\'>\n\t';
 if( mode == 'editor' && !_.isNull( attr.to_frame ) ) { 
;__p+='\n\t\t<i class="icon-share go-to-sequence"></i>\n\t';
 } 
;__p+='\n</a>';
}
return __p;
};

this['JST']['app/templates/plugins/slideshow.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href=\'#\' class=\'slideshow-arrow slideshow-left-arrow disabled\'><img src=\'../assets/img/layers/slideshow-arrow.png\'/></a>\n<a href=\'#\' class=\'slideshow-arrow slideshow-right-arrow\'><img src=\'../assets/img/layers/slideshow-arrow.png\'/></a>\n<div class=\'slideshow-container\' style=\'width:'+
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

this['JST']['app/templates/plugins/slideshowthumbslider.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href=\'#\' class=\'arrow arrow-left slideshow-control-prev\'></a>\n<a href=\'#\' class=\'arrow arrow-right slideshow-control-next\'></a>\n\n<ul>\n\t';
 _.each(attr.slides, function(slide, i){ 
;__p+='\n\t\t<li>\n\t\t\t<a href=\'#\' data-slidenum="'+
( i )+
'">\n\t\t\t\t<div class=\'slideshow-thumbnail\' style="background:url('+
( slide.attr.uri )+
'); background-repeat:no-repeat;background-size:100%;background-position:center"></div>\n\t\t\t\t<div class=\'thumb-title\'>';
 if(slide.attr.title.replace(/\s+/g, '') != ''){ 
;__p+=''+
( slide.attr.title )+
'';
 }else{ 
;__p+='untitled';
 } 
;__p+='</div>\n\t\t\t</a>\n\t\t</li>\n\t';
 });
;__p+='\n</ul>';
}
return __p;
};

this['JST']['app/templates/plugins/video.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
}
return __p;
};