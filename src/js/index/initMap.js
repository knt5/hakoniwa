// Google maps init callback
function initMap() {
	var dsm = config.dsm;
	var work = config.work;
	
	// create map
	map = new google.maps.Map($map.get(0), {
		//center: { lat: dsm.south + (dsm.north - dsm.south) / 2, lng: dsm.west + (dsm.east - dsm.west) / 2 },
		center: { lat: work.north, lng: work.west },
		zoom: 12
	});
	
	// ground overlay
	var dsmBounds = {
		north: dsm.north,
		south: dsm.south,
		east: dsm.east,
		west: dsm.west
	};
	var elevationOverlay = new google.maps.GroundOverlay(dsm.path, dsmBounds);
	elevationOverlay.setOpacity(0.8);
	elevationOverlay.setMap(map);
	
	// init hakoniwa
	hakoniwa.init();
}
