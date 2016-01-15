                    var collageJS = {
                        init: function(options){
                            this.$collage = $(options.collageContainer);
                            this.$tabsSelector = $(options.tabsSelector);
                            this.$imgList = $(options.imgList);
                            this.$generateLink = $(options.generateLink);
                            this.$resultImg = $(options.resultImg);
                            this.options = options;
                            
                            var self = this;
                            
                            // Set the size of the containers
                            this.$collage.css('height', options.height);
                            this.$collage.css('width', options.width);
                            
                            // Generate all the canvases.
                            this.generateCanvases();
                            
                            // Tabs
                            $(this.options.tabSelector+' a').click(function (e) {
                                e.preventDefault()
                                $(this).tab('show')
                            });
                            // Clear the canvases when switching tabs
                            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                                var target = $(e.target).attr("href");
                                $('canvas', $(target)).each(function(){
                                    self.clearCanvas($(this)[0]);
                                });
                            });
                            
                            // Show an X over the canvas on hover
                            // First, create the X div
                            this.$crossDiv = $('<div>', {id: "collage_cross"});
                            this.$crossDiv.css({'display': "none", 'position': "absolute"});
                            this.$crossDiv.text('X');
                            $('body').append(this.$crossDiv);
                            // Add the hover on and off callbacks
                            /*
                            $('canvas', this.$collage).hover(
                                function(event){
                                    self.$crossDiv.css({'top': $(event.target).offset().top + 5, 'left': $(event.target).offset().left + parseInt($(event.target).css('width')) - 15});
                                    self.$crossDiv.show();
                                },
                                function(event){
                                    self.$crossDiv.hide();
                                }
                            );
				*/
                            

                            // On click, remove the image (clear the canvas)
                            $('img', this.$collage).dblclick(function(event){
				event.target.src = '';
//                                self.clearCanvas(event.target);
                            });
                            // images draggable
                            $('img', this.$imgList).draggable({
                                cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                                revert: "invalid", // when not dropped, the item will revert back to its initial position
                                containment: "document",
                                helper: "clone",
                                cursor: "move"
                            });

                            // images draggable
                            $('img', this.$collage).draggable({
                                cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                                revert: "invalid", // when not dropped, the item will revert back to its initial position
                                containment: "document",
                                helper: "clone",
                                cursor: "move"
                            });


                           
                            // canvases droppable
                            /*
                            $('img', this.$collage).droppable({
                              accept: this.options.imgList+" > div > img",
                              activeClass: "ui-state-highlight",
                              drop: function( event, ui ) {
                                self.onImageDrop(event, ui);
                              }
                            });
                           */ 
			    $('img', this.$collage).droppable({
                              accept: function(e){
					// only using, if exists class name = 'ui-draggable'
					if(e.attr('class').indexOf('ui-draggable') !== -1){
						return true;
					}
					return false;
				},
                              activeClass: "ui-state-highlight",
                              drop: function( event, ui ) {
                                self.onImageDrop(event, ui);
                              }
                            });
                            

                            // Generate the image on click
                            this.$generateLink.click(function(){
                                self.generateImage();
                            });
                        },
                        
                        clearCanvas: function(canvas){
                            var ctx = canvas.getContext("2d");
                            ctx.clearRect(0,0, canvas.width, canvas.height);  
                        },
                        
                        generateCanvases: function(){
                            var first = true;
                            var i = 0;
                            
                            var self = this;
                            
                            // First, generate each layout's canvases.
                            $.each(this.options.layouts, function(index, layout){
                                var $container = $('<div>', {id: 'layout'+i, class: 'tab-pane'});
                                
                                $.each(layout.layout, function(index2, div){
                                    var $floatedDiv = $('<div>');
                                    $floatedDiv.css('float', 'left');
                                    
                                    $.each(div.replace(' ', '').split('-'), function(index3, canv){
                                        var widthRatio = canv.split('/')[0] / 100;
                                        var heightRatio = canv.split('/')[1] / 100;
                                        
                                        var $canvas = $('<img>');
                                        $canvas.attr('src', '');
                                        $canvas.css('width', self.options.width*widthRatio);
                                        $canvas.css('height', self.options.height*heightRatio);
                                        $floatedDiv.append($canvas);
                                        if(layout.type == "col"){
                                            $floatedDiv.append("<br>");
                                        }
                                    });
                                    $container.append($floatedDiv);
                                });
                                self.$collage.append($container);
                                
                                var $li = $('<li>');
                                var $a = $('<a>', {"href": '#layout'+i, "data-toggle": 'tab'});
                                $a.text(layout.description);
                                $li.append($a);
                                
                                if(first){
                                    $li.addClass('active');
                                    $container.addClass('active');
                                    first = false;
                                }
                                
                                self.$tabsSelector.append($li);
                                i++;
                            });
                            
                            // Secondly, create the "final" canvas.
                            var $final = $("<canvas>", {id: "collage_final_render"});
                            $final.attr('width', this.options.width);
                            $final.attr('height', this.options.height);
                            $final.css('display', 'none');
                            // The position of this doesn't matter, let's put in at the end of body
                            $('body').append($final);
                        },
                        
                        onImageDrop: function(event, ui){
                            var img = ui.draggable[0];
				// check drop elements 
				if(ui.draggable.attr('class').indexOf('preview_img') !== -1){
					var $canvas= $("<canvas>", {id: "fake_canvas"});
					$canvas.attr('width', event.target.clientWidth);
					$canvas.attr('height', event.target.clientHeight);
				
					var ctx = $canvas[0].getContext('2d');
					var canvas = ctx.canvas ;
					ctx.drawImage(img, 0,0, canvas.width, canvas.height);
					var src = canvas.toDataURL();	
				    // Draw the image onto the canvas
					img.crossOrigin = "Anonymous";
					$(event.target).attr('src', src);
					$canvas.remove();
					$('#fake_canvas').remove();
				}else{
					var nowImgSrc = event.target.currentSrc;
					var nextImgSrc = img.currentSrc;
					event.target.src = (nextImgSrc === '' ? "" : nextImgSrc);
					img.src = (nowImgSrc === '' ? "" : nowImgSrc);
				}
                        },
                        
                        generateImage: function(){
                            var contextFinal = document.getElementById('collage_final_render').getContext("2d");
                            // Clear the canvas
                            contextFinal.clearRect(0,0, contextFinal.canvas.width, contextFinal.canvas.height);
                            
                            //Setup some variables
                            var first = true;
                            var lastPos = null;
                            var offset = null;
                            // Loop all the active canvases to render the final one
                            $('.active img', this.$collage).each(function(){
                                var canvas = $(this);
                                
                                if(first){
                                    offset = canvas.position();
                                    first = false;
                                }
                                contextFinal.drawImage(canvas[0], canvas.position().left-offset.left, canvas.position().top-offset.top);
                                lastPost = canvas.position();
                            });
                            
                            // Get the image data from the final canvas and set it as URL for our image.
                            var data = contextFinal.canvas.toDataURL();
				this.$resultImg.attr('src', data); 
                        }
                    };
