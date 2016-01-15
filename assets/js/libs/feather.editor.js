	var featherEditor = new Aviary.Feather({
		apiKey: '1234567',
		language: 'en',
		onSaveButtonClicked : function(imgID){
			var img = document.getElementById(imgID);
			img.setAttribute('crossOrigin','anonymous');
		},
		    onError: function(errorObj){
			console.log(errorObj);
		    }
	});

