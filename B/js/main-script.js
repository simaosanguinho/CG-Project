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

const backgroundColor = "#eaf6ff"; // #eaf6ff

// Background color for dark mode
const backgroundColorDark = "#344c5e";

const fov = 70;

const minViewDistance = 1;

const rotationUnit = Math.PI / 80;

const maxViewDistance = 10000;

const AXIS = {
  X: "x",
  Y: "y",
  Z: "z",
};

const Primitives = {
  CUBE: "cube",
  DODECAHEDRON: "dodecahedron",
  ICOSAHEDRON: "icosahedron",
  TORUS: "torus",
  TORUS_KNOT: "torusKnot",

  CYLINDER: "cylinder",
  TETAEDRON: "tetraedron",
  PYRAMID: "pyramid",
};

const vertices = new Float32Array([
  // first triangle
  0 * UNIT,
  0 * UNIT,
  0 * UNIT,
  0.5 * UNIT,
  0 * UNIT,
  0 * UNIT,
  0.5 * UNIT,
  0.2 * UNIT,
  0 * UNIT,

  // second triangle
  0 * UNIT,
  0 * UNIT,
  0 * UNIT,
  0 * UNIT,
  0.2 * UNIT,
  0 * UNIT,
  0.5 * UNIT,
  0.2 * UNIT,
  0 * UNIT,

  // third triangle
  0 * UNIT,
  0 * UNIT,
  0 * UNIT,
  0 * UNIT,
  0.2 * UNIT,
  0 * UNIT,
  0.25 * UNIT,
  0 * UNIT,
  0.5 * UNIT,

  // fourth triangle
  0.5 * UNIT,
  0.2 * UNIT,
  0 * UNIT,
  0 * UNIT,
  0.2 * UNIT,
  0 * UNIT,
  0.25 * UNIT,
  0 * UNIT,
  0.5 * UNIT,

  // fifth triangle
  0.5 * UNIT,
  0.2 * UNIT,
  0 * UNIT,
  0.5 * UNIT,
  0 * UNIT,
  0 * UNIT,
  0.25 * UNIT,
  0 * UNIT,
  0.5 * UNIT,

  // sixth triangle
  0 * UNIT,
  0 * UNIT,
  0 * UNIT,
  0.5 * UNIT,
  0 * UNIT,
  0 * UNIT,
  0.25 * UNIT,
  0 * UNIT,
  0.5 * UNIT,
]);

const cameraValues = [
  [1000, 0, 0],
  [0, 0, 1000],
  [0, 1000, 0],
  [2000, 1000, 3000],
  [1000, 1000, 1000],
  [0, 0, 0],
];
1;
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
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
};

const baseVals = {
  width: 3 * UNIT,
  depth: 3 * UNIT,
  height: 1 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
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

const trolleyClawStructureVals = {
  positionX: 11.5 * UNIT,
  positionY: 14.85 * UNIT,
  positionZ: 0 * UNIT,
};

const trolleyVals = {
  width: 2 * UNIT,
  depth: 1 * UNIT,
  height: 0.3 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
};

const cableVals = {
  width: 0.2 * UNIT,
  depth: 0.2 * UNIT,
  height: 13 * UNIT,
  positionX: 0 * UNIT,
  positionY: -6.6 * UNIT,
  positionZ: 0 * UNIT,
  scale: 0.45,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.green }),
};

const clawStructureVals = {
  positionX: 0 * UNIT,
  positionY: -6 * UNIT,
  positionZ: 0 * UNIT,
};

const clawBlockVals = {
  width: 1 * UNIT,
  depth: 1 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.yellow }),
};

