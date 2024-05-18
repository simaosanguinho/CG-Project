import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import * as Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import image from "./images/image.png";
import { positionGeometry } from "three/examples/jsm/nodes/Nodes.js";

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
const UNIT = 90;

const CLOCK = new THREE.Clock();

const DELTA_MULT = 100;

const backgroundColor = "#0d131f"; // #ffffff

const fov = 70;

const minViewDistance = 1;

const maxViewDistance = 10000;

const cameras = [];
let sceneObjects = new Map();
let renderer, scene, camera, axes, delta;
let merryGoRound, innerRing, middleRing, outerRing;

const cameraValues = [[1000, 1000, 1000]];

const AXIS = {
  X: "x",
  Y: "y",
  Z: "z",
};

const Primitives = {
  RING: "ring",
  CYLINDER: "cylinder",
};

const colors = {
  white: 0xeff1f5,
  black: 0x4c4f69,
  red: 0xd20f39,
  green: 0x40a02b,
  blue: 0x1e66f5,
  yellow: 0xdf8e1d,
  cyan: 0x04a5e5,
  magenta: 0xdd7878,
};

const directionalLightValues = {
  color: colors.white,
  intensity: 1,
  position: [1 * UNIT, 6 * UNIT, 1 * UNIT],
};

const baseCylinderVals = {
  width: 1.75 * UNIT,
  depth: 1.75 * UNIT,
  height: 4 * UNIT,
  positionX: 0 * UNIT,
  positionY: 2.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CYLINDER,
  material: new THREE.MeshBasicMaterial({ color: colors.green }),
  name: "base",
};

const innerRingVals = {
  innerRadius: 1.5 * UNIT,
  outerRadius: 3 * UNIT,
  thetaSegments: 1000,
  height: 3 * UNIT,
  positionX: 0 * UNIT,
  positionY: 3.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.RING,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
  name: "innerRing",
};

const middleRingVals = {
  innerRadius: 3 * UNIT,
  outerRadius: 4.5 * UNIT,
  thetaSegments: 1000,
  height: 2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 2.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.RING,
  material: new THREE.MeshBasicMaterial({ color: colors.yellow }),
  name: "middleRing",
};

const outerRingVals = {
  innerRadius: 4.5 * UNIT,
  outerRadius: 6 * UNIT,
  thetaSegments: 1000,
  height: 1 * UNIT,
  positionX: 0 * UNIT,
  positionY: 1.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.RING,
  material: new THREE.MeshBasicMaterial({ color: colors.blue }),
  name: "outerRing",
};

const merryGoRoundRotationVals = {
  step: 0.01,
  rotationAxis: AXIS.Y,
  rotationDirection: 1,
};

const innerRingTranslationVals = {
  step: 1,
  translationAxis: AXIS.Y,
  inMotion: 0,
  translationDirection: -1,
  min: innerRingVals.positionY - innerRingVals.height / 2 + 0.6 * UNIT,
  max: innerRingVals.positionY,
};

const middleRingTranslationVals = {
  step: 1,
  translationAxis: AXIS.Y,
  inMotion: 0,
  translationDirection: -1,
  min: middleRingVals.positionY - middleRingVals.height / 2 + 0.1 * UNIT,
  max: middleRingVals.positionY,
};

