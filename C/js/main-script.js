import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import * as Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import image from "./images/image.png";
import {
  color,
  lights,
  positionGeometry,
  rotate,
} from "three/examples/jsm/nodes/Nodes.js"; // for noclip
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
const UNIT = 90;

const CLOCK = new THREE.Clock();

const DELTA_MULT = 100;

const backgroundColor = 0x000000;

const fov = 70;

const minViewDistance = 1;

const maxViewDistance = 1000000;

const N_POINT_LIGHTS = 8;

let pointLightLocations = [];

const vertices = new Float32Array(createMobiusStripVertices());

let mobiusStripStructure = new THREE.Group();

const STOPPED = 0;
const MOVING = 1;

const colors = {
  white: 0xeff1f5,
  black: 0x4c4f69,
  red: 0xd20f39,
  green: 0x40a02b,
  blue: 0x1e66f5,
  yellow: 0xdf8e1d,
  cyan: 0x04a5e5,
  magenta: 0xdd7878,
  orange: 0xf5a623,
};

const objectsPerRing = 8;

const cameras = [];
let sceneObjects = new Map();
let globalLights = new Map();
let parametricObjects = new Map();
let mobiusStripLights = new Map();
let renderer, scene, camera, axes, delta;
let merryGoRound, innerRing, middleRing, outerRing;
let latestMaterial = "gouraud";
let isShadingActive = true;

//////////////////////
/* OBJECT VARIABLES */
//////////////////////

const cameraValues = [[1000, 1000, 1000]];

const AXIS = {
  X: "x",
  Y: "y",
  Z: "z",
};

const Primitives = {
  RING: "ring",
  CYLINDER: "cylinder",
  MOBIUS_STRIP: "mobiusStrip",
};

const directionalLightVals = {
  color: colors.white,
  intensity: 2,
  position: [1 * UNIT, 15 * UNIT, 1 * UNIT],
};

const ambientLightVals = {
  color: colors.orange,
  intensity: 1,
};

const pointLightVals = {
  color: colors.white,
  intensity: 200,
  distance: 1000,
  decay: 1,
};

const baseCylinderVals = {
  width: 1.75 * UNIT,
  depth: 1.75 * UNIT,
  height: 4 * UNIT,
  positionX: 0 * UNIT,
  positionY: 2.5 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CYLINDER,
  //material: new THREE.MeshBasicMaterial({ color: colors.green }),
  color: colors.green,
  material: new THREE.MeshLambertMaterial({ color: colors.green }),
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
  //material: new THREE.MeshBasicMaterial({ color: colors.red }),
  color: colors.red,
  material: new THREE.MeshLambertMaterial({ color: colors.red }),
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
  //material: new THREE.MeshBasicMaterial({ color: colors.yellow }),
  color: colors.yellow,
  material: new THREE.MeshLambertMaterial({ color: colors.yellow }),
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
  // material: new THREE.MeshLambertMaterial({ color: colors.blue }),
  color: colors.blue,
  material: new THREE.MeshLambertMaterial({ color: colors.blue }),
  name: "outerRing",
};

const mobiusStripVals = {
  innerRadius: 1.5 * UNIT,
  outerRadius: 3 * UNIT,
  thetaSegments: 1000,
  height: 3 * UNIT,
  positionX: 0 * UNIT,
  positionY: 9 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.MOBIUS_STRIP,
  color: colors.yellow,
  material: new THREE.MeshLambertMaterial({ color: colors.yellow }),
  name: "mobiusStrip",
};

const merryGoRoundRotationVals = {
  step: 0.01,
  rotationAxis: AXIS.Y,
  rotationDirection: 1,
};

const innerRingTranslationVals = {
  step: 1,
  translationAxis: AXIS.Y,
  inMotion: 1,
  translationDirection: -1,
  min: innerRingVals.positionY - innerRingVals.height / 2 + 0.6 * UNIT,
  max: innerRingVals.positionY,
};

const middleRingTranslationVals = {
  step: 1.3,
  translationAxis: AXIS.Y,
  inMotion: 1,
  translationDirection: -1,
  min: middleRingVals.positionY - middleRingVals.height / 2 + 0.1 * UNIT,
  max: middleRingVals.positionY,
};

