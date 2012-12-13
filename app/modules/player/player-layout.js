define([
	"zeega"
],

function(Zeega )
{
	/*
		the player layout

		# contains resize logic
		# renders the window target for frames/layers

	*/
	var Player = {};

	Player.Layout = Zeega.Backbone.Layout.extend({

		fetch: function(path) {
			// Initialize done for use in async-mode
			var done;

			// Concatenate the file extension.
			path = 'app/templates/layouts/'+ path + ".html";

			// If cached, use the compiled template.
			if (JST[path]) {
				return JST[path];
			} else {
				// Put fetch into `async-mode`.
				done = this.async();

				// Seek out the template asynchronously.
				return $.ajax({ url: Zeega.root + path }).then(function(contents) {
					done(JST[path] = _.template(contents));
				});
			}
		},

		template: 'player-layout',
		className: 'ZEEGA-player',

		initialize: function() {
			var _this = this;
			// debounce the resize function so it doesn't bog down the browser
			var lazyResize = _.debounce(function(){ _this.resizeWindow(); }, 300);
			// attempt to detect if the parent container is being resized
			if ( !this.model.get('div_id') ) {
				$(window).resize(lazyResize);
			}
		},

		serialize: function() {
			return this.model.toJSON();
		},

		afterRender: function() {
			// correctly size the player window
			this.$('.ZEEGA-player-window').css( this.getWindowSize() );
			this.setControls();
			this.resizeWindow();
		},

		setControls: function() {
			var _this = this;

			if ( this.model.get('next') && $(this.model.get('next')).length ) {
				$(this.model.get('next')).click(function(){
					_this.model.cueNext();
					return false;
				});
			}
			if ( this.model.get('prev') && $(this.model.get('prev')).length ) {
				$(this.model.get('prev')).click(function(){
					_this.model.cuePrev();
					return false;
				});
			}
		},

		resizeWindow: function() {
			// animate the window size in place
			var css = this.getWindowSize();
			this.$('.ZEEGA-player-window').animate( css );
			this.model.trigger('window_resized', css );
			Zeega.trigger('resize_window',css);
		},

		// calculate and return the correct window size for the player window
		// uses the player's window_ratio attribute
		getWindowSize : function()
		{
			var css = {};
			var winWidth =  this.model.get('div_id') ? $('#'+ this.model.get('div_id')).width() : window.innerWidth;
			var winHeight = this.model.get('div_id') ? $('#'+ this.model.get('div_id')).height() : window.innerHeight;
			var winRatio = winWidth / winHeight;

			if(this.model.get('window_fit'))
			{
				if( winRatio > this.model.get('window_ratio') )
				{
					css.width = winWidth + 'px';
					css.height = winWidth / this.model.get('window_ratio') +'px';
				}
				else
				{
					css.width = winHeight * this.model.get('window_ratio') +'px';
					css.height = winHeight +'px';
				}
			}
			else
			{
				if( winRatio > this.model.get('window_ratio') )
				{
					css.width = winHeight * this.model.get('window_ratio') +'px';
					css.height = winHeight +'px';
				}
				else
				{
					css.width = winWidth + 'px';
					css.height = winWidth / this.model.get('window_ratio') +'px';
				}
			}
			return css;
		}
	});

	return Player;
});