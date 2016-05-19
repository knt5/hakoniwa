//=====================================================================
// Hakoniwa

var hakoniwa = (function() {
	
	//-----------------------------------------------------------------
	// var
	
	// config
	var dsm = config.dsm;
	var size = config.cube.size;
	var work = config.work;
	var gui = config.gui;
	
	// three.js
	var scene;
	var trackball;
	var pointLights = [];
	var pointLightRadius = 70;
	//var cubeCamera;
	
	// camera position
	var radius = 145;
	var radian = -1;
	//var theta = 0;
	
	// cubes
	var cubes = [];
	
	// auto pilot status
	var autoPilot = {
		up: false,
		down: false,
		right: true,
		left: false,
		turned: {
			north: 0,
			west: 0
		},
		reachedTop: false,
		prevLeft: false
	};
	
	//-----------------------------------------------------------------
	// dat.GUI
	var datGui = new dat.GUI();
	datGui.add(gui, 'autoPilotEnabled');
	datGui.add(gui, 'autoPilotSpeed', 0.5, 30);
	datGui.add(gui, 'elevationScale', 1, 10);
	$datGui.append(datGui.domElement);
	
	//-----------------------------------------------------------------
	function isReady() {
		if (
			dsm.image &&
			dsm.maskImage &&
			typeof google !== 'undefined'
		) {
			return true;
		}
		return false;
	}
	
	//-----------------------------------------------------------------
	// Get work x on dsm canvas
	function getWorkDsmX() {
		return (work.west - dsm.west) / dsm.pixelSize;
	}
	
	// Get work y on dsm canvas
	function getWorkDsmY() {
		return (dsm.north - work.north) / dsm.pixelSize;
	}
	
	//-----------------------------------------------------------------
	function getElevationColor(elevation, water) {
		var colors = [
			// green
			0x98fb98,
			0x9acd32,
			0x32cd32,
			
			// orange
			//0xf5deb3,
			0xdeb887,
			0xdaa520,
			0xcd853f,
			0xd2691e,
			0xa0522d,
			0x8b4513,
			0x800000
		];
		
		var minElevation = 20;
		var step = 10;
		
		if (water !== 0) {
			return 0x38a1db;
		} else {
			for (var i = 0; i<colors.length; i++) {
				if (elevation < i * step + minElevation) {
					return colors[i];
				}
			}
			return 0x800000;
		}
	}
	
	//-----------------------------------------------------------------
	// Copy from dsm canvas to work canvas
	function updateWorkCanvas() {
		var image = dsmContext.getImageData(getWorkDsmX(), getWorkDsmY(), work.width, work.height);
		workContext.fillStyle = '#000';
		workContext.fillRect(0, 0, work.width, work.height);
		workContext.putImageData(image, 0, 0);
		
		if (dsm.maskImage) {
			var maskImage = maskContext.getImageData(getWorkDsmX(), getWorkDsmY(), work.width, work.height);
			workMaskContext.fillStyle = '#000';
			workMaskContext.fillRect(0, 0, work.width, work.height);
			workMaskContext.putImageData(maskImage, 0, 0);
		}
	}
	
	//-----------------------------------------------------------------
	// Init & Create cubes
	function createCubes() {
		var x, y;
		
		// init cubes
		cubes = [];
		
		// create mesh
		for (y=0; y<work.height; y++) {
			cubes.push([]);
			for (x=0; x<work.width; x++) {
				// Create cube
				//var geometry = new THREE.CubeGeometry(size, size, size);
				var geometry = new THREE.BoxGeometry(size, size, size);
				var material = new THREE.MeshStandardMaterial();
				//var material = new THREE.MeshBasicMaterial({envMap: cubeCamera.renderTarget});
				var mesh = new THREE.Mesh(geometry, material);
				
				// Avoid auto update
				mesh.matrixAutoUpdate = false;
				mesh.rotationAutoUpdate = false;
				
				// position
				mesh.position.x = (x - work.width / 2) * size;
				mesh.position.z = (y - work.height / 2) * size;
				
				// add
				scene.add(mesh);
				
				// add cubes
				cubes[y].push(mesh);
			}
		}
	}
	
	//-----------------------------------------------------------------
	// Update style of cubes
	function updateCubeStyle() {
		var x, y;
		var workImageData = workContext.getImageData(0, 0, work.width, work.height);
		var workMaskImageData = workMaskContext.getImageData(0, 0, work.width, work.height);
		for (y=0; y<work.height; y++) {
			for (x=0; x<work.width; x++) {
				// Get elevation
				var elevation = workImageData.data[x * 4 + y * work.width * 4];
				
				// Get water status
				var water = workMaskImageData.data[x * 4 + y * work.width * 4];
				
				// Get cube mesh
				var mesh = cubes[y][x];
				
				// Set color
				mesh.material.color.setHex(getElevationColor(elevation, water));
				
				// Set scale
				mesh.scale.y = elevation / 3 * (gui.elevationScale * 0.1);
				
				// Set position
				mesh.position.y = elevation / 2 * (gui.elevationScale * 0.1);
				
				// Update
				mesh.updateMatrix();
			}
		}
	}
	
	//-----------------------------------------------------------------
	function isPoorDevice() {
		// TODO: check GPU, OS, ...
		if ($stage.width() > 320) {
			return false;
		}
		return true;
	}
	
	//-----------------------------------------------------------------
	// [public] Update hakoniwa
	// if config.work is changed, call me.
	// (memo: changeDsm())
	function update() {
		updateWorkCanvas();
		updateCubeStyle();
		mapUtil.updateWorkAreaPosition();
	}
	
	//-----------------------------------------------------------------
	// [public]
	function init() {
		if (!isReady()) {
			return;
		}
		
		// Add polygons to map
		mapUtil.addPolygons();
		
		// Copy to work canvas
		updateWorkCanvas();
		
		//-------------------------------------------------
		// [3D] Basic
		
		// scene
		scene = new THREE.Scene();
		scene.autoUpdate = false;
		scene.fog = new THREE.Fog(0xffffff, 80, 400);
		
		// camera
		camera = new THREE.PerspectiveCamera(45, $stage.width() / $stage.height(), 1, 1000);
		camera.position.set(radius/1.7, radius/1.4, radius);
		camera.lookAt(scene.position);
		
		// renderer
		renderer = new THREE.WebGLRenderer();
		renderer.setSize($stage.width(), $stage.height());
		$stage.append(renderer.domElement);
		
		// trackball
		trackball = new THREE.TrackballControls(camera, $stage.get(0));
		trackball.staticMoving = true;
		trackball.dynamicDampingFactor = 1.0;
		
		//-------------------------------------------------
		// [3D] Light
		
		// directionalLight
		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(0, 100, 20);
		directionalLight.castShadow = true;
		scene.add(directionalLight);
		
		// ambientLight
		var ambientLight;
		if (isPoorDevice()) {
			ambientLight = new THREE.AmbientLight(0xffffff);
			scene.add(ambientLight);
		} else {
			ambientLight = new THREE.AmbientLight(0x999999);
			scene.add(ambientLight);
		}
		
		// point light
		if (!isPoorDevice()) {
			var pointLightSphere = new THREE.SphereGeometry( 0.5, 16, 8 );

			pointLights.push(new THREE.PointLight(0xff8000, 3, 150));
			//pointLights[0].castShadow = true;
			pointLights[0].position.set(pointLightRadius, 20, pointLightRadius);
			pointLights[0].add(new THREE.Mesh(pointLightSphere, new THREE.MeshBasicMaterial({color: 0xff8000})));
			scene.add(pointLights[0]);

			pointLights.push(new THREE.PointLight(0xffff80, 2, 150));
			//pointLights[1].castShadow = true;
			pointLights[1].position.set(pointLightRadius, 20, pointLightRadius);
			pointLights[1].add(new THREE.Mesh(pointLightSphere, new THREE.MeshBasicMaterial({color: 0xffff80})));
			scene.add(pointLights[1]);
		}
		
		//-------------------------------------------------
		// Reflection
		//cubeCamera = new THREE.CubeCamera( 1, 1000, 256 );
		//cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
		//scene.add(cubeCamera);
		
		//-------------------------------------------------
		// [3D] Helper
		
		// axis
		var axisHelper = new THREE.AxisHelper(120);
		scene.add(axisHelper);
		
		// grid
		var gridHelper = new THREE.GridHelper(100, 5);
		scene.add(gridHelper);
		
		// light shadow
		//var directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
		//scene.add(directionalLightShadowHelper);
		
		// light
		var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
		scene.add(directionalLightHelper);
		
		//-------------------------------------------------
		// [3D] Mesh
		
		// Create cubes
		createCubes();
		
		// Set cube style
		updateCubeStyle();
		
		//-------------------------------------------------
		// [3D] Start animation
		animate();
	}
	
	//-----------------------------------------------------------------
	// Auto pilot
	function updateWorkAreaPositionByAutoPilot() {
		if (!gui.autoPilotEnabled) {
			return;
		}
		
		if (autoPilot.up) {
			work.north += dsm.pixelSize * gui.autoPilotSpeed;
			
			// reached dsm top
			if (work.north >= dsm.north) {
				autoPilot.reachedTop = true;
			}
			
			// moved enough
			if (work.north >= dsm.north ||
				work.north >= autoPilot.turned.north + dsm.pixelSize * work.height
			) {
				autoPilot.up = false;
				work.north -= dsm.pixelSize * gui.autoPilotSpeed;
				
				if (autoPilot.prevLeft) {
					autoPilot.right = true;
					autoPilot.prevLeft = false;
				} else {
					autoPilot.left = true;
					autoPilot.prevLeft = true;
				}
			}
			
		} else if (autoPilot.down) {
			work.north -= dsm.pixelSize * gui.autoPilotSpeed;
			
			// moved enough
			if (work.north - dsm.pixelSize * work.height <= dsm.south) {
				autoPilot.down = false;
				work.north += dsm.pixelSize * gui.autoPilotSpeed;
				
				if (autoPilot.prevLeft) {
					autoPilot.right = true;
					autoPilot.prevLeft = false;
				} else {
					autoPilot.left = true;
					autoPilot.prevLeft = true;
				}
			}
			
		} else if (autoPilot.right) {
			work.west += dsm.pixelSize * gui.autoPilotSpeed;
			
			if (work.west + dsm.pixelSize * work.width >= dsm.east) {
				autoPilot.right = false;
				work.west -= dsm.pixelSize * gui.autoPilotSpeed;
				
				if (autoPilot.reachedTop) {
					autoPilot.down = true;
					autoPilot.reachedTop = false;
				} else {
					autoPilot.up = true;
				}
				autoPilot.turned.north = work.north;
				autoPilot.turned.west = work.west;
			}
			
		} else if (autoPilot.left) {
			work.west -= dsm.pixelSize * gui.autoPilotSpeed;
			
			if (work.west <= dsm.west) {
				autoPilot.left = false;
				work.west += dsm.pixelSize * gui.autoPilotSpeed;
				
				if (autoPilot.reachedTop) {
					autoPilot.down = true;
					autoPilot.reachedTop = false;
				} else {
					autoPilot.up = true;
				}
				autoPilot.turned.north = work.north;
				autoPilot.turned.west = work.west;
			}
		}
	}
	
	//-----------------------------------------------------------------
	function render() {
		//theta += 1;
		//camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
		//camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
		//camera.lookAt(scene.position);
		
		if (pointLights.length >= 2) {
			radian += 0.1;
			pointLights[0].position.x = pointLightRadius * Math.sin(radian);
			pointLights[0].position.y = pointLightRadius / 2 * (Math.sin(radian * 0.3) + 1);
			pointLights[0].position.z = pointLightRadius * Math.cos(radian * 0.8);
			pointLights[1].position.x = pointLightRadius * Math.sin(-radian * 0.9);
			pointLights[1].position.y = pointLightRadius / 2 * (Math.sin(-radian * 0.2) + 1);
			pointLights[1].position.z = pointLightRadius * Math.cos(-radian);
		}
		
		if (gui.autoPilotEnabled) {
			updateWorkAreaPositionByAutoPilot();
			update();
		}
		
		//cubeCamera.updateCubeMap( renderer, scene );
		
		trackball.update();
		
		scene.updateMatrixWorld();
		
		renderer.render(scene, camera);
	}
	
	//-----------------------------------------------------------------
	function animate() {
		requestAnimationFrame(animate);
		render();
	}
	
	//-----------------------------------------------------------------
	return {
		init: init,
		update: update
	};
	
})();
