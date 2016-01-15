<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Collage Test</title>

        <link href="/assets/css/bootstrap.min.css" rel="stylesheet" type="text/css">
        <link href="/assets/css/bootstrap-theme.css" rel="stylesheet" type="text/css">

        <link href="/assets/css/collage_test.css" rel="stylesheet" type="text/css">
        <link href="/assets/css/fileinput.min.css" rel="stylesheet" type="text/css">
    </head>
        <body>
        <div class="container">

            <div class="row">
                <div class="col-xs-60">
                    <h2>How to use</h2>
                    <p>Upload your <strong>Image</strong>.</p>
                    <p>Choose your <strong>layout</strong>.</p>
                    <p><strong>Drag and drop</strong> images from the bottom to the top spaces.</p>
                    <p><strong>Click</strong> on a space to remove the associated image.</p>
                    <p>Click on <strong>Make image</strong> to generate the final image.</p>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-60 file_upload_div">
                    <span class="btn btn-success fileinput-button">
                        <i class="glyphicon glyphicon-plus"></i>
                        <span>Add files...</span>
                        <!-- The file input field used as target for the file upload widget -->
                        <input id="fileupload" type="file" name="files">
                    </span>
                    <!-- The container for the uploaded files -->
                    <div id="preview" class="col-xs-60"></div>
                </div>
            </div>
        	<div class="row">
                    <div class="col-xs-60">
                        <ul class="nav nav-pills" id="layouts">
                        </ul>
                    </div>
                    <div id="collage" class="tab-content">
                    </div>
                    <div class="clearfix"></div>
                    <br><br>
                    <div id="img_list" class="col-xs-60">
                    </div>
                    <br>
        		<div  class="col-xs-60">
        		    <button id="generate">Make image</button><br /><br />
        		</div>
        		
        		<div  class="col-xs-60" style="margin-bottom: 50px;">
        		    <img id="result">
        		</div>
        	</div>
        </div>
                <script data-main="/assets/js/controllers/main.js" src="/assets/js/libs/require-2.1.8.min.js"></script>

    </body>
</html>