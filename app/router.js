define([
	// Application.
	"zeega",
	"player/player"
],

function(Zeega, Player) {

	// Defining the Zeegalication router, you can attach sub routers here.
	var Router = Backbone.Router.extend({
		routes: {
			"": "index"
		},

		index: function()
		{
			//works
			//var project = new Player({url: 'http://alpha.zeega.org/api/projects/1666' });
			
			//works
			var project = new Player();
			project.on('all', function(e){console.log('e:',e);});
			project.load({url: 'http://alpha.zeega.org/api/projects/1666'});
			console.log('project', project);
		}
	});

	return Router;

});
