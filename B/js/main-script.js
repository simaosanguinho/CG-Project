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

const backgroundColor = "#eaf6ff";

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
  [0, 0, 1000],
  [1000, 0, 0],
  [0, 1000, 0],
  [2000, 1000, 3000],
  [1000, 1000, 1000],
  [500, 2000, 2000],
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
  height: 5.7 * UNIT,
  positionX: 0 * UNIT,
  positionY: -3 * UNIT,
  positionZ: 0 * UNIT,
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
  positionX: 0.75 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const lowerClawVals1 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 1.25 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const clawEdgeVals1 = {
  positionX: 1.5 * UNIT,
  positionY: -0.1 * UNIT,
  positionZ: 0.25 * UNIT,
  type: Primitives.PYRAMID,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const upperClawVals2 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: -0.75 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const lowerClawVals2 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: -1.25 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const clawEdgeVals2 = {
  positionX: -1.5 * UNIT,
  positionY: -0.1 * UNIT,
  positionZ: -0.25 * UNIT,
  type: Primitives.PYRAMID,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const upperClawVals3 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: -0.75 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const lowerClawVals3 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: -1.25 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const clawEdgeVals3 = {
  positionX: 0.25 * UNIT,
  positionY: -0.1 * UNIT,
  positionZ: -1.5 * UNIT,
  type: Primitives.PYRAMID,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const upperClawVals4 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0.75 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
};

const lowerClawVals4 = {
  width: 0.5 * UNIT,
  depth: 0.5 * UNIT,
  height: 0.2 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 1.25 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.cyan }),
};

const clawEdgeVals4 = {
  positionX: -0.25 * UNIT,
  positionY: -0.1 * UNIT,
  positionZ: 1.5 * UNIT,
  type: Primitives.PYRAMID,
  material: new THREE.MeshBasicMaterial({ color: colors.magenta }),
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
  step: rotationUnit,
  min: -1,
  max: Math.PI * 2,
  rotationDirection: 0,
};

const trolleyClawStructureTranslation = {
  step: 0.5 * UNIT,
  min: 2 * UNIT,
  max: 12 * UNIT,
  translationDirection: 0,
};

//////////////////////
/* GOTO: GLOBAL VARIABLES */
//////////////////////
const cameras = [];
let objectsToUpdate = [];
let lowerStructure, upperStructure, cable, trolleyClawStructure;
let claw, clawUpper1, clawLower1, clawUpper2, clawLower2, clawUpper3, clawLower3, clawUpper4, clawLower4;
let currentCamera;
let camera, scene, renderer, delta, axes;
let isAnimating;
let isDarkMode = false; // Variable to track dark mode
const darkModeButton = document.getElementById("darkModeButton");

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

function resetSteps() {
  "use strict";

  upperStructure.userData.step = 0;
}