const outerRingTranslationVals = {
  step: 0.8,
  translationAxis: AXIS.Y,
  inMotion: 1,
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

function resetCamera() {
  camera.position.set(
    cameraValues[0][0],
    cameraValues[0][1],
    cameraValues[0][2]
  );
  camera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createDirectionalLight() {
  "use strict";
  const light = new THREE.DirectionalLight(
    directionalLightVals.color,
    directionalLightVals.intensity
  );
  light.position.set(
    directionalLightVals.position[0],
    directionalLightVals.position[1],
    directionalLightVals.position[2]
  );
  scene.add(light);
  globalLights.set("directionalLight", light);
}

function createAmbientLight(color, intensity) {
  "use strict";
  const light = new THREE.AmbientLight(
    ambientLightVals.color,
    ambientLightVals.intensity
  );
  scene.add(light);
  globalLights.set("ambientLight", light);
}

function createPointLight(positionVals, index) {
  "use strict";
  const light = new THREE.PointLight(
    pointLightVals.color,
    pointLightVals.intensity,
    pointLightVals.distance,
    pointLightVals.decay
  );

  light.position.set(positionVals[0], positionVals[1], positionVals[2]);

  mobiusStripStructure.add(light);
  // mobiusStripStructure.add(lightSphere);
  mobiusStripLights.set(index, light);
}

function createLights() {
  "use strict";
  createDirectionalLight();
  createAmbientLight();
}

function toggleDirectionalLight() {
  "use strict";
  const light = globalLights.get("directionalLight");
  light.visible = !light.visible;
}

function toogleMobiusStripLights() {
  "use strict";
  mobiusStripLights.forEach((light) => {
    light.visible = !light.visible;
  });
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function mobiusStripParameters(u, v) {
  const x = (1 + (v / 2) * Math.cos(u / 2)) * Math.cos(u);
  const y = (1 + (v / 2) * Math.cos(u / 2)) * Math.sin(u);
  const z = (v / 2) * Math.sin(u / 2);
  return [x, y, z];
}

function getTriangleCentroid(p0, p1, p2) {
  const x = (p0[0] + p1[0] + p2[0]) / 3;
  const y = (p0[1] + p1[1] + p2[1]) / 3;
  const z = (p0[2] + p1[2] + p2[2]) / 3;
  return [x, y, z];
}

function createMobiusStripVertices() {
  const N = 21;
  const verticesArray = [];
  const SCALE_FACTOR = UNIT * 4;
  let k = 0;
  let nLights = 0;
  let pointLightSpacing = Math.round((N * N) / N_POINT_LIGHTS);

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const u0 = (i / N) * 2 * Math.PI;
      const u1 = ((i + 1) / N) * 2 * Math.PI;
      const v0 = (j / N) * 2 - 1;
      const v1 = ((j + 1) / N) * 2 - 1;

      const p0 = mobiusStripParameters(u0, v0);
      const p1 = mobiusStripParameters(u1, v0);
      const p2 = mobiusStripParameters(u0, v1);
      const p3 = mobiusStripParameters(u1, v1);

      // multiply by SCALE_FACTOR to scale the mobius strip
      p0[0] *= SCALE_FACTOR;
      p0[1] *= SCALE_FACTOR;
      p0[2] *= SCALE_FACTOR;
      p1[0] *= SCALE_FACTOR;
      p1[1] *= SCALE_FACTOR;
      p1[2] *= SCALE_FACTOR;
      p2[0] *= SCALE_FACTOR;
      p2[1] *= SCALE_FACTOR;
      p2[2] *= SCALE_FACTOR;
      p3[0] *= SCALE_FACTOR;
      p3[1] *= SCALE_FACTOR;
      p3[2] *= SCALE_FACTOR;

      verticesArray.push(...p0);
      verticesArray.push(...p1);
      verticesArray.push(...p2);

      verticesArray.push(...p1);
      verticesArray.push(...p3);
      verticesArray.push(...p2);

      if (k % pointLightSpacing === 0 && nLights < N_POINT_LIGHTS) {
        pointLightLocations.push(getTriangleCentroid(p0, p1, p2));
        nLights++;
      }

      k++;
    }
  }
  pointLightLocations = pointLightLocations.map((point) => {
    return [point[0], point[1], point[2]];
  });
  return verticesArray;
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

function rotateParametricObjects() {
  parametricObjects.forEach((object) => {
    object.rotation.y += 0.01;
  });
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
    case Primitives.MOBIUS_STRIP:
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      geometry.vertices = vertices;
      break;

    default:
      break;
  }

  object.add(new THREE.Mesh(geometry, objectVals.material));
  sceneObjects.set(objectVals.name, object);
  return object;
}

function createMobiusStrip() {
  const mobiusStrip = createObject(mobiusStripVals);
  mobiusStripStructure.add(mobiusStrip);

  mobiusStripStructure.position.set(
    mobiusStripVals.positionX,
    mobiusStripVals.positionY,
    mobiusStripVals.positionZ
  );

  // Add point ligths to the mobius strip
  pointLightLocations.forEach((point) => {
    // send also index of point to create a unique name for the light
    createPointLight(point, pointLightLocations.indexOf(point));
  });

  mobiusStripStructure.rotation.x += Math.PI / 2;
  scene.add(mobiusStripStructure);
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
      new THREE.MeshLambertMaterial({ color: colors.white })
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
  var material = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  var sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  sphere.rotation.x = Math.PI;
}

//////////////////////
/* PARAMETRIC OBJECTS */
//////////////////////
function hyperbolicParaboloid(u, v, target) {
  const a = 1,
    b = 1;
  u = (u - 0.5) * 2;
  v = (v - 0.5) * 2;
  const x = u;
  const y = v;
  const z = (u * u) / (a * a) - (v * v) / (b * b);
  target.set(x, y, z);
}

function torus(u, v, target) {
  const R = 1,
    r = 0.3;
  u = u * Math.PI * 2;
  v = v * Math.PI * 2;
  const x = (R + r * Math.cos(v)) * Math.cos(u);
  const y = (R + r * Math.cos(v)) * Math.sin(u);
  const z = r * Math.sin(v);
  target.set(x, y, z);
}

function kleinBottle(u, v, target) {
  u = u * Math.PI * 2;
  v = v * Math.PI * 2;
  const a = 3;
  let x, y, z;
  if (u < Math.PI) {
    x =
      3 * Math.cos(u) * (1 + Math.sin(u)) +
      2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
    y = 8 * Math.sin(u) + 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
  } else {
    x =
      3 * Math.cos(u) * (1 + Math.sin(u)) +
      2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
    y = 8 * Math.sin(u);
  }
  z = 2 * (1 - Math.cos(u) / 2) * Math.sin(v);
  target.set(x, y, z);
}

function catenoid(u, v, target) {
  const a = 1;
  u = (u - 0.5) * 4;
  v = v * Math.PI * 2;
  const x = a * Math.cosh(u) * Math.cos(v);
  const y = a * Math.cosh(u) * Math.sin(v);
  const z = u;
  target.set(x, y, z);
}

function helicoid(u, v, target) {
  const a = 1;
  u = (u - 0.5) * 4;
  v = v * Math.PI * 2;
  const x = u * Math.cos(v);
  const y = u * Math.sin(v);
  const z = a * v;
  target.set(x, y, z);
}

function enneperSurface(u, v, target) {
  u = (u - 0.5) * 4;
  v = (v - 0.5) * 4;
  const x = u - u ** 3 / 3 + u * v ** 2;
  const y = v - v ** 3 / 3 + v * u ** 2;
  const z = u ** 2 - v ** 2;
  target.set(x, y, z);
}

function boySurface(u, v, target) {
  u = u * Math.PI;
  v = v * 2 * Math.PI;
  const x =
    (Math.cos(u) * Math.sin(v)) /
    (Math.sqrt(2) - Math.sin(2 * u) * Math.sin(3 * v));
  const y =
    (Math.sin(u) * Math.sin(v)) /
    (Math.sqrt(2) - Math.sin(2 * u) * Math.sin(3 * v));
  const z = Math.cos(u) / (Math.sqrt(2) - Math.sin(2 * u) * Math.sin(3 * v));
  target.set(x, y, z);
}

function romanSurface(u, v, target) {
  u = (u - 0.5) * Math.PI * 2;
  v = (v - 0.5) * Math.PI * 2;
  const x = Math.cos(u) * Math.sin(v);
  const y = Math.sin(u) * Math.sin(v);
  const z = Math.cos(u) * Math.cos(v);
  target.set(x, y, z);
}

const parametricFunctions = [
  hyperbolicParaboloid,
  torus,
  kleinBottle,
  catenoid,
  helicoid,
  enneperSurface,
  boySurface,
  romanSurface,
];

function createParametricObjects() {
  const innerRing = sceneObjects.get("innerRing");
  const middleRing = sceneObjects.get("middleRing");
  const outerRing = sceneObjects.get("outerRing");
  createRingParametricObjects(innerRing, innerRingVals);
  createRingParametricObjects(middleRing, middleRingVals);
  createRingParametricObjects(outerRing, outerRingVals);
}

function createRingParametricObjects(ring, ringVals) {
  const radius = ringVals.outerRadius;
  const height = ringVals.height;
  const step = (Math.PI * 2) / objectsPerRing;
  parametricFunctions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < objectsPerRing; i++) {
    // sort parametricFunctions randomly
    const object = new THREE.Object3D();
    const geometry = new ParametricGeometry(parametricFunctions[i], 100, 100);
    const material = new THREE.MeshLambertMaterial({ color: colors.white });
    object.add(new THREE.Mesh(geometry, material));
    object.position.set(
      radius * Math.cos(i * step) * 0.85,
      height / UNIT + 0.4 * UNIT,
      radius * Math.sin(i * step) * 0.85
    );

    // scale up if object is too small
    object.children[0].geometry.computeBoundingSphere();
    const scale = Math.random() * (60 - 30) + 30;
    const scaleFactor = object.children[0].geometry.boundingSphere.radius;

    object.scale.set(
      scale / scaleFactor,
      scale / scaleFactor,
      scale / scaleFactor
    );

    // rotate object
    object.rotation.x = Math.random() * Math.PI;
    object.rotation.y = Math.random() * Math.PI;
    object.rotation.z = Math.random() * Math.PI;
    ring.add(object);
    parametricObjects.set(`object${i}-${ringVals.name}`, object);
    sceneObjects.set(`object${i}-${ringVals.name}`, object);
  }
}

