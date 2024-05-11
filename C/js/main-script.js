import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import * as Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
const UNIT = 20;

const CLOCK = new THREE.Clock();

const DELTA_MULT = 100;

const backgroundColor = "#eaf6ff";

const fov = 70;

const minViewDistance = 1;

const maxViewDistance = 10000;

const cameras = [];
let sceneObjects = new Map();
let renderer, scene, camera, axes, delta;

const cameraValues = [
  [1000, 1000, 1000],
  [1000, 1000, 1000],
];

const AXIS = {
    X: "x",
    Y: "y",
    Z: "z",
  };
  
  const Primitives = {
    RING: "ring",
    CYLINDER: "cylinder",
  };
/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    "use strict";
  
    scene = new THREE.Scene();
  
    // set the background color of the scene
    scene.background = new THREE.Color(backgroundColor);
    // add axes to the scene
    axes = new THREE.AxesHelper(10000);
    scene.add(axes);
  }

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
  "use strict";
  createOrtographicCamera(cameraValues[0]);
  createPerspectiveCamera(cameraValues[1], null);
}

function createPerspectiveCamera(cameraValue, location) {
  "use strict";
  camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    minViewDistance,
    maxViewDistance
  );
  camera.position.x = cameraValue[0];
  camera.position.y = cameraValue[1];
  camera.position.z = cameraValue[2];
  camera.lookAt(scene.position);

  cameras.push(camera);

  if (location) {
    location.add(camera);
    camera.lookAt(0, -1, 0);
  }
}

function createOrtographicCamera(cameraValue) {
  "use strict";
  camera = new THREE.OrthographicCamera(
    -window.innerWidth / 2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    -window.innerHeight / 2,
    minViewDistance,
    maxViewDistance
  );

  camera.position.x = cameraValue[0];
  camera.position.y = cameraValue[1];
  camera.position.z = cameraValue[2];
  camera.lookAt(scene.position);

  cameras.push(camera);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createObject(objectVals) {
    "use strict";
  
    const object = new THREE.Object3D();
  
    let geometry;
  
    switch (objectVals.type) {
      case Primitives.CUBE:
        geometry = new THREE.BoxGeometry(
          objectVals.width,
          objectVals.height,
          objectVals.depth
        );
        break;
        case Primitives.SPHERE:
        geometry = new THREE.SphereGeometry(
          objectVals.radius,
          objectVals.widthSegments,
          objectVals.heightSegments
        );
      default:
        break;
    }
  
    object.add(new THREE.Mesh(geometry, objectVals.material));
    sceneObjects.set(objectVals.name, object);
    return object;
  }

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
  "use strict";
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
  "use strict";
}

////////////
/* UPDATE */
////////////
function update() {
  "use strict";

}

/////////////
/* DISPLAY */
/////////////
function render() {
  "use strict";

    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
  "use strict";
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  createScene();
  createCameras();

  // create object functions
  let cube = new THREE.Mesh(
    new THREE.BoxGeometry(20*UNIT, 20*UNIT, 20*UNIT),
    new THREE.MeshNormalMaterial()
  );
    scene.add(cube);

  //resetSteps();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
  "use strict";
  delta = CLOCK.getDelta() * DELTA_MULT;
  update();
  render();
  requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
  "use strict";
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
  "use strict";
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
  "use strict";
}

init();
animate();
