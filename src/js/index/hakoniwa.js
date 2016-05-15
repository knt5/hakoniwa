//=====================================================================
// Hakoniwa

var hakoniwa = (function() {
	
	var x, y;
	var image;
	
	// DSM
	var dsm = config.dsm;
	
	// work canvas config
	var work = config.work;
	
	function isReady() {
		if (
			dsm.image &&
			dsm.maskImage
		) {
			return true;
		}
		return false;
	}
	
	function init() {
		if (!isReady()) {
			return;
		}
		
		// Copy to work canvas
		image = dsmContext.getImageData(0, 0, work.width, work.height);
		workContext.fillStyle = '#000';
		workContext.fillRect(0, 0, work.width, work.height);
		workContext.putImageData(image, 0, 0);
		
		// draw maps
		
		
		
		
	}
	
	return {
		init: init
	};
	
})();
