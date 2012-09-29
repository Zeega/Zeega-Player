define([
  "zeega",
  "backbone",
  'zeega_layers/_layer/_layer'
],

function(zeega, Backbone, _Layer){

	var Layer = zeega.module();

	Layer.Rectangle = _Layer.extend({

		layerType : 'Rectangle',
		displayCitation : false,
		linkable : true,
		
		defaultAttributes : {
			'title' : 'Color Layer',
			'url' : null,
			'backgroundColor': '#ff00ff',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':.75,
			
			linkable : true
		},

		controls : [

			{
				type : 'Checkbox',
				property : 'dissolve',
				label : 'Fade In'
			},
			{
				type : 'ColorPicker',
				property : 'backgroundColor',
				label : 'Color'
			},
			{
				type : 'Slider',
				property : 'width',
				label : 'Width',
				suffix : '%',
				min : 1,
				max : 200
			},
			{
				type : 'Slider',
				property : 'height',
				label : 'Height',
				suffix : '%',
				min : 1,
				max : 200,
			},
			{
				type : 'Slider',
				property : 'opacity',
				label : 'Opacity',
				step : 0.01,
				min : 0,
				max : 1,
			}

		]
		
	});
	

	Layer.Rectangle.Visual = _Layer.Visual.extend({
		render : function()
		{
			var style = {
				'backgroundColor' : this.model.get('attr').backgroundColor,
				'height' : this.model.get('attr').height +'%'
			}

			this.$el.css( style );
			
			return this;
		},
		
	});



	return Layer;

})
