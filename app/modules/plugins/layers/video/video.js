define([
  "zeega",
  "backbone",
  'zeega_layers/_layer/_layer',
  'zeega_media_players/plyr'
],

function(zeega, Backbone, _Layer, Player){

	var Layer = zeega.module();

	Layer.Video = _Layer.extend({
			
		layerType : 'Video',
		draggable : true,
		
		player_loaded : false,

		defaultAttributes : 
		{
			'title' : 'Video Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'volume' : 0.5,
			'cue_in'  : 0,
			'cue_out' : null,
			'fade_in' : 0,
			'fade_out' : 0,
			'dissolve': false,
			'opacity':1,
			'dimension':1.5,
			'citation':true,
		},

		initialize : function(opts)
		{
			console.log('vv		init video', this, opts)
			_.extend( this, opts );
		},

		init : function()
		{
			this.initPlayer()
		},
		
		initPlayer : function()
		{
			var ct = '#media-controls-'+this.id;
			console.log('init editor player', ct)
			var Player = zeega.module('player');
			this.player = new Player.Views.Player({
				model:this.parent,
				control_mode : 'editor',
				media_target : '#layer-visual-'+this.id,
				controls_target : ct
			});
		},
		
		initPlayerPlayer : function()
		{
			this.player = new Player.Player({
				model:this.parent,
				control_mode : 'none',
				media_target : '#layer-visual-'+ this.id
			});
			console.log('init player player', Player, this, this.player)
		},

		controls : [

		]

	});


	Layer.Video.Visual = _Layer.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		render : function()
		{
			console.log('vv		video render', this)
			var img = $('<img>')
				.attr('id', 'video-player-'+ this.model.id)
				.attr('src', this.model.get('attr').thumbnail_url)
				.css({'width':'100%'});

			this.$el.html( img ).css('height', this.model.get('attr').height+'%');
			
			return this;
		},
		
		
		editor_onLayerEnter : function(){},
		
		editor_onLayerExit : function()
		{
			console.log('@@@		on layer exit')
			if( this.model.player_loaded ) this.model.player.destroy();
			this.model.player_loaded = false;
			
			//must call this if you extend onLayerExit
			this.model.trigger('editor_readyToRemove')
		},
		
		editor_onControlsOpen : function()
		{
			console.log('video controls open : visual')
			var _this = this;
			if( !this.model.player_loaded )
			{
				this.model.initPlayer();
				this.$el.html(this.model.player.render().el);
				this.model.player.placePlayer();
				console.log('on controls open',this, this.model.player)
				
				this.model.player_loaded = true;
			}
			else
			{
				this.model.player.pause();
			}
			//replace with the actual video object
		},
		
		editor_onControlsClosed : function()
		{
			this.model.player.pause();
		},
		
		player_onPreload : function()
		{
			var _this = this;
			
			if( !this.model.player_loaded )
			{
				this.model.typeModel.initPlayerPlayer();
				console.log('pp 		video on preload', this, this.el, this.model.typeModel.player.render().el )

				this.$el.html( this.model.typeModel.player.render().el );
				this.model.typeModel.player.placePlayer();
				
				var _this = this;
				this.model.typeModel.player.popcorn.listen('timeupdate',function(){ _this.onTimeUpdate() })
				
				this.model.player_loaded = true;
			}
			else
			{
				this.model.player.pause();
			}
			
		},
		onEnded : function()
		{
		
		
		},
		
		onTimeUpdate : function()
		{
			//this.model.trigger('timeupdate');
			this.model.trigger('timeupdate',{
				'model':this.model,
				'elapsed':this.model.typeModel.player.getCurrentTime(),
				'duration':this.model.typeModel.player.getDuration()
			});
			//Fades
			
			if(this.model.get('attr').cue_out==0) var out = this.model.typeModel.player.getDuration();
			else var out = this.model.get('attr').cue_out;
			var t = this.model.typeModel.player.getCurrentTime();
			var f = parseFloat(this.model.get('attr').cue_in)+parseFloat(this.model.get('attr').fade_in);
			var g = out-parseFloat(this.model.get('attr').fade_out);
			
			
			if(this.model.get('attr').fade_in>0 && t<f)
			{
				var vol =this.model.get('attr').volume*(1.0-((f-t)/this.model.get('attr').fade_in)*((f-t)/this.model.get('attr').fade_in));
				this.model.player.setVolume(vol);
			}
			
			else if(this.model.get('attr').fade_out>0 && t>g)
			{
				var vol =this.model.get('attr').volume*(1.0-((t-g)/this.model.get('attr').fade_out))*(1.0-((t-g)/this.model.get('attr').fade_out));
				this.model.typeModel.player.setVolume(vol);
			}
			else if(Math.abs(this.model.get('attr').volume - this.model.typeModel.player.getVolume())>.01)
			{
				this.model.typeModel.player.setVolume(this.model.get('attr').volume);
			}
			
			
			//Dissolve
			
			/*
			
			if(this.model.get('attr').dissolve||true){
			
				if(this.model.video.currentTime()-this.model.get('attr').cue_in<1.0){
					var op = parseFloat(this.model.video.currentTime()-this.model.get('attr').cue_in);
					this.$el.css({opacity:op});
				}
				
				else if(out-this.model.video.currentTime()<1.0){
					var op = Math.max(0,parseFloat(out-this.model.video.currentTime()));
					this.$el.css({opacity:op});
				}
			
			}
			
			*/
			
			
			
		},
		
		player_onPlay : function()
		{
			console.log('vv		vid on play', this)
			this.model.typeModel.player.play();
		},

		player_onPause : function()
		{
			console.log('vv		vid on pause', this)
			this.model.typeModel.player.pause();
		},
		
		player_onExit : function()
		{
			console.log('vv		vid on exit', this)
			this.model.typeModel.player.pause();
		},
		
		player_onUnrender : function()
		{
			
			console.log('vv		vid on unrender', this)
			this.model.typeModel.player.pause();
			this.model.destroy();	
		}
		
	});
	
	Layer.Youtube = Layer.Video.extend();
	Layer.Youtube.Visual = Layer.Video.Visual.extend();
	
	Layer.Vimeo = Layer.Video.extend();
	Layer.Vimeo.Visual = Layer.Video.Visual.extend();


	/*
	Layer.Video.Controls = Layer.Views.Controls.extend({
				
		render : function()
		{
			var _this = this;
			var playbackControls = new Layer.Views.Lib.Target({
				model : this.model
			});
			
			var dissolveCheck = new Layer.Views.Lib.Checkbox({
				property : 'dissolve',
				model: this.model,
				label : 'Fade In'
			});
			
			var volumeSlider = new Layer.Views.Lib.Slider({
				property : 'volume',
				model: this.model,
				label : 'Volume',
				min : 0,
				max : 1,
				step : 0.01,
				css : false,
				onSlide : function()
				{
					this.model.player.popcorn.volume( volumeSlider.getValue() )
				}
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
			
			var widthSlider = new Layer.Views.Lib.Slider({
				property : 'width',
				model: this.model,
				label : 'Width',
				suffix : '%',
				min : 1,
				max : 200,
				
				onStart : function()
				{
					this.model.visual.$el.addClass('editing-layer');
				},
				onStop : function()
				{
					this.model.visual.$el.removeClass('editing-layer')
				}
			});
			
			var heightSlider = new Layer.Views.Lib.Slider({
				property : 'height',
				model: this.model,
				label : 'Height',
				suffix : '%',
				min : 1,
				max : 200,
				onStart : function()
				{
					this.model.visual.$el.addClass('editing-layer');
				},
				onStop : function()
				{
					this.model.visual.$el.removeClass('editing-layer')
				}
			});
			
			var opacitySlider = new Layer.Views.Lib.Slider({
				property : 'opacity',
				model: this.model,
				label : 'Opacity',
				step : 0.01,
				min : 0,
				max : 1,
			});
			
			var audioLabel = new Layer.Views.Lib.SectionLabel({label:'Audio'})
			
			this.controls
				.append( playbackControls.getControl() )
				.append( dissolveCheck.getControl() )
				.append( widthSlider.getControl() )
				.append( heightSlider.getControl() )
				.append( opacitySlider.getControl() )
				.append( audioLabel.getControl() )
				.append( volumeSlider.getControl() )
				.append( fadeInSlider.getControl() )
				.append( fadeOutSlider.getControl() );
				
			
			return this;
		
		}
	
	});
*/

	return Layer;

})