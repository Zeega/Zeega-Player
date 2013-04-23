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

this["JST"]["app/templates/plugins/audio.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<audio id="audio-el-'+
(id )+
'" src="'+
( attr.uri )+
'" autoplay></audio>';
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
__p+='<div class=\'ZEEGA-link-inner\'></div>';
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
'</div>\n<div class=\'slide-description\'>'+
( description )+
'</div>\n<a href="'+
( attribution_uri )+
'" target=\'blank\' class=\'attribution-link\'>\n    '+
( media_creator_username )+
'\n    <i class=\'slideshow-icon-'+
( archive.toLowerCase() )+
' ssarchive\'></i>\n</a>\n';
}
return __p;
};

this["JST"]["app/templates/plugins/slideshow.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href=\'#\' class=\'slideshow-arrow arrow-left slideshow-control-prev disabled\'></a>\n<a href=\'#\' class=\'slideshow-arrow arrow-right slideshow-control-next\'></a>\n\n<div class=\'slideshow-container\'>\n\t';
 _.each( attr.slides, function(slide,i){ 
;__p+='\n\t\t<div class=\'slideshow-slide slideshow-slide-'+
( i )+
'\' style=\'\n      background:url('+
( slide.attr.uri )+
') no-repeat center center;\n      -webkit-background-size: ';
 if( slides_bleed ) { 
;__p+='cover';
 } else { 
;__p+='contain';
 } 
;__p+=';\n      -moz-background-size: ';
 if( slides_bleed ) { 
;__p+='cover';
 } else { 
;__p+='contain';
 } 
;__p+=';\n      -o-background-size: ';
 if( slides_bleed ) { 
;__p+='cover';
 } else { 
;__p+='contain';
 } 
;__p+=';\n      background-size: ';
 if( slides_bleed ) { 
;__p+='cover';
 } else { 
;__p+='contain';
 } 
;__p+=';\n    \'></div>\n\t';
 }) 
;__p+='\n</div>';
}
return __p;
};

this["JST"]["app/templates/plugins/slideshowthumbslider.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'slideshow-thumb-wrapper\'>\n    <ul>\n        ';
 _.each(attr.slides, function(slide, i){ 
;__p+='\n            <li>\n                <div class=\'slideshow-thumbnail\' style="background:url('+
( slide.attr.thumbnail_url )+
'); background-repeat:no-repeat;background-size:100%;background-position:center">\n                    <a href=\'#\' class=\'slider-thumb\' data-slidenum="'+
( i )+
'"></a>\n                </div>\n            </li>\n        ';
 });
;__p+='\n    </ul>\n</div>';
}
return __p;
};

this["JST"]["app/templates/plugins/text-link.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="http://'+
( attr.link )+
'" data-bypass="true" target="blank">\n    '+
( attr.content )+
'\n</a>';
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

this["JST"]["app/templates/plugins/textmodal.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="modal-close">&times;</a>\n<div class="modal-content">\n    <div class="modal-title">Edit your text</div>\n    <div class="modal-body">\n\n        <textarea rows="4" cols="59" maxlength="140" >'+
( attr.content )+
'</textarea>\n\n        <div class="text-controls clearfix">\n            <div class="color-selector">\n                <input class="simple-color" value="#'+
( attr.color )+
'"/>\n            </div>\n            <a href="#" class="btnz btnz-light text-btn-bold"><i class="icon-bold"></i></a>\n            <a href="#" class="btnz btnz-light text-btn-italic"><i class="icon-italic"></i></a>\n            <a href="#" class="btnz btnz-light text-btn-align-left"><i class="icon-align-left"></i></a>\n            <a href="#" class="btnz btnz-light text-btn-align-center"><i class="icon-align-center"></i></a>\n            <a href="#" class="btnz btnz-light text-btn-align-right"><i class="icon-align-right"></i></a>\n\n            <select class="font-list" style=""></select>\n            <select class="size-list" style="">\n                <option value="100">8</option>\n                <option value="125">10</option>\n                <option value="150">12</option>\n                <option value="175">14</option>\n                <option value="200">18</option>\n                <option value="250">24</option>\n                <option value="375">36</option>\n                <option value="500">48</option>\n                <option value="800">72</option>\n                <option value="1600">144</option>\n                <option value="2400">200</option>\n                <option value="3600">300</option>\n            </select>\n            \n        </div>\n\n        <div class="sample-header">sample</div>\n        <div class="text-sample">'+
( attr.content )+
'</div>\n\n        <div class="bottom-chooser clearfix">\n            <a href="#" class="submit btnz btnz-submit">OK</a>\n        </div>\n    </div>\n</div>\n';
}
return __p;
};

this["JST"]["app/templates/plugins/textV2.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="visual-target">'+
( attr.content )+
'</div>\n<div class="controls-inline"></div>';
}
return __p;
};