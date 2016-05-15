
//=====================================================================

// DOM
var $window = $(window);
var $canvas = $('#canvas');
var $map = $('#map');

// Google maps map object
var map;

//=====================================================================

// on window resize
function onResize() {
	$canvas.height($window.height());
}
$window.on('resize', onResize);

// init
onResize();

//=====================================================================
// maps

// Google maps init callback
function initMap() {
	map = new google.maps.Map($map.get(0), {
		center: { lat: 35.68, lng: 139.76 },
		zoom: 10
	});
}

//=====================================================================
// 3D










