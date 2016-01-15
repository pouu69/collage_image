define(['jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){
		var MainRouter = Backbone.Router.extend({
		routes : {		
			''	: 'showMain'
		},
		
		initialize : function(){
		},		
			
		showMain : function(){
			var that = this;
			if( !this.mainView) {
				that.mainView   = requirejs(["views/collage_test_view"],function(MainView){
					that.mainView = new MainView();
					that.mainView.render();
				});
			}else{
				this.mainView.render();
			}
	
		}
	});

	return MainRouter;
});
