//=====================================================================
// Hakoniwa

var hakoniwa = (function() {
	
	//-----------------------------------------------------------------
	// var
	
	// config
	var dsm = config.dsm;
	var dotSize = config.dot.size;
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
		var element;
		var object;
		
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
		
		// camera
		camera = new THREE.PerspectiveCamera(45, $stage.width() / $stage.height(), 1, 1000);
		camera.position.set(200, 200, 200);
		//camera.position.set(20, 20, 20);
		
		// scene
		scene = new THREE.Scene();
		
		// material
		var material = new THREE.MeshBasicMaterial({
			color: 0x999999,
			wireframe: true,
			wireframeLinewidth: 1,
			side: THREE.DoubleSide
		});
		
		//-------------------------------------------------
		// Draw maps
		for (y=0; y<work.height; y++) {
			for (x=0; x<work.width; x++) {
				// Create element
				element = document.createElement('div');
				element.className = 'dot';
				
				// Create object
				object = new THREE.CSS3DObject(element);
				object.position.x = x * dotSize;
				object.position.y = y * dotSize;
				object.position.z = 0;
				object.rotation.x = Math.random();
				object.rotation.y = Math.random();
				object.rotation.z = Math.random();
				
				// Add
				scene.add(object);
			}
		}
		
		//-------------------------------------------------
		// three.js
		
		// renderer
		renderer = new THREE.CSS3DRenderer();
		renderer.setSize($stage.width(), $stage.height());
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = 0;
		$stage.append(renderer.domElement);
		
		// animate
		animate();
	}
	
	//-----------------------------------------------------------------
	function animate() {
		requestAnimationFrame( animate );
		renderer.render(scene, camera);
		
		camera.rotation.order = "ZYX";
		camera.rotation.z += 0.1;
	}
	
	return {
		init: init
	};
	
})();
