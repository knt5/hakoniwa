//=====================================================================
// Maps

// Google maps init callback
function initMap() {
	map = new google.maps.Map($map.get(0), {
		center: { lat: 35.68, lng: 139.76 },
		zoom: 10
	});
}
