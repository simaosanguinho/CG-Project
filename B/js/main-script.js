import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import * as Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

//////////////////////
/* GOTO: CONSTANTS  */
//////////////////////
const UNIT = 20;

const CLOCK = new THREE.Clock();

const DELTA_MULT = 100;

const backgroundColor = 0xeaf6ff;

const fov = 70;

const minViewDistance = 1;

const rotationUnit = Math.PI / 20;

const maxViewDistance = 10000;

const AXIS = {
  X: "x",
  Y: "y",
  Z: "z",
};

const Primitives = {
  CUBE: "cube",
  CYLINDER: "cylinder",
  TETAEDRON: "tetraedron",
};

const cameraValues = [
  [0, 0, 1000],
  [1000, 0, 0],
  [0, 1000, 0],
  [2000, 1000, 3000],
  [1000, 1000, 1000],
  [500, 2000, 2000],
];

// REMOVE
const colors = {
  white: 0xffffff,
  black: 0x000000,
  red: 0xff0000,
  green: 0x00ff00,
  blue: 0x0000ff,
  yellow: 0xffff00,
  cyan: 0x00ffff,
  magenta: 0xff00ff,
};

const cranePosition = {
  positionX: 4.5 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 1.5 * UNIT,
};

const baseVals = {
  width: 3 * UNIT,
  depth: 3 * UNIT,
  height: 1 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.red }), //transparent: true, opacity: 0.5,
};

const towerVals = {
  width: 1 * UNIT,
  depth: 1 * UNIT,
  height: 12 * UNIT,
  positionX: 0 * UNIT,
  positionY: 7 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.blue }),
};

const cabVals = {
  width: 2 * UNIT,
  depth: 2 * UNIT,
  height: 2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 14 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.yellow }),
};

const jibVals = {
  width: 18 * UNIT,
  depth: 1 * UNIT,
  height: 1 * UNIT,
  positionX: 4.5 * UNIT,
  positionY: 15.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.green }),
};

const upperTowerVals = {
  width: 1 * UNIT,
  depth: 1 * UNIT,
  height: 3.1 * UNIT, // room to hide pendants edges
  positionX: 0 * UNIT,
  positionY: 17.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.blue }),
};

const counterWeightVals = {
  width: 1.5 * UNIT,
  depth: 1 * UNIT,
  height: 0.5 * UNIT,
  positionX: -3.25 * UNIT,
  positionY: 14.75 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
};

const trolleyVals = {
  width: 2 * UNIT,
  depth: 1 * UNIT,
  height: 0.3 * UNIT,
  positionX: 11.5 * UNIT,
  positionY: 14.85 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
};

const cableVals = {
  width: 0.2 * UNIT,
  depth: 0.2 * UNIT,
  height: 5.7 * UNIT,
  positionX: 11.5 * UNIT,
  positionY: 12 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.green }),
};

const frontPendantVals = {
  width: 0.1 * UNIT,
  depth: 0.1 * UNIT,
  height: 11 * UNIT, // ~sqr130
  positionX: 5.5 * UNIT,
  positionY: 17.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CYLINDER,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
};

const rearPendantVals = {
  width: 0.1 * UNIT,
  depth: 0.1 * UNIT,
  height: 4.3 * UNIT, // ~sqrt18
  positionX: -2 * UNIT,
  positionY: 17.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CYLINDER,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
};

const upperStructureRotation = {
  step: rotationUnit,
  min: -Math.PI * 2,
  max: Math.PI * 2,
};

//////////////////////
/* GOTO: GLOBAL VARIABLES */
//////////////////////
const cameras = [];
let meshesToUpdate = [];
let lowerStructure, upperStructure;
let currentCamera;
let camera, scene, renderer, delta, axes;
let isAnimating;

/////////////////////
/* GOTO: CREATE SCENE(S) */
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
/* GOTO: CREATE CAMERA(S) */
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
/* GOTO: CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* GOTO: CREATE OBJECT3D(S) */
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
    case Primitives.CYLINDER:
      geometry = new THREE.CylinderGeometry(
        objectVals.radiusTop,
        objectVals.radiusBottom,
        objectVals.height
      );
      break;
    case Primitives.TETRAEDRON:
      geometry = new THREE.TetrahedronGeometry(objectVals.radius);
      break;
    default:
      break;
  }
  // TODO: ADD MATERIAL
  const mesh = new THREE.Mesh(geometry, objectVals.material);
  object.add(mesh);

  /* let edges = new THREE.EdgesGeometry(mesh.geometry);
    let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
    // increase the size of the edges
    line.scale.set(1.1, 1.1, 1.1);
  
    object.add(line); */

  meshesToUpdate.push(mesh);
  return object;
}

function setPosition(object, vals) {
  "use strict";
  object.position.set(vals.positionX, vals.positionY, vals.positionZ);
}

function resetSteps() {
  "use strict";

  upperStructure.userData.step = 0;
}

function myClamp(value, min, max) {
  "use strict";

  // can rotate continuously
  if (min < 0) {
    return value % (Math.PI * 2);
  }
}