//////////////////////
/* TOGGLE MATERIALS */
//////////////////////

function changeMaterials(material) {
  latestMaterial = material;
  if (!isShadingActive) {
    return;
  }

  switch (material) {
    case "gouraud":
      sceneObjects.forEach((object) => {
        let c = object.children[0].material.color;
        console.log(c);
        object.children[0].material = new THREE.MeshLambertMaterial({
          color: c,
        });
      });
      break;
    case "phong":
      sceneObjects.forEach((object) => {
        let c = object.children[0].material.color;
        object.children[0].material = new THREE.MeshPhongMaterial({ color: c });
      });
      break;
    case "cartoon":
      sceneObjects.forEach((object) => {
        let c = object.children[0].material.color;
        object.children[0].material = new THREE.MeshToonMaterial({ color: c });
      });
      break;
    case "normal":
      sceneObjects.forEach((object) => {
        let c = object.children[0].material.color;
        object.children[0].material = new THREE.MeshNormalMaterial();
        object.children[0].material.color = c;
      });
      break;
    default:
      console.log("Material not found");
      break;
  }
}

function deactivateShading() {
  sceneObjects.forEach((object) => {
    let c = object.children[0].material.color;
    object.children[0].material = new THREE.MeshBasicMaterial({ color: c });
  });
}

