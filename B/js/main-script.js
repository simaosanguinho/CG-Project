import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import * as Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// import constants.js
import {
  UNIT,
  Primitives,
  AXIS,
  cameraValues,
  CLOCK,
  DELTA_MULT,
  backgroundColor,
  fov,
  minViewDistance,
  maxViewDistance,
} from "./constants.js";
import { createCrane } from "./crane.js";
import { getMeshesToUpdate } from "./utils.js";

let camera, scene, renderer, delta, axes;
let isAnimating;

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
const cameras = [];

let currentCamera;

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
  cameraValues.forEach((cameraValue) => {
    createOrtographicCamera(cameraValue);
  });
  createPrespectiveCamera(cameraValues[4]);
  createPrespectiveCamera(cameraValues[5]);
}

function createPrespectiveCamera(cameraValue) {
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
  renderer.render(scene, currentCamera);
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

  currentCamera = cameras[3];

  // create object functions
  createCrane();

  // resetSteps();

  isAnimating = false;

  render();

  // add event listeners
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
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
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (window.innerHeight > 0 && window.innerWidth > 0) {
    currentCamera.aspect = window.innerWidth / window.innerHeight;
    currentCamera.updateProjectionMatrix();
  }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
  "use strict";

  switch (e.keyCode) {
    case 49: //1
      console.log("1");
      currentCamera = cameras[0];
      makeButtonActive("1");
      break;

    case 50: //2
      currentCamera = cameras[1];
      makeButtonActive("2");
      break;

    case 51: //3
      currentCamera = cameras[2];
      makeButtonActive("3");
      break;

    case 52: //4
      currentCamera = cameras[3];
      makeButtonActive("4");
      break;

    case 53: //5
      currentCamera = cameras[4];
      makeButtonActive("5");
      break;

    case 54: //6
      currentCamera = cameras[5];
      makeButtonActive("6");
      break;

    case 81 || 113: // Q or q
      makeButtonActive("Q");
      break;
    case 65 || 97: // A or a
      makeButtonActive("A");
      break;
    case 87 || 119: // W or w
      makeButtonActive("W");
      break;
    case 83 || 115: // S or s
      makeButtonActive("S");
      break;
    case 69 || 101: // E or e
      makeButtonActive("E");
      break;
    case 68 || 100: // D or d
      makeButtonActive("D");
      break;
    case 82 || 114: // R or r
      makeButtonActive("R");
      break;
    case 70 || 102: // F or f
      makeButtonActive("F");
      break;
    case 88 || 120: // X or x
      isWireframe = !isWireframe;
      updateWireframe(); // Update wireframe rendering
      makeButtonActive("X");
      break;

    case 32: //space - show axes
      axes.visible = !axes.visible;
      break;
  }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
  "use strict";
  switch (e.keyCode) {
    case 49: //1
      makeButtonInactive("1");
      break;
    case 50: //2
      makeButtonInactive("2");
      break;

    case 51: //3
      makeButtonInactive("3");
      break;

    case 52: //4
      makeButtonInactive("4");
      break;

    case 53: //5
      makeButtonInactive("5");
      break;

    case 54: //6
      makeButtonInactive("6");
      break;

    case 81 || 113: // Q or q
      makeButtonInactive("Q");
      break;

    case 65 || 97: // A or a
      makeButtonInactive("A");
      break;

    case 87 || 119: // W or w
      makeButtonInactive("W");
      break;

    case 83 || 115: // S or s
      makeButtonInactive("S");
      break;

    case 69 || 101: // E or e
      makeButtonInactive("E");
      break;

    case 68 || 100: // D or d
      makeButtonInactive("D");
      break;

    case 82 || 114: // R or r
      makeButtonInactive("R");
      break;

    case 70 || 102: // F or f
      makeButtonInactive("F");
      break;
    case 88 || 120: // X or x
      makeButtonInactive("X");
      break;
  }
}

init();
animate();

export { scene, renderer, currentCamera };

///////////////////////
/* Heads-Up Display */
///////////////////////

function makeButtonActive(key) {
  key = key.toUpperCase();
  const button = document.getElementById(`key${key}`);
  if (button) {
    button.classList.add("active");
  }
}

function makeButtonInactive(key) {
  key = key.toUpperCase();
  const button = document.getElementById(`key${key}`);
  if (button) {
    button.classList.remove("active");
  }
}

///////////////////////
/* Wireframe */
///////////////////////

let isWireframe = false; // Variable to track wireframe mode

function updateWireframe() {
    getMeshesToUpdate().forEach(mesh => {
        mesh.material.wireframe = isWireframe;
    });
}
