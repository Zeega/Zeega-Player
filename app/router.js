define([
	// Application.
	"zeega",
	"player/player"
],

function(Zeega, Player) {

	// Defining the Zeegalication router, you can attach sub routers here.
	var Router = Backbone.Router.extend({
		routes: {
			"": "index",
			"frame/:frameID" : 'goToFrame'
		},

		index: function()
		{
			//works
			//var project = new Player({url: 'http://alpha.zeega.org/api/projects/1666' });
			
			//works
			var project = new Player();
			project.on('all', function(e){console.log('e:',e);});
			project.load({url: 'http://alpha.zeega.org/api/projects/1841'});
			console.log('project', project);
		},

		goToFrame : function( frameID )
		{
			var project = new Player();
			project.on('all', function(e){console.log('e:',e);});
			project.load({
				url: 'http://alpha.zeega.org/api/projects/1841',
				start_frame : parseInt(frameID,10)
			});
			console.log('project', project, 'go to frame', frameID);
		}
	});

	return Router;

});