function rotateObject(object, rotationVals, axis) {
  "use strict";

  switch (axis) {
    case AXIS.X:
      object.rotation.x = THREE.MathUtils.clamp(
        object.userData.step * delta + object.rotation.x,
        rotationVals.min,
        rotationVals.max % (Math.PI * 2)
      );
      break;

    case AXIS.Y:
      object.rotation.y += myClamp(
        object.userData.step * delta + object.rotation.y,
        rotationVals.min,
        rotationVals.max
      );
      break;

    case AXIS.Z:
      object.rotation.z += THREE.MathUtils.clamp(
        object.userData.step * delta + object.rotation.z,
        rotationVals.min,
        rotationVals.max
      );
      break;

    default:
      console.log("Axis not found");
  }
}

function getMeshesToUpdate() {
  return meshesToUpdate;
}

function createCrane() {
  "use strict";

  let crane = new THREE.Group();
  let lowerStructure = createLowerStructure();
  upperStructure = createUpperStructure();

  crane.add(lowerStructure);
  crane.add(upperStructure);

  crane.position.set(
    cranePosition.positionX,
    cranePosition.positionY,
    cranePosition.positionZ
  );
  scene.add(crane);
}

function createLowerStructure() {
  "use strict";
  let group = new THREE.Group();
  const base = createBase();
  const tower = createTower();

  group.add(base);
  group.add(tower);
  return group;
}

function createUpperStructure() {
  "use strict";
  // TODO: In order to rotate the object 'group' must be the one declared in main-script.js
  upperStructure = new THREE.Group();
  const cab = createCab();
  const jib = createJib();
  const upperTower = createUpperTower();
  const counterWeight = createCounterWeight();
  const trolley = createTrolley();
  const cable = createCable();
  const frontPendant = createFrontPendant();
  const rearPendant = createRearPendant();

  upperStructure.add(cab);
  upperStructure.add(jib);
  upperStructure.add(upperTower);
  upperStructure.add(counterWeight);
  upperStructure.add(trolley);
  upperStructure.add(cable);
  upperStructure.add(frontPendant);
  upperStructure.add(rearPendant);
  return upperStructure;
}

function createBase() {
  "use strict";
  const base = createObject(baseVals);
  setPosition(base, baseVals);
  return base;
}

function createTower() {
  "use strict";
  const tower = createObject(towerVals);
  setPosition(tower, towerVals);
  return tower;
}

function createCab() {
  "use strict";
  const cab = createObject(cabVals);
  setPosition(cab, cabVals);
  return cab;
}

function createJib() {
  "use strict";
  const jib = createObject(jibVals);
  setPosition(jib, jibVals);
  return jib;
}

function createUpperTower() {
  "use strict";
  const upperTower = createObject(upperTowerVals);
  setPosition(upperTower, upperTowerVals);
  return upperTower;
}

function createCounterWeight() {
  "use strict";
  const counterWeight = createObject(counterWeightVals);
  setPosition(counterWeight, counterWeightVals);
  return counterWeight;
}

function createTrolley() {
  "use strict";
  const trolley = createObject(trolleyVals);
  setPosition(trolley, trolleyVals);
  return trolley;
}

function createCable() {
  "use strict";
  const cable = createObject(cableVals);
  setPosition(cable, cableVals);
  return cable;
}

function createFrontPendant() {
  "use strict";
  const frontPendant = createObject(frontPendantVals);
  setPosition(frontPendant, frontPendantVals);
  frontPendant.rotation.z = Math.PI / 2.43;
  return frontPendant;
}

function createRearPendant() {
  "use strict";
  const rearPendant = createObject(rearPendantVals);
  setPosition(rearPendant, rearPendantVals);
  rearPendant.rotation.z = -Math.PI / 4;
  return rearPendant;
}

//////////////////////
/* GOTO: CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
  "use strict";
}

///////////////////////
/* GOTO: HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
  "use strict";
}

////////////
/* GOTO: UPDATE */
////////////
function update() {
  "use strict";

  rotateObject(upperStructure, upperStructureRotation, AXIS.Y);
}

/////////////
/* GOTO: DISPLAY */
/////////////
function render() {
  "use strict";
  renderer.render(scene, currentCamera);
}

////////////////////////////////
/* GOTO: INITIALIZE ANIMATION CYCLE */
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

  resetSteps();

  isAnimating = false;

  render();

  // add event listeners
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* GOTO: ANIMATION CYCLE */
/////////////////////
function animate() {
  "use strict";

  delta = CLOCK.getDelta() * DELTA_MULT;

  update();

  render();

  requestAnimationFrame(animate);
}

////////////////////////////
/* GOTO: RESIZE WINDOW CALLBACK */
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
      upperStructure.userData.step = upperStructureRotation.step;
      break;
    case 65 || 97: // A or a
      makeButtonActive("A");
      upperStructure.userData.step = -upperStructureRotation.step;
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
    case 55: // 7
      isWireframe = !isWireframe;
      updateWireframe();
      makeButtonActive("7");
      break;

    case 32: //space - show axes
      axes.visible = !axes.visible;
      break;
  }
}

///////////////////////
/* GOTO: KEY UP CALLBACK */
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
      upperStructure.userData.step = 0;
      break;

    case 65 || 97: // A or a
      makeButtonInactive("A");
      upperStructure.userData.step = 0;
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
    case 55: // 7
      makeButtonInactive("7");
      break;
  }
}

init();
animate();

///////////////////////
/* GOTO: Heads-Up Display  */
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

////////////////////////
/* GOTO: WIREFRAME */
///////////////////////

let isWireframe = false; // Variable to track wireframe mode

function updateWireframe() {
  getMeshesToUpdate().forEach((mesh) => {
    mesh.material.wireframe = isWireframe;
  });
}
