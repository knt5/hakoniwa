//=====================================================================
// Hakoniwa

var hakoniwa = (function() {
	
	var x, y;
	var image;
	
	// DSM
	var dsm = config.dsm;
	
	// work canvas config
	var work = config.work;
	
	/*
	// Lat lng
	var lat = dsm.startLat;
	var lng = dsm.startLng;
	
	//
	for(y = 0; y<dsm.image.height; y++) {
		for(x = 0; x<dsm.image.width; x++) {
			lng = dsm.startLng + dsm.pixelSize * x;
		}
		lat = dsm.startLat + dsm.pixelSize * y;
	}
	*/
	
	function isReady() {
		if (
			config.dsm.image &&
			config.dsm.maskImage
		) {
			return true;
		}
		return false;
	}
	
	function init() {
		if (!isReady()) {
			return;
		}
		
		// copy
		image = dsmContext.getImageData(0, 0, work.width, work.height);
		workContext.fillStyle = '#000';
		workContext.fillRect(0, 0, work.width, work.height);
		workContext.putImageData(image, 0, 0);
		console.log(image);
	}
	
	
	
	
	
	
	
	
	
	
	return {
		init: init
	};
	
})();
