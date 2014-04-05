var app = {
    onDeviceReady: function() {
		app.addBindings();
        app.loadTokenList();
    },
	
	tokenList: [],
	selectedToken: "",
	selectedImage: "",
	
	addBindings: function() {
		
	},
	
	loadTokenList: function() {
		$.mobile.loading("show");
		$.ajax({
			//url: "http://mensa.ntacity.de/marburg/lahnberge/tokens",
			url: "http://mensa.ntacity.de/test.json",
			dataType: "jsonp",
			crossDomain: true,
			jsonpCallback: 'json'
		})
		.done(app.onTokenLoaded)
		.fail(app.onLoadFailed);
	},
	
	onTokenLoaded: function(data) {
		app.tokenList = [];
		$('#tokens').empty();
		
		$('#tokens').append('<li data-role="list-divider">Auswahl</li>');
		data.forEach(function(token) {
			var tokenID = app.tokenList.length;
			app.tokenList[tokenID] = token;
		
			var li = $('<li data-icon="camera"><a href="#photo" data-transition="slide" onClick="app.takePhoto(' + tokenID + ')">' + token + '</a></li>');
			$('#tokens').append(li);
		});
		
		if(app.tokenList.length == 0) {
			var li = $('<li data-role="list-divider"><em>- nichts vorhanden -</em></li>');
			$('#tokens').append(li);
		}
		
		$('#tokens').listview('refresh');
		$.mobile.loading("hide");
	},
	
	onLoadFailed: function(jqXHR, textStatus, errorThrown) {
		$.mobile.loading("hide");
		
		var error = "";
		switch(textStatus) {
			case "timeout":
				error = "Timeout";
				break;
			case "abort":
				error = "Abort";
				break;
			case "parsererror":
				error = "Parse Error";
				break;
			case "error":
			default:
				error = "Error";
		}
		
		$('#errorType').html(error);
		$('#errorText').html(errorThrown);
		$.mobile.changePage( "#dialog", { role: "dialog"} );
	},
	
	takePhoto: function(tokenID) {
		app.selectedToken = app.tokenList[tokenID];
		
		navigator.camera.getPicture(app.onPhotoSuccess, app.onPhotoFailed, {
			quality : 10,
			destinationType : Camera.DestinationType.FILE_URI,
			sourceType : Camera.PictureSourceType.CAMERA,
			allowEdit : true,
			encodingType: Camera.EncodingType.PNG,
			targetWidth: 400,
			targetHeight: 400,
			saveToPhotoAlbum: false,
			correctOrientation: true,
			cameraDirection: Camera.Direction.BACK
		});
	},
	
	onPhotoSuccess: function(imageURI) {
		app.selectedImage = imageURI;
		$.mobile.changePage( "#upload");
		app.uploadImage();
	},
	
	onPhotoFailed: function(message) {
		$('#errorType').html("Error");
		$('#errorText').html(message);
		$.mobile.changePage( "#dialog", { role: "dialog"} );
	},
	
	uploadImage: function() {
		var params = {};
		params.meal = app.selectedToken;
	
		var options = new FileUploadOptions();
		options.fileKey = "image";
		options.fileName = fileURI.substr(fileURI.lastIndexOf('/')+1);
		options.mimeType = "image/png";
		options.params = params;
	
		var fileTransfer = new FileTransfer();
		fileTransfer.upload(
			app.selectedImage,
			encodeURI("http://mensa.ntacity.de/uploadImage.php"),
			onUploadSuccess,
			onUploadFailed,
			options,
			true
		);

	},
	
	onUploadSuccess: function() {
		$('#uploadSuccess1').html('✔');
		$('#uploadSuccess2').html('Upload successful!');
		$('#uploadSuccess3').html('✔');
	},
	
	onUploadFailed: function() {
		$('#uploadSuccess1').html('✘');
		$('#uploadSuccess2').html('Upload failed!');
		$('#uploadSuccess3').html('✘');
	}
};