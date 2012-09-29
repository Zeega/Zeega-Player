define([
  "zeega",
  "backbone",
  'zeega_layers/_layer/_layer'
],

function(Zeega, Backbone, _Layer){

	var Layer = Zeega.module();

	Layer.Geo = _Layer.extend({
			
		layerType : 'Geo',

		defaultAttributes : {
			'title' : 'Streetview Layer',
			'lat' : 42.3735626,
			'lng' : -71.1189639,
			'zoom' : 10,
			'streetZoom' : 1,
			'pitch' : 0,
			'mapType' : 'satellite',
			
			'url' : '',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33,
			'citation':true,
			
			'linkable' : true
		}

	});

	Layer.Geo.Visual = _Layer.Visual.extend({
		
		draggable : false,
		linkable : true,
		
		init : function()
		{
			var _this = this;
			this.model.on('update', this.updateVisual, this);
		},
		
		render : function()
		{

			var map = $('<div id="gmap-container-'+ this.model.id+'">')
				.css({
					'height': this.model.get('attr').height +'%'
				});

			this.$el.html( map ).css({height:this.model.get('attr').height+'%'});
						
			return this;
		},
		
		updateVisual : function()
		{
			var center = new google.maps.LatLng( this.model.get('attr').lat, this.model.get('attr').lng);
			var pov = {
					'heading' : this.model.get('attr').heading,
					'pitch' : this.model.get('attr').pitch,
					'zoom' : this.model.get('attr').streetZoom
			};
			
			this.streetview.setPosition( center );
			this.streetview.setPov( pov );
		},
		
		onLayerEnter : function()
		{
			var center = new google.maps.LatLng( this.model.get('attr').lat, this.model.get('attr').lng);

			var mapOptions = {
				
				addressControl : false,
				addressControlOptions : false,
				clickToGo : true,
				disableDoubleClickZoom : false,
				enableCloseButton : false,
				imageDateControl : false,
				linksControl : false,
				panControl : true,
				panControlOptions : {
					position: google.maps.ControlPosition.TOP_RIGHT
				},
				//pano : '',
				position : center,
				visible :true,
				zoomControl :false,
				zoomControlOptions :true,
				
				pov : {
						'heading' : this.model.get('attr').heading,
						'pitch' : this.model.get('attr').pitch,
						'zoom' : this.model.get('attr').streetZoom
				}
			};			
			this.streetview = new google.maps.StreetViewPanorama( $(this.el).find('.gmap-container')[0], mapOptions);
			this.initMapListeners();
		},
		
		initMapListeners : function()
		{
			var _this = this;
			
			google.maps.event.addListener( this.streetview, 'position_changed', function(){
				delayedUpdate();
			});

			google.maps.event.addListener( this.streetview, 'pov_changed', function(){
				delayedUpdate();
			});

			// need this so we don't spam the servers
			var delayedUpdate = _.debounce( function(){
				
				var a = _this.model.get('attr');
				
				if( a.heading != _this.streetview.getPov().heading || a.pitch !=  _this.streetview.getPov().pitch || a.streetZoom != _this.streetview.getPov().zoom || Math.floor(a.lat*1000) != Math.floor(_this.streetview.getPosition().lat()*1000) || Math.floor(a.lng*1000) != Math.floor(_this.streetview.getPosition().lng()*1000)  )
				{
					_this.model.update({
						heading : _this.streetview.getPov().heading,
						pitch : _this.streetview.getPov().pitch,
						streetZoom : Math.floor( _this.streetview.getPov().zoom ),
						lat : _this.streetview.getPosition().lat(),
						lng : _this.streetview.getPosition().lng()
					
					});
				}
				
				
			} , 1000);
		},
		
		onLayerExit : function()
		{
			//this destroys the map every time the frame is changed. there is probably a better way to do this
			this.map = null;
			$(this.el).find('.gmap-container').remove();
		},
		
		player_onPreload : function()
		{
			this.model.trigger('ready', this.model.id);
		},

		player_onPlay : function()
		{
			var _this = this;
			if( !this.isLoaded )
			{
				var center = new google.maps.LatLng( this.model.get('attr').lat, this.model.get('attr').lng);

				var mapOptions = {
					
					addressControl : false,
					addressControlOptions : false,
					clickToGo : true,
					disableDoubleClickZoom : false,
					enableCloseButton : false,
					imageDateControl : false,
					linksControl : false,
					panControl : false,
					panControlOptions : {
						position: google.maps.ControlPosition.TOP_RIGHT
					
					},
					position : center,
					visible :true,
					zoomControl :false,
					
					
					pov : {
							'heading' : this.model.get('attr').heading,
							'pitch' : this.model.get('attr').pitch,
							'zoom' : this.model.get('attr').streetZoom
					}
					
				};
				
				_this.streetview = new google.maps.StreetViewPanorama( this.$('#gmap-container-'+_this.model.id)[0], mapOptions);
				
				
				this.isLoaded = true;
			}
		}
		
	});

/*	
	Layer.Views.Controls.Geo = Layer.Views.Controls.extend({
		
		render : function()
		{
			var dissolveCheck = new Layer.Views.Lib.Checkbox({
				property : 'dissolve',
				model: this.model,
				label : 'Fade In'
			});
			
			var widthSlider = new Layer.Views.Lib.Slider({
				property : 'width',
				model: this.model,
				label : 'Width',
				suffix : '%',
				min : 1,
				max : 200,
			});
			var heightSlider = new Layer.Views.Lib.Slider({
				property : 'height',
				model: this.model,
				label : 'Height',
				suffix : '%',
				min : 1,
				max : 200,
			});
			
			var leftSlider = new Layer.Views.Lib.Slider({
				property : 'left',
				model: this.model,
				label : 'Horizontal Position',
				suffix : '%',
				min : 0,
				max : 100,
			});
			var topSlider = new Layer.Views.Lib.Slider({
				property : 'top',
				model: this.model,
				label : 'Vertical Position',
				suffix : '%',
				min : 0,
				max : 100,
			});
			
			var opacitySlider = new Layer.Views.Lib.Slider({
				property : 'opacity',
				model: this.model,
				label : 'Opacity',
				step : 0.01,
				min : .05,
				max : 1,
			});
			
			var gMaps = new Layer.Views.Lib.GoogleMaps({
				model: this.model,
			});
			
			$(this.controls)
				.append( dissolveCheck.getControl() )
				.append( gMaps.getControl() )
				.append( widthSlider.getControl() )
				.append( heightSlider.getControl() )
				.append( leftSlider.getControl() )
				.append( topSlider.getControl() )
				.append( opacitySlider.getControl() );
			
			return this;
		
		}
		
	});
*/


	return Layer;

});