function myClamp(value, min, max) {
  "use strict";

  // can rotate continuously
  if (value < min) {
    return value % (Math.PI * 2);
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

function rotateObject(object, rotationVals, axis) {
  "use strict";

  switch (axis) {
    case AXIS.X:
      object.rotation.x +=
        rotationVals.rotationDirection * rotationVals.step * delta;
      break;

    case AXIS.Y:
      object.rotation.y +=
        rotationVals.rotationDirection * rotationVals.step * delta;
      break;

    case AXIS.Z:
      object.rotation.z +=
        rotationVals.rotationDirection * rotationVals.step * delta;
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

function changePivot(obj, group, offset, axis) {
  switch (axis) {
    case AXIS.X:
      obj.position.copy(
        new THREE.Vector3(
          obj.position.x - offset,
          obj.position.y,
          obj.position.z
        )
      );
      group.position.copy(
        new THREE.Vector3(
          group.position.x + offset,
          group.position.y,
          group.position.z
        )
      );
      break;
    case AXIS.Y:
      obj.position.copy(
        new THREE.Vector3(
          obj.position.x,
          obj.position.y - offset,
          obj.position.z
        )
      );
      group.position.copy(
        new THREE.Vector3(
          group.position.x,
          group.position.y + offset,
          group.position.z
        )
      );
      break;
    case AXIS.Z:
      obj.position.copy(
        new THREE.Vector3(
          obj.position.x,
          obj.position.y,
          obj.position.z - offset
        )
      );
      group.position.copy(
        new THREE.Vector3(
          group.position.x,
          group.position.y,
          group.position.z + offset
        )
      );
      break;
    default:
      console.log("Invalid axis");
      break;
  }
}

function groupLowerClaw(clawNum) {
  "use strict";
  let group = new THREE.Group();
  switch (clawNum) {
    case 1:
      const clawLower1 = createClawLower1(lowerClawVals1);
      const clawEdge1 = createClawEdge1();
      group.add(clawLower1);
      group.add(clawEdge1);
      break;
    case 2:
      const clawLower2 = createClawLower2(lowerClawVals2);
      const clawEdge2 = createClawEdge2();
      group.add(clawLower2);
      group.add(clawEdge2);
      break;
    case 3:
      const clawLower3 = createClawLower3(lowerClawVals3);
      const clawEdge3 = createClawEdge3();
      group.add(clawLower3);
      group.add(clawEdge3);
      break;
    case 4:
      const clawLower4 = createClawLower4(lowerClawVals4);
      const clawEdge4 = createClawEdge4();
      group.add(clawLower4);
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

  const clawUpper1 = createClawUpper(upperClawVals1);
  const clawLower1 = groupLowerClaw(1);
  claw.add(clawUpper1);
  claw.add(clawLower1);

  const clawUpper2 = createClawUpper(upperClawVals2);
  const clawLower2 = groupLowerClaw(2);
  claw.add(clawUpper2);
  claw.add(clawLower2);

  
  const clawUpper3 = createClawUpper(upperClawVals3);
  const clawLower3 = groupLowerClaw(3);
  claw.add(clawUpper3);
  claw.add(clawLower3);

  const clawUpper4 = createClawUpper(upperClawVals4);
  const clawLower4 = groupLowerClaw(4);
  claw.add(clawUpper4);
  claw.add(clawLower4);

  setPosition(claw, clawStructureVals);

  return claw;
}

function createTrolleyClawStructure() {
  "use strict";

  trolleyClawStructure = new THREE.Group();
  const trolley = createTrolley();
  const cable = createCable();
  const claw = createClaw();

  trolleyClawStructure.add(trolley);
  trolleyClawStructure.add(cable);
  trolleyClawStructure.add(claw);

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
  // claw.rotation.z = -Math.PI / 4;
  // claw.position.y -= 0.25 * UNIT;
  return claw;
}

function createClawLower2(lowerClawVals) {
  "use strict";
  const claw = createObject(lowerClawVals);
  setPosition(claw, lowerClawVals);
  // claw.rotation.z = Math.PI / 4;
  // claw.position.y -= 0.25 * UNIT;
  return claw;
}

function createClawLower3(lowerClawVals) {
  "use strict";
  const claw = createObject(lowerClawVals);
  setPosition(claw, lowerClawVals);
  // claw.rotation.x = -Math.PI / 4;
  // claw.position.y -= 0.25 * UNIT;
  return claw;
}

function createClawLower4(lowerClawVals) {
  "use strict";
  const claw = createObject(lowerClawVals);
  setPosition(claw, lowerClawVals);
  // claw.rotation.x = Math.PI / 4;
  // claw.position.y -= 0.25 * UNIT;
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
  const cube = createObject(cubeVals);
  return cube;
}

function createDodecahedron() {
  "use strict";
  const dodecahedron = createObject(dodecahedronVals);
  return dodecahedron;
}

function createIcosahedron() {
  "use strict";
  const icosahedron = createObject(icosahedronVals);
  return icosahedron;
}

function createTorus() {
  "use strict";
  const torus = createObject(torusVals);
  return torus;
}

function createTorusKnot() {
  "use strict";
  const torusKnot = createObject(torusKnotVals);
  return torusKnot;
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

  rotateObject(upperStructure, upperStructureRotation, AXIS.Y);
  translateObject(trolleyClawStructure, trolleyClawStructureTranslation, 0, AXIS.X);
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
      upperStructureRotation.rotationDirection = -1;
      break;
    case 65 || 97: // A or a
      makeButtonActive("A");
      upperStructureRotation.rotationDirection = 1;
      break;
    case 87 || 119: // W or w
      makeButtonActive("W");
      trolleyClawStructureTranslation.translationDirection = 1;
      break;
    case 83 || 115: // S or s
      makeButtonActive("S");
      trolleyClawStructureTranslation.translationDirection = -1;
      break;
    case 69 || 101: // E or e
      makeButtonActive("E");
      climbClaw();

      break;
    case 68 || 100: // D or d
      makeButtonActive("D");
      lowerClaw();
      break;
    case 82 || 114: // R or r
      makeButtonActive("R");
      openClaw();
      break;
    case 70 || 102: // F or f
      makeButtonActive("F");
      closeClaw();
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
      upperStructureRotation.rotationDirection = 0;
      break;

    case 65 || 97: // A or a
      makeButtonInactive("A");
      upperStructureRotation.rotationDirection = 0;
      break;

    case 87 || 119: // W or w
      makeButtonInactive("W");
      trolleyClawStructureTranslation.translationDirection = 0;
      break;

    case 83 || 115: // S or s
      makeButtonInactive("S");
      trolleyClawStructureTranslation.translationDirection = 0;
      break;

    case 69 || 101: // E or e
      makeButtonInactive("E");
      climbClaw();
      break;

    case 68 || 100: // D or d
      makeButtonInactive("D");
      lowerClaw();
      break;

    case 82 || 114: // R or r
      makeButtonInactive("R");
      openClaw();
      break;

    case 70 || 102: // F or f
      makeButtonInactive("F");
      closeClaw();
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

function climbClaw() {
  "use strict";
  let newYClaw = claw.position.y + 0.1 * UNIT;
  let newYCable = cable.position.y + 0.1 * UNIT;
  claw.position.y = Math.min(newYClaw, 5 * UNIT);
  cable.position.y = Math.min(newYCable, 5 * UNIT);
}

function lowerClaw() {
  "use strict";
  let newYClaw = claw.position.y - 0.1 * UNIT;
  let newYCable = cable.position.y - 0.1 * UNIT;
  claw.position.y = Math.max(newYClaw, -7.5 * UNIT);
  cable.position.y = Math.max(newYCable, -7.5 * UNIT);
}

function closeClaw() {
  "use strict";
  
}

function openClaw() {
  "use strict";
  
}
