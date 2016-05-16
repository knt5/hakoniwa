//=====================================================================
// Hakoniwa

var hakoniwa = (function(parent) {
	
	//-----------------------------------------------------------------
	// var
	
	// config
	var dsm = config.dsm;
	var size = config.cube.size;
	var work = config.work;
	
	// three.js
	var camera, scene, renderer;
	
	//-----------------------------------------------------------------
	function isReady() {
		if (
			dsm.image &&
			dsm.maskImage
		) {
			return true;
		}
		return false;
	}
	
	//-----------------------------------------------------------------
	function init() {
		var x, y;
		var image;
		
		//-------------------------------------------------
		if (!isReady()) {
			return;
		}
		
		//-------------------------------------------------
		// Copy to work canvas
		image = dsmContext.getImageData(0, 0, work.width, work.height);
		workContext.fillStyle = '#000';
		workContext.fillRect(0, 0, work.width, work.height);
		workContext.putImageData(image, 0, 0);
		
		//-------------------------------------------------
		// three.js
		
		// scene
		scene = new THREE.Scene();
		
		// camera
		camera = new THREE.PerspectiveCamera(45, $stage.width() / $stage.height(), 1, 1000);
		camera.position.set(200, 200, 200);
		
		// renderer
		renderer = new THREE.WebGLRenderer();
		renderer.setSize($stage.width(), $stage.height());
		$stage.append(renderer.domElement);
		
		// light
		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(0, 0.7, 0.7);
		scene.add(directionalLight);
		
		//-------------------------------------------------
		// Draw maps
		for (y=0; y<work.height; y++) {
			for (x=0; x<work.width; x++) {
				
				var geometry = new THREE.CubeGeometry(size, size, size);
				var material = new THREE.MeshLambertMaterial({  // MeshPhongMaterial
					color: 0xff0000
				});
				var mesh = new THREE.Mesh(geometry, material);
				
				mesh.position.x = x * size;
				mesh.position.y = y * size;
				mesh.position.z = 0;
				mesh.rotation.x = Math.random();
				mesh.rotation.y = Math.random();
				mesh.rotation.z = Math.random();
				
				scene.add(mesh);
			}
		}
		
		// animate
		animate();
	}
	
	//-----------------------------------------------------------------
	function animate() {
		requestAnimationFrame(animate);
		
		camera.rotation.z += 0.01;
		
		renderer.render(scene, camera);
	}
	
	//-----------------------------------------------------------------
	return {
		init: init
	};
	
})();
