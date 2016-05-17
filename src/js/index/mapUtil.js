var mapUtil = (function() {
	
	// config
	var dsm = config.dsm;
	var work = config.work;
	var workPolygon;
	
	//=================================================================
	function addPolygons() {
		
		//-----------------------------------------------------
		// Add dsm area rectangle
		
		var dsmArea = [
			{lat: dsm.south, lng: dsm.east},
			{lat: dsm.north, lng: dsm.east},
			{lat: dsm.north, lng: dsm.west},
			{lat: dsm.south, lng: dsm.west}
		];
		
		new google.maps.Polygon({
			map: map,
			paths: dsmArea,
			strokeColor: '#666666',
			strokeOpacity: 1,
			strokeWeight: 2,
			fillColor: '#ffcccc',
			fillOpacity: 0.2,
			draggable: false,
			geodesic: true
		});
		
		//-----------------------------------------------------
		// Add work area rectangle
		workPolygon = new google.maps.Polygon({
			map: map,
			paths: getWorkArea(),
			strokeColor: '#ff0000',
			strokeOpacity: 1,
			strokeWeight: 2,
			fillColor: '#ff0000',
			fillOpacity: 0.3,
			draggable: true,
			geodesic: true
		});
		
		workPolygon.addListener('dragend', function() {
			var point = workPolygon.getPath().getAt(0);
			work.north = point.lat();
			work.west = point.lng();
			console.log(work);
			
			hakoniwa.update();
		});
	}
	
	//=================================================================
	function getWorkArea() {
		var width = dsm.pixelSize * work.width;
		var height = dsm.pixelSize * work.height;
		var workNorth = work.north;
		var workWest = work.west;
		
		var workArea = [
			{lat: workNorth, lng: workWest},
			{lat: workNorth, lng: workWest + width},
			{lat: workNorth - height, lng: workWest + width},
			{lat: workNorth - height, lng: workWest}
		];
		
		return workArea;
	}
	
	//=================================================================
	function updateWorkAreaPosition() {
		map.setCenter({lat: work.north, lng: work.west});
		workPolygon.setPath(getWorkArea());
	}
	
	//=================================================================
	return {
		addPolygons: addPolygons,
		updateWorkAreaPosition: updateWorkAreaPosition
	};
})();
