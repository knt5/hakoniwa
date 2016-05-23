//=====================================================================
// Global variables

// DOM
var $window = $(window);
var $stage = $('#stage');
var $dsmCanvas = $('#dsm-canvas');
var $maskCanvas = $('#mask-canvas');
var $workCanvas = $('#work-canvas');
var $workMaskCanvas = $('#work-mask-canvas');
var $datGui = $('#dat-gui');
var $map = $('#map');
var $message = $('#message');
var $error = $('#error');

// Google maps map object
var map;

// three.js parameters
var camera, renderer;

// Canvas context
var dsmContext = $dsmCanvas.get(0).getContext('2d');
var maskContext = $maskCanvas.get(0).getContext('2d');
var workContext = $workCanvas.get(0).getContext('2d');
var workMaskContext = $workMaskCanvas.get(0).getContext('2d');

//=====================================================================
// Initialize & register event hanlders

$(document).ready(function() {
	//=====================================================================
	// Event handler
	
	// On window resize
	function onResize() {
		var height = $window.height();
		
		// Fix size on Facebook WebView
		if (window.navigator.userAgent.toLowerCase().indexOf('fban/fbios;fbav') != -1 &&
			$window.width() <= 414
		) {
			height -= 100;
		}
		
		// Change stage height (width is auto)
		$stage.height(height);
		
		// Update three.js
		if (camera && renderer) {
			camera.aspect = $stage.width() / $stage.height();
			camera.updateProjectionMatrix();
			renderer.setSize($stage.width(), $stage.height());
		}
	}
	$window.on('resize', onResize);
	
	//=====================================================================
	// Initialize
	
	//-----------------------------------------------
	// Initialize 3D canvas div size
	onResize();
	
	//-----------------------------------------------
	// Initialize work canvas
	$workCanvas.width(config.work.width);
	$workCanvas.height(config.work.height);
	$workCanvas.prop('width', config.work.width);
	$workCanvas.prop('height', config.work.height);
	
	$workMaskCanvas.width(config.work.width);
	$workMaskCanvas.height(config.work.height);
	$workMaskCanvas.prop('width', config.work.width);
	$workMaskCanvas.prop('height', config.work.height);
	
	//-----------------------------------------------
	// Load default DSM
	
	// DSM
	var dsmImage = new Image();
	dsmImage.src = config.dsm.path;
	dsmImage.onload = function() {
		var w = dsmImage.width;
		var h = dsmImage.height;
		$dsmCanvas.width(w);
		$dsmCanvas.height(h);
		$dsmCanvas.prop('width', w);
		$dsmCanvas.prop('height', h);
		dsmContext.drawImage(dsmImage, 0, 0);
		config.dsm.image = dsmImage;
		hakoniwa.init();
	};
	
	// DSM mask
	var maskImage = new Image();
	maskImage.src = config.dsm.maskPath;
	maskImage.onload = function() {
		var w = maskImage.width;
		var h = maskImage.height;
		$maskCanvas.width(w);
		$maskCanvas.height(h);
		$maskCanvas.prop('width', w);
		$maskCanvas.prop('height', h);
		maskContext.drawImage(maskImage, 0, 0);
		config.dsm.maskImage = maskImage;
		hakoniwa.init();
	};
});
