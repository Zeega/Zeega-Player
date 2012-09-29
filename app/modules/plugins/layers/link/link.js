define([
  "zeega",
  "backbone",
  'zeega_layers/_layer/_layer',
  'zeega_media_players/plyr'
],

function(Zeega, Backbone, _Layer, Player){

	var Layer = Zeega.module();

	Layer.Link = _Layer.extend({

		layerType : 'Link',
		layerPanel : $('#links-list'),
		hasControls : false,
		defaultControls : false,
		displayCitation : false,
		
		defaultAttributes : {
			'title' : 'Link Layer',
			'to_sequence' : null,
			'from_sequence' : null,
			'to_frame' : null,
			'from_frame' : null,
			'left' : 25,
			'top' : 25,
			'height' : 50,
			'width' : 50,
			'opacity' : 1,
			'opacity_hover' : 1,
			'blink_on_start' : true,
			'glow_on_hover' : true
		},
		
		init : function(options)
		{
			//check to see if link layer is broken
			/*
			var a = this.get('attr');
			if( !_.isNull(a.from_frame) || !_.isNull(a.from_sequencee) || !_.isNull(a.to_frame) || !_.isNull(a.to_sequence) )
			{
				console.log('link layer is broken! delete meeee!')
				this.destroy();
			}
			*/
		},
		
		setToFrame : function(sequenceID, frameID)
		{
			this.get('attr').to_sequence = sequenceID;
			this.get('attr').to_frame = frameID;
			this.get('attr').title = 'Link to sequence '+sequenceID;
			this.save();
		}
		
	});
	
	/*
	Layer.Views.Controls.Link = Layer.Views.Controls.extend({
		
		onLayerEnter : function()
		{
			var layerIndex = this.model.layerIndex || this.model.layerColor.length;
			
			$(this.el).find('.zicon-link').css({'background-color': this.model.layerColor[( layerIndex % this.model.layerColor.length )] })
			if(this.model.get('attr').to_frame == Zeega.player.currentFrame.id)
			{
				this.remove();
			}
		},
		
		render : function()
		{
			return this;
		}
		
	});
*/
	Layer.Link.Visual = _Layer.Visual.extend({
		
		preview : true,
		
		init : function()
		{
			var _this = this;
			this.model.on('update', this.onUpdate, this);
		},

		onUpdate : function()
		{
			this.$el.resizable('destroy');
			this.render();
			this.makeResizable();
		},
		
		render : function()
		{
			var _this = this;
			var style = {
				'overflow' : 'visible',
				'cursor' : 'pointer',
				'z-index' : 100,
				'width' : 'auto',
				'height' : 'auto',
				'border' : 'none',
				'border-radius' : '0',
				'height' : this.model.get('attr').height +'%',
				'width' : this.model.get('attr').width +'%'
			}

			this.$el.removeClass('link-arrow-right link-arrow-down link-arrow-up link-arrow-left');



			if( this.preview ) this.delegateEvents({'click':'goClick'});

			if(this.model.get('attr').link_type == 'arrow_left')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-left');
			else if(this.model.get('attr').link_type == 'arrow_right')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-right');
			else if(this.model.get('attr').link_type == 'arrow_up')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-up');

			if( this.model.get('attr').glow_on_hover ) this.$el.addClass('linked-layer-glow');

			if(!this.preview )
			{
				_.extend( style, {
					'border' : '2px dashed orangered',
					'border-radius' : '6px'
				})
			}
			
			
			this.$el.html( this.getTemplate() ).css( style ).addClass('linked-layer');
			return this;
		},
		
		events : {
			'click .go-to-sequence' : 'goToSequenceFrame',
			'click .delete-link' : 'deleteLink',
			'mousedown .show-controls' : 'showControls',
			'mouseover' : 'onMouseOver',
			'mouseout' : 'onMouseOut'
		},

		onMouseOver : function()
		{
			console.log('link on mouseover')
			this.$el.stop().fadeTo( 500, this.model.get('attr').opacity_hover );
		},

		onMouseOut : function()
		{
			console.log('link on mouseover')
			this.$el.stop().fadeTo( 500, this.model.get('attr').opacity );
		},
		
		goClick : function()
		{
			Zeega.player.project.goToFrame(this.model.get('attr').to_frame);
		},
		
		goToSequenceFrame : function()
		{
			if(this.preview) Zeega.player.project.goToFrame(this.model.get('attr').to_frame);
			else Zeega.player.goToFrame(this.model.get('attr').to_frame);
		},
		
		deleteLink : function(e)
		{
			if( confirm('delete link?') )
			{
				this.model.trigger('editor_removeLayerFromFrame', this.model);
				this.remove();
			}
		},
		
		showControls : function(e)
		{
			
		},
		
		onLayerEnter : function()
		{
			var _this = this;

			this.$el.resizable('destroy');
			this.$el.resizable({
				stop: function(e,ui)
				{
					_this.model.update({
						'width' : $(this).width() / $(this).parent().width() * 100,
						'height' : $(this).height() / $(this).parent().height() * 100
					})
				}
			})
		
			this.makeResizable();
			this.delegateEvents();
		},

		makeResizable : function()
		{
			var _this = this;
			var linkType = this.model.get('attr').link_type;

			this.$el.resizable({
				handles: 'all',
				stop : function()
				{
					var attr = {
						'width' : $(this).width() / $(this).parent().width() * 100,
						'height' : $(this).height() / $(this).parent().height() * 100
					};
					console.log('save attr', attr);
					_this.model.update(attr);
				}
			});
		},
		
		player_onPlay : function()
		{
			this.render();
			this.delegateEvents({
				'click':'goClick',
				'mouseover' : 'onMouseOver',
				'mouseout' : 'onMouseOut'
			})
		},
		
		getTemplate : function()
		{
			var html = '';
				if( !this.preview && !_.isNull( this.model.get('attr').to_sequence ) ) html += '<i class="icon-share go-to-sequence"></i>';		
			return html;
		}
		
		
	});
	
	return Layer;

})