function activateShading() {
  changeMaterials(latestMaterial);
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

////////////////////////
/* NOCLIP MOVEMENT */
////////////////////////
let controls;
const moveSpeed = 100;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

function checkNoCLipMovement() {
  "use strict";
  const moveDistance = (moveSpeed * delta) / 10;
  if (moveForward) controls.moveForward(moveDistance);
  if (moveBackward) controls.moveForward(-moveDistance);
  if (moveLeft) controls.moveRight(-moveDistance);
  if (moveRight) controls.moveRight(moveDistance);
  if (moveUp) controls.getObject().position.y += moveDistance;
  if (moveDown) controls.getObject().position.y -= moveDistance;
}

function addNoClipControls() {
  ("use strict");
  // noClip
  // Initialize PointerLockControls
  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  // Pointer lock event listeners
  document.addEventListener("click", () => {
    controls.lock();
  });

  controls.addEventListener("lock", () => {
    console.log("Pointer locked");
  });

  controls.addEventListener("unlock", () => {
    console.log("Pointer unlocked");
  });
}

/////////
/* END */
/////////

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

  // move Rings up and down
  moveInnerRing();
  moveMiddleRing();
  moveOuterRing();

  rotateParametricObjects();

  checkNoCLipMovement();
}

function moveInnerRing() {
  if (innerRingTranslationVals.inMotion === MOVING) {
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
  ("use strict");
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  createScene();
  createCameras();

  // create object functions
  /* let cube = new THREE.Mesh(
    new THREE.BoxGeometry(20 * UNIT, 20 * UNIT, 20 * UNIT),
    new THREE.MeshNormalMaterial()
  );
  scene.add(cube); */

  createSkyBox();
  createMerryGoRound();
  createMobiusStrip();
  createParametricObjects();
  createLights();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize", onResize);
  addNoClipControls();
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
    cameras.forEach((camera) => {
      if (camera.isPerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight;
      } else {
        camera.left = -window.innerWidth / 2;
        camera.right = window.innerWidth / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = -window.innerHeight / 2;
      }
      camera.updateProjectionMatrix();
    });
  }
}

