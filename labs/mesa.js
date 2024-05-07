import * as THREE from 'three';

var camera, scene, renderer;

var material;

function createTable(x, y, z) {
  'use strict';
  var table = new THREE.Object3D();
  material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

  addTableTop(table, 0, 0, 0);
  scene.add(table);

}

function render() {
  'use strict';
  renderer.render(scene, camera);
}

function createCamera() {
  'use strict';
  // PerspectiveCamera(fov, aspect, near, far)
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

  camera.position.x = 50;
  camera.position.y = 50;
  camera.position.z = 50;
  camera.lookAt(scene.position);
}

function createScene() {
  'use strict';
  scene = new THREE.Scene();
  scene.add(new THREE.AxesHelper(10));


}

function init() {
  'use strict';
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  createScene();
  createCamera();

  renderer();
}