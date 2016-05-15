//=====================================================================
// Global variables

// DOM
var $window = $(window);
var $canvas = $('#canvas');
var $map = $('#map');
var $message = $('#message');

// Google maps map object
var map;

// Config
var config = {
	// GeoTiff
	defaultGeoTiff: 'assets/dsm/N035E139.tif',
	
	// Default GeoTiff mask
	defaultGeoTiffMask: 'assets/dsm/N035E139.mask.tif'
};

//=====================================================================
// Event handler

// On window resize
function onResize() {
	$canvas.height($window.height());
}
$window.on('resize', onResize);

//=====================================================================
// Initialize

// Init 3D canvas div size
onResize();

//=====================================================================
// Load default GeoTiff from online
$.ajax(config.defaultGeoTiff, {
	success: function(data) {
		
		/*
		var tiff = GeoTIFF.parse(data);
		var image = tiff.getImage();
		var rasters = image.readRasters(function() {
			var canvas = document.getElementById('plot');
			var plot = new plotty.plot({
				canvas: canvas,
				data: rasters[0],
				width: image.getWidth(),
				height: image.getHeight(),
				domain: [0, 256],
				colorScale: 'viridis'
			});
			plot.render();
		});
		*/
		//console.log(image);
		
	},
	error: function() {
		$message.text('Load failed. Please reload.');
	}
});