///////////////////////
/* Heads-Up Display  */
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
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
  "use strict";
  switch (e.keyCode) {
    case 49: //1
      makeButtonActive("1");
      if (innerRingTranslationVals.inMotion === MOVING) {
        innerRingTranslationVals.inMotion = STOPPED;
      } else {
        innerRingTranslationVals.inMotion = MOVING;
      }
      break;
    case 50: //2
      makeButtonActive("2");
      if (middleRingTranslationVals.inMotion === MOVING) {
        middleRingTranslationVals.inMotion = STOPPED;
      } else {
        middleRingTranslationVals.inMotion = MOVING;
      }
      break;
    case 51: //3
      makeButtonActive("3");
      if (outerRingTranslationVals.inMotion === MOVING) {
        outerRingTranslationVals.inMotion = STOPPED;
      } else {
        outerRingTranslationVals.inMotion = MOVING;
      }
      break;
    case 68 || 100: // d or D
      makeButtonActive("D");
      toggleDirectionalLight();
      break;
    case 37: // left arrow
      moveLeft = true;
      break;
    case 38: // up arrow
      moveForward = true;
      break;
    case 39: // right arrow
      moveRight = true;
      break;
    case 40: // down arrow
      moveBackward = true;
      break;
    // o or O
    case 79 || 111:
      moveUp = true;
      break;
    // l or L
    case 76 || 108:
      moveDown = true;
      break;
    case 48: // 0
      // return to initial position camera
      resetCamera();
      controls.unlock();
      break;
    case 80 || 112: // p or P
      makeButtonActive("P");
      toogleMobiusStripLights();
      break;
    case 83 || 115: // s or S
      makeButtonActive("S");
      break;
    case 81 || 113: // q or Q
      makeButtonActive("Q");
      changeMaterials("gouraud");
      break;
    case 87 || 119: // w or W
      makeButtonActive("W");
      changeMaterials("phong");
      break;
    case 69 || 101: // e or E
      makeButtonActive("E");
      changeMaterials("cartoon");
      break;
    case 82 || 114: // r or R
      makeButtonActive("R");
      changeMaterials("normal");
      break;
    case 84 || 116: // t or T
      makeButtonActive("T");
      if (isShadingActive) {
        isShadingActive = false;
        deactivateShading();
      } else {
        isShadingActive = true;
        activateShading();
      }
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
      makeButtonInactive("1");
      break;
    case 50: //2
      makeButtonInactive("2");
      break;
    case 51: //3
      makeButtonInactive("3");
      break;
    case 37: // left arrow
      moveLeft = false;
      break;
    case 38: // up arrow
      moveForward = false;
      break;
    case 39: // right arrow
      moveRight = false;
      break;
    case 40: // down arrow
      moveBackward = false;
      break;
    // o or O
    case 79 || 111:
      moveUp = false;
      break;
    // l or L
    case 76 || 108:
      moveDown = false;
      break;
    case 68 || 100: // d or D
      makeButtonInactive("D");
      break;
    case 80 || 112: // p or P
      makeButtonInactive("P");
      break;
    case 83 || 115: // s or S
      makeButtonInactive("S");
      break;
    case 81 || 113: // q or Q
      makeButtonInactive("Q");
      break;
    case 87 || 119: // w or W
      makeButtonInactive("W");
      break;
    case 69 || 101: // e or E
      makeButtonInactive("E");
      break;
    case 82 || 114: // r or R
      makeButtonInactive("R");
      break;
    case 84 || 116: // t or T
      makeButtonInactive("T");
      break;
    default:
      break;
  }
}

init();
animate();
