define([
  "zeega",
  "backbone",
  'zeega_layers/_layer/_layer',
  'zeega_media_players/plyr'
],

function(zeega, Backbone, _Layer, Player){

	var Layer = zeega.module();

	Layer.Audio = _Layer.extend({
		
		layerType : 'Audio',

		defaultAttributes : 
		{
			'title' : 'Audio Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'volume' : 0.5,
			'cue_in'  : 0,
			'cue_out' : null,
			'fade_in'  : 0,
			'fade_out' : 0,
			'opacity':1,
			'dimension':1.5,
			'citation':true
		}
		
	});
	
	/*
	Layer.Views.Controls.Audio = Layer.Views.Controls.Video.extend({
		
			render : function()
			{

				var playbackControls = new Layer.Views.Lib.Target({
					model : this.model
				});

				var volumeSlider = new Layer.Views.Lib.Slider({
					property : 'volume',
					model: this.model,
					label : 'Volume',
					min : 0,
					max : 1,
					step : 0.01,
					css : false
				});
				
							
			var fadeInSlider = new Layer.Views.Lib.Slider({
				property : 'fade_in',
				model: this.model,
				label : 'Fade In (sec)',
				min : 0,
				max :5,
				step : 0.1,
				css : false
			});
			
			
			var fadeOutSlider = new Layer.Views.Lib.Slider({
				property : 'fade_out',
				model: this.model,
				label : 'Fade Out (sec)',
				min : 0,
				max : 5,
				step : 0.1,
				css : false
			});

				this.controls
					.append( playbackControls.getControl() )
					.append( volumeSlider.getControl() )
					.append( fadeInSlider.getControl() )
					.append( fadeOutSlider.getControl() );
					
				return this;

			}
		
	});
	*/
	Layer.Audio.Visual = _Layer.Visual.extend({
		draggable : false,
		linkable : false,
		render : function()
		{
			this.$el.append('<img src="/assets/img/audio-default.png" height="100%" width="100%">');
			return this;
		}
	});

	return Layer;

});