const upperClawVals1 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0.25 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const lowerClawVals1 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0.25 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const clawEdgeVals1 = {
  positionX: 0.5 * UNIT,
  positionY: -0.1 * UNIT,
  positionZ: 0.25 * UNIT,
  type: Primitives.PYRAMID,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const upperClawVals2 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: -0.25 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const lowerClawVals2 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: -0.25 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const clawEdgeVals2 = {
  positionX: -0.5 * UNIT,
  positionY: -0.1 * UNIT,
  positionZ: -0.25 * UNIT,
  type: Primitives.PYRAMID,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const upperClawVals3 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: -0.25 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const lowerClawVals3 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: -0.25 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const clawEdgeVals3 = {
  positionX: 0.25 * UNIT,
  positionY: -0.1 * UNIT,
  positionZ: -0.5 * UNIT,
  type: Primitives.PYRAMID,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const upperClawVals4 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0.25 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const lowerClawVals4 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0.25 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const clawEdgeVals4 = {
  positionX: -0.25 * UNIT,
  positionY: -0.1 * UNIT,
  positionZ: 0.5 * UNIT,
  type: Primitives.PYRAMID,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
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

const binFirstWallVals = {
  width: 4 * UNIT,
  depth: 4 * UNIT,
  height: 0.2 * UNIT,
  positionX: 8 * UNIT,
  positionY: 2 * UNIT,
  positionZ: 10 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
};

const binSecondWallVals = {
  width: 4 * UNIT,
  depth: 4 * UNIT,
  height: 0.2 * UNIT,
  positionX: 10 * UNIT,
  positionY: 2 * UNIT,
  positionZ: 8 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
};

const binThirdWallVals = {
  width: 4 * UNIT,
  depth: 4 * UNIT,
  height: 0.2 * UNIT,
  positionX: 12 * UNIT,
  positionY: 2 * UNIT,
  positionZ: 10 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
};

const binFourthWallVals = {
  width: 4 * UNIT,
  depth: 4 * UNIT,
  height: 0.2 * UNIT,
  positionX: 10 * UNIT,
  positionY: 2 * UNIT,
  positionZ: 12 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
};

const binBottomVals = {
  width: 4 * UNIT,
  depth: 4 * UNIT,
  height: 0.2 * UNIT,
  positionX: 10 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 10 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.green }),
};

const cubeVals = {
  width: 1 * UNIT,
  height: 1 * UNIT,
  depth: 1 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const dodecahedronVals = {
  radius: 1 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.DODECAHEDRON,
  material: new THREE.MeshBasicMaterial({ color: colors.green }),
};

const icosahedronVals = {
  radius: 1 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.ICOSAHEDRON,
  material: new THREE.MeshBasicMaterial({ color: colors.yellow }),
};

const torusVals = {
  radius: 1 * UNIT,
  tube: 0.3 * UNIT,
  radialSegments: 16,
  tubularSegments: 100,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.TORUS,
  material: new THREE.MeshBasicMaterial({ color: colors.red }),
};

const torusKnotVals = {
  radius: 1 * UNIT,
  tube: 0.3 * UNIT,
  tubularSegments: 100,
  radialSegments: 16,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.TORUS_KNOT,
  material: new THREE.MeshBasicMaterial({ color: colors.blue }),
};

// Adjust rotation speed
const upperStructureRotation = {
  step: rotationUnit/4,
  min: -Math.PI / 2,
  max: Math.PI * 2,
  rotationDirection: 0,
};

const lowerClawRotation1 = {
  step: rotationUnit,
  min: -Math.PI / 3,
  max: 0,
  rotationDirection: 0,
};

const lowerClawRotation2 = {
  step: rotationUnit,
  min: 0,
  max: Math.PI / 3,
  rotationDirection: 0,
};

const clawRotation1 = {
  step: rotationUnit,
  min: -Math.PI / 3,
  max: 0,
  rotationDirection: 0,
};

const clawRotation2 = {
  step: rotationUnit,
  min: 0,
  max: Math.PI / 3,
  rotationDirection: 0,
};

const trolleyClawStructureTranslation = {
  step: 0.1 * UNIT,
  min: 2.7 * UNIT,
  max: 12 * UNIT,
  translationDirection: 0,
};

const cableClawTranslation = {
  step: 0.5 * UNIT,
  min: -7 * UNIT,
  max: 5 * UNIT,
  translationDirection: 0,
};

const cableScale = {
  step: 0.0095,
  min: 0.2,
  max: 1,
  scaleDirection: 0,
};

const cableTranslation = {
  step: 0.5 * UNIT,
  min: 0 * UNIT,
  max: 0 * UNIT,
  translationDirection: 0,
};

const clawTranslation = {
  step: 0.125 * UNIT,
  min: -13 * UNIT,
  max: -2.5 * UNIT,
  translationDirection: 0,
};


//////////////////////
/* GOTO: GLOBAL VARIABLES */
//////////////////////
const cameras = [];
let objectsToUpdate = [];
let upperStructure, cable, trolleyClawStructure;
let clawLower1, clawLower2, clawLower3, clawLower4;
let clawUpper1, clawUpper2, clawUpper3, clawUpper4;
let clawUpperPivot1, clawUpperPivot2, clawUpperPivot3, clawUpperPivot4;
let clawLowerPivot1, clawLowerPivot2, clawLowerPivot3, clawLowerPivot4;
let cableClaw;
let claw, claw1, claw2, claw3, claw4;
let currentCamera;
let camera, scene, renderer, delta, axes;
let isAnimating;
let isDarkMode = false;
let qPressed = false, aPressed = false, wPressed = false, sPressed = false, ePressed = false, dPressed = false, rPressed = false, fPressed = false;
const darkModeButton = document.getElementById("darkModeButton");
let isColliding = false;
let animationStage = 0;
let randomCube, randomDodecahedron, randomIcosahedron, randomTorus, randomTorusKnot;

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
  createOrtographicCamera(cameraValues[0]);
  createOrtographicCamera(cameraValues[1]);
  createOrtographicCamera(cameraValues[2]);
  createOrtographicCamera(cameraValues[3]);
  createPrespectiveCamera(cameraValues[4], null);
}

function createPrespectiveCamera(cameraValue, location) {
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

  // TODO: if there is a location besides origin - CAMERA 6
  if (location) {
    location.add(camera);
    camera.lookAt(0, -1, 0);
    // make the cmaera always face the oposite direction of origin

    

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
    case Primitives.DODECAHEDRON:
      geometry = new THREE.DodecahedronGeometry(objectVals.radius);
      break;
    case Primitives.ICOSAHEDRON:
      geometry = new THREE.IcosahedronGeometry(objectVals.radius);
      break;
    case Primitives.TORUS:
      geometry = new THREE.TorusGeometry(
        objectVals.radius,
        objectVals.tube,
        objectVals.radialSegments,
        objectVals.tubularSegments
      );
      break;
    case Primitives.TORUS_KNOT:
      geometry = new THREE.TorusKnotGeometry(
        objectVals.radius,
        objectVals.tube,
        objectVals.tubularSegments,
        objectVals.radialSegments
      );
      break;
    case Primitives.TETRAEDRON:
      geometry = new THREE.TetrahedronGeometry(objectVals.radius);
      break;
    case Primitives.PYRAMID:
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      geometry.vertices = vertices;
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

  objectsToUpdate.push(object);
  return object;
}

function setPosition(object, vals) {
  "use strict";
  object.position.set(vals.positionX, vals.positionY, vals.positionZ);
}

function setScaleOnAxis(object, vals, axis) {
  "use strict";
  if (axis === AXIS.Y) {
    object.scale.y = vals;
  }
  if (axis === AXIS.X) {
    object.scale.x = vals;
  }
  if (axis === AXIS.Z) {
    object.scale.z = vals;
  }
}

function resetSteps() {
  "use strict";

  upperStructure.userData.step = 0;
}

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
        object.rotation.x + rotationVals.rotationDirection * rotationVals.step * delta,
        rotationVals.min,
        rotationVals.max,
        infinite,
      );
      break;

    case AXIS.Y:
      object.rotation.y = myClamp(
        object.rotation.y + rotationVals.rotationDirection * rotationVals.step * delta,
        rotationVals.min,
        rotationVals.max,
        infinite,
      );
      break;

    case AXIS.Z:
      object.rotation.z = myClamp(
        object.rotation.z + rotationVals.rotationDirection * rotationVals.step * delta,
        rotationVals.min,
        rotationVals.max,
        infinite,
      );
      break;

    default:
      console.log("Axis not found");
  }
}

