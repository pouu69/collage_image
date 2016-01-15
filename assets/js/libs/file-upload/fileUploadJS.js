var fileUploadJS = (function ($) {
    'use strict';
    //public method init
    var fileUpload = {
        init : init,
        createElem : createElem,
        upload : upload,
	done : done
    };

    return fileUpload;

    //priview elements
    var preview_wrap = null;
    var preview_img = null;
    var a_editor = null;
    //priview properties
    var properties = null;
    //priviwe image id (increments)
    var img_id = null;

    function init(properties){
        img_id = 1;
        this.properties = properties;
    };

    //after image upload, jquery draggable init
    function imgDroppable(img){
        $(img).draggable({
            cancel: "a.ui-icon", // clicking an icon won't initiate dragging
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move"
        });
    }
    //create preview elements
    function createElem(result){
        var properties = fileUploadJS.properties;
        // preview root node
        var preview_node = $('#img_list');

        // preview wrap element
        preview_wrap = $('<div></div>');
	preview_wrap.attr('class', 'col-xs-15');
        //preview_wrap.css({'display':'inline-block','position':'relative', 'margin-right': '5px' });
        preview_wrap.css({'position':'relative'});

        // preview image element
        preview_img = $(document.createElement(properties.preview_img_el));
        preview_img.css(properties.preview_img_css || {});
        preview_img.attr(properties.preview_img_attr || {});
        preview_img.attr('id','img_'+(img_id++));
        preview_img.attr('src',result.file_path);
	preview_img.attr('class','preview_img');

	// imgae remove elements
	var closeDiv = $('<div>x</div>');
	closeDiv.css({'position':'absolute','top':'4px', 'right':'10px', 'cursor':'pointer'});
	closeDiv.bind('click', function(e){
		$(e.target).parent().remove();
	});

        // elements append
        if(preview_wrap !== undefined){
            preview_node.append(preview_wrap);
            preview_wrap.append(preview_img);
            preview_wrap.append(closeDiv);
        }else{
            preview_node.append(preview_img);
        }
        preview_node.append(a_editor);
        imgDroppable(preview_img);

	return preview_img;
    }
	 function upload(idx,data){
		data.submit()
			.error(function (jqXHR, textStatus, errorThrown) {
			alert(jqXHR.responseJSON.error_msg);
		});
	}

	function done(e, data){
		var $img = fileUploadJS.createElem(data.result);
		if(featherEditor !== undefined){
			featherEditor.launch({
				image: $img.attr('id')|| null,
				url : $img.attr('src'),
				forceCropPreset: ['Square', '1:1'],
				tools: 'stickers',
				noCloseButton : true
			});
		}
	}
})(jQuery);