const outerRingTranslationVals = {
  step: 1,
  translationAxis: AXIS.Y,
  inMotion: 0,
  translationDirection: -1,
  min: outerRingVals.positionY - outerRingVals.height / 2 + 0.1 * UNIT,
  max: outerRingVals.positionY,
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
  createPerspectiveCamera(cameraValues[0], null);
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

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createDirectionalLight() {
  "use strict";
  const light = new THREE.DirectionalLight(
    directionalLightValues.color,
    directionalLightValues.intensity
  );
  light.position.set(
    directionalLightValues.position[0],
    directionalLightValues.position[1],
    directionalLightValues.position[2]
  );
  scene.add(light);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function myClamp(value, min, max, infinite) {
  "use strict";
  if (infinite) {
    return value;
  }
  if (value < min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
}

function rotateObject(object, rotationVals, axis, infinite) {
  "use strict";
  switch (axis) {
    case AXIS.X:
      object.rotation.x = myClamp(
        object.rotation.x +
          rotationVals.rotationDirection * rotationVals.step * delta,
        rotationVals.min,
        rotationVals.max,
        infinite
      );
      break;
    case AXIS.Y:
      object.rotation.y = myClamp(
        object.rotation.y +
          rotationVals.rotationDirection * rotationVals.step * delta,
        rotationVals.min,
        rotationVals.max,
        infinite
      );
      break;
    case AXIS.Z:
      object.rotation.z = myClamp(
        object.rotation.z +
          rotationVals.rotationDirection * rotationVals.step * delta,
        rotationVals.min,
        rotationVals.max,
        infinite
      );
      break;
    default:
  }
}

function translateObject(object, objectValues, offset, axis) {
  "use strict";
  switch (axis) {
    case AXIS.X:
      if (objectValues.translationDirection === -1) {
        object.position.x = Math.min(
          object.position.x + objectValues.step * delta,
          objectValues.max + offset
        );
        break;
      }
      if (objectValues.translationDirection === 1) {
        object.position.x = Math.max(
          object.position.x - objectValues.step * delta,
          objectValues.min + offset
        );
        break;
      }
      break;
    case AXIS.Y:
      if (objectValues.translationDirection === -1) {
        object.position.y = Math.min(
          object.position.y + objectValues.step * delta,
          objectValues.max + offset
        );
        break;
      }
      if (objectValues.translationDirection === 1) {
        object.position.y = Math.max(
          object.position.y - objectValues.step * delta,
          objectValues.min + offset
        );
        break;
      }
      break;
    case AXIS.Z:
      if (objectValues.translationDirection === -1) {
        object.position.z = Math.min(
          object.position.z + objectValues.step * delta,
          objectValues.max + offset
        );
        break;
      }
      if (objectValues.translationDirection === 1) {
        object.position.z = Math.max(
          object.position.z - objectValues.step * delta,
          objectValues.min + offset
        );
        break;
      }
      break;
    default:
  }
}

function createRingGeometry(innerRadius, outerRadius, height, thetaSegments) {
  // Create a shape representing the ring
  const shape = new THREE.Shape();

  // Define the outer ring
  shape.moveTo(outerRadius, 0);
  for (let i = 1; i <= thetaSegments; i++) {
    const theta = (i / thetaSegments) * Math.PI * 2;
    const x = Math.cos(theta) * outerRadius;
    const y = Math.sin(theta) * outerRadius;
    shape.lineTo(x, y);
  }

  // Define the inner ring
  shape.moveTo(innerRadius, 0);
  for (let i = 1; i <= thetaSegments; i++) {
    const theta = (i / thetaSegments) * Math.PI * 2;
    const x = Math.cos(theta) * innerRadius;
    const y = Math.sin(theta) * innerRadius;
    shape.lineTo(x, y);
  }

  // Create extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: height,
    bevelEnabled: false,
  };
  // Create the extruded geometry
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Rotate the geometry by 90 degrees
  geometry.rotateX(Math.PI / 2);

  return geometry;
}

function createObject(objectVals) {
  "use strict";

  const object = new THREE.Object3D();

  let geometry;

  switch (objectVals.type) {
    case Primitives.RING:
      geometry = createRingGeometry(
        objectVals.innerRadius,
        objectVals.outerRadius,
        objectVals.height,
        objectVals.thetaSegments
      );
      break;
    case Primitives.CYLINDER:
      geometry = new THREE.CylinderGeometry(
        objectVals.width,
        objectVals.width,
        objectVals.height
      );
      break;

    default:
      break;
  }

  object.add(new THREE.Mesh(geometry, objectVals.material));
  sceneObjects.set(objectVals.name, object);
  return object;
}

function createBase() {
  const base = createObject(baseCylinderVals);
  base.position.set(
    baseCylinderVals.positionX,
    baseCylinderVals.positionY,
    baseCylinderVals.positionZ
  );

  // create cube on top of inner ring - DEBUG
  /* const cube = new THREE.Mesh(
		new THREE.BoxGeometry(2 * UNIT, 2 * UNIT, 2 * UNIT),
		new THREE.MeshBasicMaterial({ color: colors.white })
	);
	cube.position.set(0, 3 * UNIT, 0);
	base.add(cube); */

  return base;
}

function createInnerRing() {
  innerRing = createObject(innerRingVals);
  innerRing.position.set(
    innerRingVals.positionX,
    innerRingVals.positionY,
    innerRingVals.positionZ
  );

  return innerRing;
}

function createMiddleRing() {
  middleRing = createObject(middleRingVals);
  merryGoRound.add(middleRing);
  middleRing.position.set(
    middleRingVals.positionX,
    middleRingVals.positionY,
    middleRingVals.positionZ
  );
  return middleRing;
}

function createOuterRing() {
  outerRing = createObject(outerRingVals);
  merryGoRound.add(outerRing);
  outerRing.position.set(
    outerRingVals.positionX,
    outerRingVals.positionY,
    outerRingVals.positionZ
  );
  return outerRing;
}

function createMerryGoRound() {
  merryGoRound = new THREE.Group();
  const base = createBase(baseCylinderVals);
  const innerRing = createInnerRing(innerRingVals);
  const middleRing = createMiddleRing(middleRingVals);
  const outerRing = createOuterRing(outerRingVals);

  merryGoRound.add(base);
  merryGoRound.add(innerRing);
  merryGoRound.add(middleRing);
  merryGoRound.add(outerRing);

  scene.add(merryGoRound);
}

function createSkyBox() {
  "use strict";

  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load(image);
  var geometry = new THREE.SphereGeometry(
    20 * UNIT,
    32,
    16,
    0,
    Math.PI * 2,
    1.5,
    1.64
  );
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  var sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  sphere.rotation.x = Math.PI;
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

  rotateObject(
    merryGoRound,
    merryGoRoundRotationVals,
    merryGoRoundRotationVals.rotationAxis,
    true
  );
  //	console.log(merryGoRound.rotation.y);

  // move Rings up and down
  moveInnerRing();
  moveMiddleRing();
  moveOuterRing();
}

function moveInnerRing() {
  if (innerRingTranslationVals.inMotion === 1) {
    // Check if the inner ring is already at its minimum or maximum position
    if (
      innerRing.position.y <= innerRingTranslationVals.min ||
      innerRing.position.y >= innerRingTranslationVals.max
    ) {
      // Change the translation direction when reaching the limits
      innerRingTranslationVals.translationDirection *= -1;
    }

    // Translate the inner ring
    translateObject(
      innerRing,
      innerRingTranslationVals,
      merryGoRound.position.y,
      innerRingTranslationVals.translationAxis
    );
  }
}

function moveMiddleRing() {
  if (middleRingTranslationVals.inMotion === 1) {
    // Check if the middle ring is already at its minimum or maximum position
    if (
      middleRing.position.y <= middleRingTranslationVals.min ||
      middleRing.position.y >= middleRingTranslationVals.max
    ) {
      // Change the translation direction when reaching the limits
      middleRingTranslationVals.translationDirection *= -1;
    }

    // Translate the middle ring
    translateObject(
      middleRing,
      middleRingTranslationVals,
      merryGoRound.position.y,
      middleRingTranslationVals.translationAxis
    );
  }
}

function moveOuterRing() {
  if (outerRingTranslationVals.inMotion === 1) {
    // Check if the outer ring is already at its minimum or maximum position
    if (
      outerRing.position.y <= outerRingTranslationVals.min ||
      outerRing.position.y >= outerRingTranslationVals.max
    ) {
      // Change the translation direction when reaching the limits
      outerRingTranslationVals.translationDirection *= -1;
    }

    // Translate the outer ring
    translateObject(
      outerRing,
      outerRingTranslationVals,
      merryGoRound.position.y,
      outerRingTranslationVals.translationAxis
    );
  }
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
  createDirectionalLight();

  // create object functions
  /* let cube = new THREE.Mesh(
    new THREE.BoxGeometry(20 * UNIT, 20 * UNIT, 20 * UNIT),
    new THREE.MeshNormalMaterial()
  );
  scene.add(cube); */

  createSkyBox();
  createMerryGoRound();

  //resetSteps();

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
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
  "use strict";
  switch (e.keyCode) {
    case 49: //1
      innerRingTranslationVals.inMotion = 1;
      break;
    case 50: //2
      middleRingTranslationVals.inMotion = 1;
      break;
    case 51: //3
      outerRingTranslationVals.inMotion = 1;
      break;
    case 32: //space - show axes
      console.log("show axes");
      break;
    default:
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
      innerRingTranslationVals.inMotion = 0;
      break;
    case 50: //2
      middleRingTranslationVals.inMotion = 0;
      break;
    case 51: //3
      outerRingTranslationVals.inMotion = 0;
      break;
    default:
      break;
  }
}

init();
animate();