function translateObject(object, objectValues, offset, axis) {
  "use strict";
  // TODO: confirm translation on Y and Z axis
  switch (axis) {
    case AXIS.X:
      if(objectValues.translationDirection === -1) {
        object.position.x = Math.min(object.position.x + objectValues.step * delta, objectValues.max + offset);
        break;
      }
      if (objectValues.translationDirection === 1) {
        object.position.x = Math.max(object.position.x - objectValues.step * delta, objectValues.min + offset);
        break;
      }
      
      break;
    case AXIS.Y:
      if(objectValues.translationDirection === -1) {
        object.position.y = Math.min(object.position.y + objectValues.step * delta, objectValues.max + offset);
        break;
      }
      if (objectValues.translationDirection === 1) {
        object.position.y = Math.max(object.position.y - objectValues.step * delta, objectValues.min + offset);
        break;
      }
      break;
    case AXIS.Z:
      if(objectValues.translationDirection === -1) {
        object.position.z = Math.min(object.position.z + objectValues.step * delta, objectValues.max + offset);
        break;
      }
      if (objectValues.translationDirection === 1) {
        object.position.z = Math.max(object.position.z - objectValues.step * delta, objectValues.min + offset);
        break;
      }
      break;

    default:
      console.log("Invalid axis");
  }
}

function scaleObject(object, scaleValues, axis) {
  "use strict";

  switch (axis) {
    case AXIS.Y:
      if (scaleValues.scaleDirection === -1) {  // scale down
        object.scale.y = Math.max(object.scale.y - scaleValues.step * delta, scaleValues.min);
        break;
      }
      if (scaleValues.scaleDirection === 1) { // scale up
        object.scale.y = Math.min(object.scale.y + scaleValues.step * delta, scaleValues.max);
        break;
      }
      break;
    }
}
  
