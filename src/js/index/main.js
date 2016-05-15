//=====================================================================
// Global variables

// DOM
var $window = $(window);
var $canvas = $('#canvas');
var $map = $('#map');

// Google maps map object
var map;

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
