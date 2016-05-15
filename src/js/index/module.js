
//=====================================================================

// DOM
var $canvas = $('#canvas');
var $window = $(window);

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

// Google maps init callback
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 35.68, lng: 139.76 },
		zoom: 10
	});
}

