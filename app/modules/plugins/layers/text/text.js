define([
  "zeega",
  "backbone",
  'zeega_layers/_layer/_layer'
],

function(zeega, Backbone, _Layer){


	var Layer = zeega.module();

	Layer.Text = _Layer.extend({

		layerType : 'Text',
		displayCitation : false,
		linkable : true,
		
		defaultAttributes: {
			'title' :'Text Layer',
			'content' : 'Text',
			'left' :0,
			'top' :0,
			'color' : '#ffffff',
			'opacity' : 0.9,
			'fontSize' : 200,
			'overflow' : 'visible',
			'width' : 25,
			//'height' : 10,
			
			linkable : true
		},
		
		updateContentInPlace : function()
		{
			this.visual.updateContentInPlace();
		},

		controls : [

			{
				type : 'Checkbox',
				property : 'dissolve',
				label : 'Fade In'
			},
			{
				type : 'ColorPicker',
				property : 'color',
				label : '',
				opacity : true
			},
			{ type : 'TextStyles' },
			{ type : 'FontChooser' }
		]
		
	});

	Layer.Text.Visual = _Layer.Visual.extend({
		
		draggable : true,
		
		template : '<div id="zedit-target" class="inner" contenteditable="<%= contentEditable %>" ><%= content %></div>',

		render : function()
		{
			
			// this should be removed later!
			var c = '';
			var b = '';
			if( _.isObject( this.model.get('attr').color ) )
			{
				var a = this.model.get('attr').color;
				c = rgbToHex(a.r,a.g,a.b);
			}
			else c = this.model.get('attr').color;
			
			if( _.isObject( this.model.get('attr').backgroundColor ) )
			{
				var a = this.model.get('attr').backgroundColor;
				b = rgbToHex(a.r,a.g,a.b);
			}
			else b = this.model.get('attr').backgroundColor;
			
			
			var style = {
				'color' : 'rgba('+ c.toRGB() +','+ (this.model.get('attr').colorOpacity || 1) +')',
				'opacity' : this.model.get('attr').opacity,
				'fontSize' : this.model.get('attr').fontSize < 100 ? '200%' : this.model.get('attr').fontSize +'%', // enforces minimum. remove this later
				'width' : this.model.get('attr').width+'%',
				'overflow' : 'visible',
				'line-height' : '100%',
			}

			$(this.el).html( _.template( this.template, _.extend(this.model.get('attr'), {contentEditable:!this.model.player} ) ) ).css( style );
			if(!this.model.player) $(this.el).addClass('text-non-editing');
						
			return this;
		},
		
		onLayerEnter : function()
		{
			var _this = this;
			
			//this.$el.css('width',_this.$el.find('#zedit-target').width()+'px');
			
			this.$el.find('#zedit-target').keyup(function(e){
				if(e.which == 27){ $(this).blur() }
				
				_this.lazySave();
			})
			.bind('paste', function(e){
				console.log('content pasted in!')
				_this.lazySave();
			});
			
			this.$el.click(function(){
				_this.$el.find('#zedit-target').focus();
				_this.$el.draggable('option','disabled', true);
				_this.$el.addClass('text-editing').removeClass('text-non-editing');
				
				
				
			}).focusout(function(){
				_this.$el.draggable('option','disabled', false);
				_this.$el.removeClass('text-editing').addClass('text-non-editing');
				_this.lazySave();
			})
			
			$(this.el).resizable({
				stop : function(e,ui)
				{
					$(this).css('height','');
					_this.model.update({
						'width' : $(this).width() / $(this).parent().width() * 100,
					})
				}
			});
			
			
		},
		
		lazySave : _.debounce( function(){
			
			var str = this.$el.find('#zedit-target').html();
			
			var clean = this.cleanString( str );
			
			this.model.update({
				'content' : str,
				'title' : clean
			});
		}, 1000),
		
		cleanString : function(str)
		{
			return str.replace(/(<([^>]+)>)/ig, "");
		},
		
		updateContentInPlace : function()
		{
			$(this.el).find('#zedit-target').html(this.model.get('attr').content );
		},
		
		onPreload : function(){ this.model.trigger('ready',this.model.id) }
		
	});
	
	return Layer;

})

