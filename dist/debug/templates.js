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

this['JST']['app/templates/plugins/image.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<img src="'+
( attr.uri )+
'" width=\'100%\' />';
}
return __p;
};