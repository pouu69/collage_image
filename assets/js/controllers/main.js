var mainRouter;
var console = window.console || {log:function(){}};
var defaultUrl = window.location.protocol+'//'+window.location.hostname+':'+window.location.port
var BackboneEvts;
requirejs.config({
	baseUrl: "/assets/js/libs",
	waitSeconds: 0,
	paths: {		
		jquery: "jquery.min",
		jquery_ui : "jquery-ui.min",
		jquery_ui_widget : "jquery.ui.widget",
		bootstrap: "bootstrap.min",
		underscore: "underscore",
		backbone: "backbone",

		canvas_to_blob:'file-upload/canvas-to-blob.min',
		jquery_fileupload_image:'file-upload/jquery.fileupload-image',
		jquery_fileupload_process:'file-upload/jquery.fileupload-process',
		load_image_all: 'file-upload/load-image.all.min',
		jquery_iframe_transport:'file-upload/jquery.iframe-transport',
		jquery_fileupload:'file-upload/jquery.fileupload',

		fileUploadJS : 'file-upload/fileUploadJS',
		collageJS : 'collageJS',
		aviary_editor : 'aviary.editor',
		feather_editor : 'feather.editor',

		routers: "../routers",
		views: "../views",
		controllers: "../controllers",
		templates: "../templates"
	},
	shim: {
		"jquery_ui": {
			deps:["jquery"]
		},
		"jquery_ui_widget" : {
			deps:["jquery"]
		},
		"jquery_fileupload": {
			deps:["jquery"]
		},
		"feather_editor":{
			deps:['jquery','aviary_editor']
		},
		"aviary_editor":{
			deps:['jquery']
		},
		"fileUploadJS" : {
			deps:['jquery', 'jquery_fileupload', 'jquery_iframe_transport','canvas_to_blob']
		},
		"collageJS" : {
			deps:['jquery', 'jquery_ui']
		},
		"bootstrap": {
			deps: ["jquery"],
			exports: "bootstrap"
		},
		"backbone": {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		"underscore": {
			exports: "_"
		}
	}
});


var include = [
	"jquery",
	"underscore",
	"backbone",
	"bootstrap",
	"routers/main_router"
];
requirejs(include,
function ($, _, Backbone, bootstrap, MainRouter) {
		mainRouter = new MainRouter();
		Backbone.history.start({pushState: true, root: '/'});
});

var Browser = {
	agt : navigator.userAgent.toLowerCase(),

	checkBrowser : function(agent, version){
		if(agent.toLowerCase() === 'ie'){
			return this.checkIE(version);
		}

		if(this.agt.indexOf(agent) != -1) return true;	
		return false;
	},

	checkIE : function (version){
		var navAppName = navigator.appName; 
		if ( (navAppName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (this.agt.indexOf("msie") != -1) ) {
			// return version IE
			if(version){
				 var word; 
				 var version = false; 

				 // IE old version ( IE 10 or Lower ) 
				 if ( navAppName == "Microsoft Internet Explorer" ) word = "msie "; 

				 else { 
					 // IE 11 
					 if ( this.agt.search("trident") > -1 ) word = "trident/.*rv:"; 

					 // IE 12  ( Microsoft Edge ) 
					 else if ( this.agt.search("edge/") > -1 ) word = "edge/"; 
				 } 

				 var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" ); 

				 if (  reg.exec( this.agt ) != null  ) version = RegExp.$1; 

				 return version; 
			}

			return true;
		}
		return false;	
	}
};