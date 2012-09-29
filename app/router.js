define([
  // Application.
  "zeega"
],

function(Zeega) {

  // Defining the Zeegalication router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {

    }
  });

  return Router;

});
