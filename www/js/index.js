$(document).ready(function() {
    // are we running in native app or in a browser?
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1 
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }
	
	//todo REMOVE
	//window.isphone = false;

    if( window.isphone ) {
        document.addEventListener("deviceready", app.onDeviceReady, false);
    } else {
        app.onDeviceReady();
    }
});