function getObjectsToUpdate() {
  return objectsToUpdate;
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

function createBin() {
  "use strict";

  let bin = new THREE.Group();
  const binFirstWall = createBinFirstWall();
  const binSecondWall = createBinSecondWall();
  const binThirdWall = createBinThirdWall();
  const binFourthWall = createBinFourthWall();
  const binBottom = createBinBottom();

  bin.add(binFirstWall);
  bin.add(binSecondWall);
  bin.add(binThirdWall);
  bin.add(binFourthWall);
  bin.add(binBottom);

  scene.add(bin);
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

function createFiveRandomObjects() {
  "use strict";
  for (let i = 0; i < 5; i++) {
    let object;
    switch (i) {
      case 0:
        object = createCube();
        break;
      case 1:
        object = createDodecahedron();
        break;
      case 2:
        object = createIcosahedron();
        break;
      case 3:
        object = createTorus();
        break;
      case 4:
        object = createTorusKnot();
        break;
      default:
        break;
    }
    randomizePosition(object);
    // check collision
    for (let j = 0; j < objectsToUpdate.length; j++) {
      // check if not the same object
      if (checkCollision(object, objectsToUpdate[j])) {
        randomizePosition(object);
        j = 0; // restart loop
      }
    }
    scene.add(object);
  }
}

function groupLowerClaw(clawNum) {
  "use strict";
  let group = new THREE.Group();
  switch (clawNum) {
    case 1:
      const clawLower1aux = createClawLower1(lowerClawVals1);
      const clawEdge1 = createClawEdge1();
      group.add(clawLower1aux);
      group.add(clawEdge1);
      break;
    case 2:
      const clawLower2aux = createClawLower2(lowerClawVals2);
      const clawEdge2 = createClawEdge2();
      group.add(clawLower2aux);
      group.add(clawEdge2);
      break;
    case 3:
      const clawLower3aux = createClawLower3(lowerClawVals3);
      const clawEdge3 = createClawEdge3();
      group.add(clawLower3aux);
      group.add(clawEdge3);
      break;
    case 4:
      const clawLower4aux = createClawLower4(lowerClawVals4);
      const clawEdge4 = createClawEdge4();
      group.add(clawLower4aux);
      group.add(clawEdge4);
      break;
    default:
      break;
  }

  return group;
}

function createClaw() {
  "use strict";
  claw = new THREE.Group();

  const clawBlock = createClawBlock();
  claw.add(clawBlock);
  createPrespectiveCamera(cameraValues[5], clawBlock);

  /* CLAW 1 */

  claw1 = new THREE.Group();
  clawUpper1 = new THREE.Group();
  clawUpper1.add(createClawUpper(upperClawVals1));
  clawUpperPivot1 = new THREE.Group();
  clawUpperPivot1.add(clawUpper1);
  clawUpperPivot1.position.set(0.5 * UNIT, 0, 0);
  clawLower1 = new THREE.Group();
  clawLower1.add(groupLowerClaw(1));
  clawLowerPivot1 = new THREE.Group();
  clawLowerPivot1.add(clawLower1);
  clawLowerPivot1.position.set(0.5 * UNIT, 0, 0);
  clawUpperPivot1.add(clawLowerPivot1);
  claw1.add(clawUpperPivot1);
  claw.add(claw1);

  /* CLAW 2 */

  claw2 = new THREE.Group();

  clawUpper2 = new THREE.Group();
  clawUpper2.add(createClawUpper(upperClawVals2));
  clawUpperPivot2 = new THREE.Group();
  clawUpperPivot2.add(clawUpper2);
  clawUpperPivot2.position.set(-0.5 * UNIT, 0, 0);
  clawLower2 = new THREE.Group();
  clawLower2.add(groupLowerClaw(2));
  clawLowerPivot2 = new THREE.Group();
  clawLowerPivot2.add(clawLower2);
  clawLowerPivot2.position.set(-0.5 * UNIT, 0, 0);
  clawUpperPivot2.add(clawLowerPivot2);
  claw2.add(clawUpperPivot2);
  claw.add(claw2);

  /* CLAW 3 */

  claw3 = new THREE.Group();
  clawUpper3 = new THREE.Group();
  clawUpper3.add(createClawUpper(upperClawVals3));
  clawUpperPivot3 = new THREE.Group();
  clawUpperPivot3.add(clawUpper3);
  clawUpperPivot3.position.set(0, 0, -0.5 * UNIT);
  clawLower3 = new THREE.Group();
  clawLower3.add(groupLowerClaw(3));
  clawLowerPivot3 = new THREE.Group();
  clawLowerPivot3.add(clawLower3);
  clawLowerPivot3.position.set(0, 0, -0.5 * UNIT);
  clawUpperPivot3.add(clawLowerPivot3);

  claw3.add(clawUpperPivot3);
  claw.add(claw3);

  /* CLAW 4 */

  claw4 = new THREE.Group();
  clawUpper4 = new THREE.Group();
  clawUpper4.add(createClawUpper(upperClawVals4));
  clawUpperPivot4 = new THREE.Group();
  clawUpperPivot4.add(clawUpper4);
  clawUpperPivot4.position.set(0, 0, 0.5 * UNIT);
  clawLower4 = new THREE.Group();
  clawLower4.add(groupLowerClaw(4));
  clawLowerPivot4 = new THREE.Group();
  clawLowerPivot4.add(clawLower4);
  clawLowerPivot4.position.set(0, 0, 0.5 * UNIT);
  clawUpperPivot4.add(clawLowerPivot4);
  claw4.add(clawUpperPivot4);
  claw.add(claw4);

  setPosition(claw, clawStructureVals);
  return claw;
}

function createTrolleyClawStructure() {
  "use strict";

  trolleyClawStructure = new THREE.Group();
  const trolley = createTrolley();
  cableClaw = new THREE.Group();
  const cable = createCable();
  setScaleOnAxis(cable, cableVals.scale, AXIS.Y);
  const claw = createClaw();
  cableClaw.add(cable);
  cableClaw.add(claw);

  trolleyClawStructure.add(trolley);
  trolleyClawStructure.add(cableClaw);

  setPosition(trolleyClawStructure, trolleyClawStructureVals);

  return trolleyClawStructure;
}

function createUpperStructure() {
  "use strict";
  upperStructure = new THREE.Group();
  const cab = createCab();
  const jib = createJib();
  const upperTower = createUpperTower();
  const counterWeight = createCounterWeight();
  const frontPendant = createFrontPendant();
  const rearPendant = createRearPendant();
  const trolleyClawStructure = createTrolleyClawStructure();

  upperStructure.add(cab);
  upperStructure.add(jib);
  upperStructure.add(upperTower);
  upperStructure.add(counterWeight);
  upperStructure.add(frontPendant);
  upperStructure.add(rearPendant);
  upperStructure.add(trolleyClawStructure);

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
  cable = new THREE.Group();
  const cableObj = createObject(cableVals);
  setPosition(cableObj, cableVals);
  cable.add(cableObj);
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

function createBinFirstWall() {
  "use strict";
  const binFirstWall = createObject(binFirstWallVals);
  setPosition(binFirstWall, binFirstWallVals);
  binFirstWall.rotation.z = Math.PI / 2;
  return binFirstWall;
}

function createBinSecondWall() {
  "use strict";
  const binSecondWall = createObject(binSecondWallVals);
  setPosition(binSecondWall, binSecondWallVals);
  binSecondWall.rotation.z = Math.PI / 2;
  binSecondWall.rotation.y = Math.PI / 2;
  return binSecondWall;
}

function createBinThirdWall() {
  "use strict";
  const binThirdWall = createObject(binThirdWallVals);
  setPosition(binThirdWall, binThirdWallVals);
  binThirdWall.rotation.z = Math.PI / 2;
  return binThirdWall;
}

function createBinFourthWall() {
  "use strict";
  const binFourthWall = createObject(binFourthWallVals);
  setPosition(binFourthWall, binFourthWallVals);
  binFourthWall.rotation.z = Math.PI / 2;
  binFourthWall.rotation.y = Math.PI / 2;
  return binFourthWall;
}

function createBinBottom() {
  "use strict";
  const binBottom = createObject(binBottomVals);
  setPosition(binBottom, binBottomVals);
  return binBottom;
}

function createClawBlock() {
  "use strict";
  const clawBlock = createObject(clawBlockVals);
  setPosition(clawBlock, clawBlockVals);
  return clawBlock;
}

function createClawUpper(upperClawVals) {
  "use strict";
  const claw = createObject(upperClawVals);
  setPosition(claw, upperClawVals);
  return claw;
}

function createClawLower1(lowerClawVals) {
  "use strict";
  const claw = createObject(lowerClawVals);
  setPosition(claw, lowerClawVals);
  return claw;
}

function createClawLower2(lowerClawVals) {
  "use strict";
  const claw = createObject(lowerClawVals);
  setPosition(claw, lowerClawVals);
  return claw;
}

function createClawLower3(lowerClawVals) {
  "use strict";
  const claw = createObject(lowerClawVals);
  setPosition(claw, lowerClawVals);
  return claw;
}

function createClawLower4(lowerClawVals) {
  "use strict";
  const claw = createObject(lowerClawVals);
  setPosition(claw, lowerClawVals);
  return claw;
}

function createClawEdge1() {
  "use strict";
  const clawEdge = createObject(clawEdgeVals1);
  clawEdge.rotation.y = Math.PI / 2;
  setPosition(clawEdge, clawEdgeVals1);
  return clawEdge;
}

function createClawEdge2() {
  "use strict";
  const clawEdge = createObject(clawEdgeVals2);
  clawEdge.rotation.y = -Math.PI / 2;
  setPosition(clawEdge, clawEdgeVals2);
  return clawEdge;
}

function createClawEdge3() {
  "use strict";
  const clawEdge = createObject(clawEdgeVals3);
  clawEdge.rotation.y = Math.PI;
  setPosition(clawEdge, clawEdgeVals3);
  return clawEdge;
}

function createClawEdge4() {
  "use strict";
  const clawEdge = createObject(clawEdgeVals4);
  setPosition(clawEdge, clawEdgeVals4);
  return clawEdge;
}

function createCube() {
  "use strict";
  randomCube = createObject(cubeVals);
  return randomCube;
}

function createDodecahedron() {
  "use strict";
  randomDodecahedron = createObject(dodecahedronVals);
  return randomDodecahedron;
}

function createIcosahedron() {
  "use strict";
  randomIcosahedron = createObject(icosahedronVals);
  return randomIcosahedron
}

function createTorus() {
  "use strict";
  randomTorus = createObject(torusVals);
  return randomTorus;
}

function createTorusKnot() {
  "use strict";
  randomTorusKnot = createObject(torusKnotVals);
  return randomTorusKnot;
}

function randomizePosition(object) {
  "use strict";
  let randomizedX, randomizedZ;
  let enoughDistance = 3 * UNIT;
  do {
    randomizedX = Math.floor(Math.random() * 10 - Math.random() * 10) * UNIT;
    randomizedZ = Math.floor(Math.random() * 10 - Math.random() * 10) * UNIT;
  } while (
    // avoid placing object at the base of the crane
    cranePosition.positionX - randomizedX < enoughDistance &&
    cranePosition.positionZ - randomizedZ < enoughDistance
  );

  object.position.set(randomizedX, 0.5 * UNIT, randomizedZ);
}

//////////////////////
/* GOTO: CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
  "use strict";
}

function checkCollision(object1, object2) {
  "use strict";
  if (object1 === object2) {
    return false;
  }
  const box1 = new THREE.Box3().setFromObject(object1);
  const box2 = new THREE.Box3().setFromObject(object2);
  return box1.intersectsBox(box2);
}

///////////////////////
/* GOTO: HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
  "use strict";

  const period = Math.PI * 2; // rotation period, use to compare angles above a full rotation (e.g. have 450 degrees == 90 degrees)
    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    switch(animationStage) {
        case 0: // close claw if open
            console.log("stage 0");
            if(clawRotation1.rotationDirection === 0) {
                clawRotation1.rotationDirection = -1;
                clawRotation2.rotationDirection = 1;
            }
            rotateObject(clawUpperPivot1, clawRotation1, AXIS.Z, false);
            rotateObject(clawLowerPivot1, lowerClawRotation1, AXIS.Z, false);
            rotateObject(clawUpperPivot2, clawRotation2, AXIS.Z, false);
            rotateObject(clawLowerPivot2, lowerClawRotation2, AXIS.Z, false);
            rotateObject(clawUpperPivot3, clawRotation1, AXIS.X, false);
            rotateObject(clawLowerPivot3, lowerClawRotation1, AXIS.X, false);
            rotateObject(clawUpperPivot4, clawRotation2, AXIS.X, false);
            rotateObject(clawLowerPivot4, lowerClawRotation2, AXIS.X, false);
            // check if claw has been closed
            console.log(clawUpperPivot1.rotation.z);
            console.log("CUBEEE" + randomCube.position.x);
            if(clawUpperPivot1.rotation.z === -Math.PI / 3) {
              clawRotation1.rotationDirection = 0;
              animationStage = 1;
            }
            break;
        case 1: // open claw if closed
            console.log("stage 1");

            if(clawRotation1.rotationDirection === 0) {
                clawRotation1.rotationDirection = 1;
                clawRotation2.rotationDirection = -1;
            }
            
            rotateObject(clawUpperPivot1, clawRotation1, AXIS.Z, false);
            rotateObject(clawLowerPivot1, lowerClawRotation1, AXIS.Z, false);
            rotateObject(clawUpperPivot2, clawRotation2, AXIS.Z, false);
            rotateObject(clawLowerPivot2, lowerClawRotation2, AXIS.Z, false);
            rotateObject(clawUpperPivot3, clawRotation1, AXIS.X, false);
            rotateObject(clawLowerPivot3, lowerClawRotation1, AXIS.X, false);
            rotateObject(clawUpperPivot4, clawRotation2, AXIS.X, false);
            rotateObject(clawLowerPivot4, lowerClawRotation2, AXIS.X, false);
            // check if claw has opened
            if(clawUpperPivot1.rotation.z === 0) {
                animationStage = 2;
                clawRotation1.rotationDirection = 0;
            }
            break;
        case 2: // move upper structure to be aligned with the object randomCube
            let angle = -Math.atan2(randomCube.position.z, randomCube.position.x);

            // Calculate the angle difference in -MATH.PI to MATH.PI
            let angleDifference = angle - (mod(upperStructure.rotation.y + Math.PI, period) - Math.PI);
            
            upperStructureRotation.rotationDirection = angleDifference > 0 ? 1 : -1;
            rotateObject(upperStructure, upperStructureRotation, AXIS.Y, true);

            if(Math.abs(angleDifference) < 0.01) {
                upperStructureRotation.rotationDirection = 0;
                animationStage = 3;
            }
            
            break;

        case 3: // move trolley to the object randomCube
            console.log("stage 3");
            break;

        }
}

////////////
/* GOTO: UPDATE */
////////////
function update() {
  "use strict";
  if (isAnimating) {
    // checkCollisions();
    // handleCollisions();
    return;
  }

  if(!isColliding) {
    rotateObject(upperStructure, upperStructureRotation, AXIS.Y, true);
    // update the orientation of camera 6
    cameras[5].rotation.z = -(upperStructure.rotation.z + Math.PI/2);
    
    rotateObject(clawUpperPivot1, clawRotation1, AXIS.Z, false);
    rotateObject(clawLowerPivot1, lowerClawRotation1, AXIS.Z, false);
    rotateObject(clawUpperPivot2, clawRotation2, AXIS.Z, false);
    rotateObject(clawLowerPivot2, lowerClawRotation2, AXIS.Z, false);
    rotateObject(clawUpperPivot3, clawRotation1, AXIS.X, false);
    rotateObject(clawLowerPivot3, lowerClawRotation1, AXIS.X, false);
    rotateObject(clawUpperPivot4, clawRotation2, AXIS.X, false);
    rotateObject(clawLowerPivot4, lowerClawRotation2, AXIS.X, false);

    translateObject(trolleyClawStructure, trolleyClawStructureTranslation, 0, AXIS.X);
    scaleObject(cable, cableScale, AXIS.Y);
    translateObject(claw, clawTranslation, 0, AXIS.Y);
  } else {
    handleCollisions();
  }
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
  createBin();
  createFiveRandomObjects();
  // grid
  const gridHelper = new THREE.GridHelper(1000, 100);
  scene.add(gridHelper);

  resetSteps();

  isAnimating = false;

  render();

  // add event listeners
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  darkModeButton.addEventListener("click", toggleDarkMode);
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
      if(aPressed) {
        upperStructureRotation.rotationDirection = 0;
      } else {
        upperStructureRotation.rotationDirection = 1;
      }
      qPressed = true;
      break;
    case 65 || 97: // A or a
      makeButtonActive("A");
      if(qPressed) {
        upperStructureRotation.rotationDirection = 0;
      } else {
        upperStructureRotation.rotationDirection = -1;
      }
      aPressed = true;
      break;
    case 87 || 119: // W or w
      makeButtonActive("W");
      if(sPressed) {
        trolleyClawStructureTranslation.translationDirection = 0;
      } else {
        trolleyClawStructureTranslation.translationDirection = -1;
      }
      wPressed = true;
      break;
    case 83 || 115: // S or s
      makeButtonActive("S");
      if(wPressed) {
        trolleyClawStructureTranslation.translationDirection = 0;
      } else {
        trolleyClawStructureTranslation.translationDirection = 1;
      }
      sPressed = true;
      break;
    case 69 || 101: // E or e
      makeButtonActive("E"); // up
      if(dPressed) {
        cableTranslation.translationDirection = 0;
        clawTranslation.translationDirection = 0;
        cableScale.scaleDirection = 0;
      } else {
        cableTranslation.translationDirection = -1;
        clawTranslation.translationDirection = -1;
        cableScale.scaleDirection = -1;
      }
      ePressed = true;
      break;
    case 68 || 100: // D or d
      makeButtonActive("D");  // down
      if(ePressed) {
        cableTranslation.translationDirection = 0;
        clawTranslation.translationDirection = 0;
        cableScale.scaleDirection = 0;
      } else {
        cableTranslation.translationDirection = 1;
        clawTranslation.translationDirection = 1;
        cableScale.scaleDirection = 1;
      }
      dPressed = true;
      break;
    case 82 || 114: // R or r
      makeButtonActive("R");
      if(fPressed) {
        lowerClawRotation1.rotationDirection = 0;
        lowerClawRotation2.rotationDirection = 0;
        clawRotation1.rotationDirection = 0;
        clawRotation2.rotationDirection = 0;
      } else {
        lowerClawRotation1.rotationDirection = 1;
        lowerClawRotation2.rotationDirection = -1;
        clawRotation1.rotationDirection = 1;
        clawRotation2.rotationDirection = -1;
      }
      rPressed = true;
      break;
    case 70 || 102: // F or f
      makeButtonActive("F");
      if(rPressed) {
        lowerClawRotation1.rotationDirection = 0;
        lowerClawRotation2.rotationDirection = 0;
        clawRotation1.rotationDirection = 0;
        clawRotation2.rotationDirection = 0;
      } else {
        lowerClawRotation1.rotationDirection = -1;
        lowerClawRotation2.rotationDirection = 1;
        clawRotation1.rotationDirection = -1;
        clawRotation2.rotationDirection = 1;
      }
      fPressed = true;
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
      if(aPressed) {
        upperStructureRotation.rotationDirection = -1;
      } else {
        upperStructureRotation.rotationDirection = 0;
      }
      qPressed = false;
      break;

      case 65 || 97: // A or a
      makeButtonInactive("A");
      if(qPressed) {
        upperStructureRotation.rotationDirection = 1;
      } else {
        upperStructureRotation.rotationDirection = 0;
      }
      aPressed = false;
      break;

    case 87 || 119: // W or w
      makeButtonInactive("W");
      if(sPressed) {
        trolleyClawStructureTranslation.translationDirection = -1;
      } else {
        trolleyClawStructureTranslation.translationDirection = 0;
      } 
      wPressed = false;
      break;

    case 83 || 115: // S or s
      makeButtonInactive("S");
      if(wPressed) {
        trolleyClawStructureTranslation.translationDirection = 1;
      } else {
        trolleyClawStructureTranslation.translationDirection = 0;
      }
      sPressed = false;
      break;

    case 69 || 101: // E or e
      makeButtonInactive("E");
      if(dPressed) {
        cableTranslation.translationDirection = 1;
        clawTranslation.translationDirection = 1;
        cableScale.scaleDirection = 1;
      } else {
        cableTranslation.translationDirection = 0;
        clawTranslation.translationDirection = 0;
        cableScale.scaleDirection = 0;
      }
      ePressed = false;
      break;

    case 68 || 100: // D or d
      makeButtonInactive("D");
      if(ePressed) {
        cableTranslation.translationDirection = -1;
        clawTranslation.translationDirection = -1;
        cableScale.scaleDirection = -1;
      } else {
        cableTranslation.translationDirection = 0;
        clawTranslation.translationDirection = 0;
        cableScale.scaleDirection = 0;
      }
      dPressed = false;
      break;

    case 82 || 114: // R or r
      makeButtonInactive("R");
      if(fPressed) {
        lowerClawRotation1.rotationDirection = -1;
        lowerClawRotation2.rotationDirection = 1;
        clawRotation1.rotationDirection = -1;
        clawRotation2.rotationDirection = 1;
      } else {
        lowerClawRotation1.rotationDirection = 0;
        lowerClawRotation2.rotationDirection = 0;
        clawRotation1.rotationDirection = 0;
        clawRotation2.rotationDirection = 0;
      }
      rPressed = false;
      break;

    case 70 || 102: // F or f
      makeButtonInactive("F");  
      if(rPressed) {
        lowerClawRotation1.rotationDirection = 1;
        lowerClawRotation2.rotationDirection = -1;
        clawRotation1.rotationDirection = 1;
        clawRotation2.rotationDirection = -1;
      } else {
        lowerClawRotation1.rotationDirection = 0;
        lowerClawRotation2.rotationDirection = 0;
        clawRotation1.rotationDirection = 0;
        clawRotation2.rotationDirection = 0;
      }
      fPressed = false;
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

let isWireframe = false;

function updateWireframe() {
  getObjectsToUpdate().forEach((object) => {
    object.children[0].material.wireframe = isWireframe;
  });
}

/////////////////////////
/* GOTO: DARKMODE     */
///////////////////////
darkModeButton.addEventListener("click", toggleDarkMode);

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  updateToggleSwitch();
  updateBackgroundColor();
}

function updateToggleSwitch() {
  if (isDarkMode) {
    darkModeButton.classList.add("on");
  } else {
    darkModeButton.classList.remove("on");
  }
}

function updateBackgroundColor() {
  if (isDarkMode) {
    scene.background = new THREE.Color(backgroundColorDark);
    document.body.style.backgroundColor = backgroundColorDark;
  } else {
    scene.background = new THREE.Color(backgroundColor);
    document.body.style.backgroundColor = backgroundColor;
  }
}
