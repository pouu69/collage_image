define([
	"jquery",
	"underscore",
	"backbone",
	'fileUploadJS',
	'collageJS',
	'aviary_editor',
	'feather_editor'
], function($, _, Backbone) {
	var CollageTestView = Backbone.View.extend({
		el: "#main_container",

		events:{
			'click #layouts li > a' : 'changeTab'
		},

		initialize: function() {
            fileUploadJS.init({
                preview_img_el : 'img',
                preview_img_attr : {'crossOrigin' : 'Anonymous'},
                preview_img_css : {'width':'100%','margin-bottom':'10px'}
            });

			this.drawPosCnt = 0;
		},

		changeTab : function(e){
			if(e) e.preventDefault();
			this.drawPosCnt = 0;
		},

		collageJSInit : function(){
                    var collage = collageJS.init({
                        'tabsSelector': '#layouts',
                        'collageContainer': '#collage',
                        'imgList': '#img_list',
                        'resultImg': '#result',
                        'generateLink': '#generate',
                        'width': 503,
                        'height': 500,
                        'layouts': [
                            {
                                'description': 'One image',
                                'layout': ['100/100']
                            },
                            {
                                'description': 'Two horizontal images',
                                'layout': ['100/50 - 100/50']
                            },
                            {
                                'description': 'Two vertical images',
                                'layout': ['50/100 - 50/100']
                            },
                            {
                                'description': 'One image on top, two on the bottom',
                                'layout': ['100/50', '50/50 - 50/50']
                            },
                            {
                                'description': 'Two images on top, one on the bottom',
                                'layout': ['50/50 - 50/50', '100/50']
                            },
                            {
                                'description': 'Four images, one in each corner',
                                'layout': ['50/50 - 50/50', '50/50 - 50/50']
                            },
                            {
                                'description': 'Two images left side, three right side',
                                'type': 'col',
                                'layout': ['50/50 - 50/50', '50/33.4 - 50/33.4 - 50/33.4']
                            },
                            {
                                'description': 'Two images on top, three on the bottom',
                                'layout': ['50/50 - 50/50', '33.333/50 - 33.333/50 - 33.333/50']
                            }
                        ]
                    });
		},

		uploadDone : function(e, data){
			var $img = fileUploadJS.createElem(data.result);
			this.launchAviary($img);
		},

		launchAviary : function($img){
			var that = this;
			if(featherEditor !== undefined){
				featherEditor.launch({
					image: $img.attr('id')|| null,
					url : $img.attr('src'),
					forceCropPreset: ['Square', '1:1'],
					tools: 'stickers',
					noCloseButton : false,
					onSave:function(imageID, newURL){
						return that.onSaveAviary(imageID, newURL);
					}
				});
			}
		},

		onSaveAviary : function(imageID, newURL){
			var that = this;
			// check IE , beacause of cross origin not happen in IE
			if(Browser.checkBrowser('IE') && Browser.checkBrowser('IE') < 10){
				var requests = {
							url : '/rest_collage_test?path='+encodeURIComponent(newURL), 
							type: 'GET'
						};
				$.ajax({
					url : requests.url,
					type : requests.type,
					dataType : 'json',
					cache : false,

					success : function(data){
						var img = document.getElementById(imageID);

						img.onload = (function(img){
							return function(){that.autoDrawCanvas(img)};
						})(img);

						$(img).attr('src', data.file_path);
					},
					error : function(error){
						console.log(error);
					}
				});
			}else{
				var img = document.getElementById(imageID);

				img.onload = (function(img){
						return function(){that.autoDrawCanvas(img)};
					})(img);
					$(img).attr('src', newURL);
			}

			featherEditor.close();	
		},

		autoDrawCanvas : function(img){
			var activeTagID = $('#layouts li.active a').attr('href');
			activeTagID = activeTagID.substr(1, activeTagID.length-1);
			var cvs = $('#'+activeTagID+' img');

			for(var i=0 ; i<cvs.length ; i++){
				if( $(cvs[i]).attr('src') !== undefined && $(cvs[i]).attr('src') !== ''){
					continue;
				}
				var $canvas= $("<canvas>", {id: "fake_canvas"});
				$canvas.attr('width', cvs[i].offsetWidth);
				$canvas.attr('height',cvs[i].offsetHeight);
			
				var ctx = $canvas[0].getContext('2d');
				var canvas = ctx.canvas ;
				ctx.drawImage(img, 0,0, canvas.width, canvas.height);
				var src = canvas.toDataURL();	
			    // Draw the image onto the canvas
				img.crossOrigin = "Anonymous";
				$(cvs[i]).attr('src', src);
				$canvas.remove();
				$('#fake_canvas').remove();
				return;
			}				
		},

		render: function(){
			var that = this;

			    $("#fileupload").fileupload({
				url : '/rest_collage_test',
				dataType : 'json'
			    }).bind('fileuploaddone', function (e, data) {
					that.uploadDone(e,data);
				});
				that.collageJSInit();
			return this;
		}
	});

	return CollageTestView;
});

