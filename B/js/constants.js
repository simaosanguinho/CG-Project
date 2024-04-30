import * as THREE from "three";

const UNIT = 40;

const CLOCK = new THREE.Clock();

const DELTA_MULT = 100;

const backgroundColor = 0xa2bce0;

const fov = 70;

const minViewDistance = 1;

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
  positionY: 0.5 * UNIT,
  positionZ: 1.5 * UNIT,
};

const baseVals = {
  width: 3 * UNIT,
  depth: 3 * UNIT,
  height: 1 * UNIT,
  positionX: 0 * UNIT,
  positionY: 0 * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.red}),
};

const towerVals = {
  width: 1 * UNIT,
  depth: 1 * UNIT,
  height: 12 * UNIT,
  positionX: 0 * UNIT,
  positionY: 6  * UNIT,
  positionZ: 0 * UNIT,
  type: Primitives.CUBE,
  material: new THREE.MeshBasicMaterial({ color: colors.green }),
};



export {
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
  colors,
  baseVals,
  towerVals,
  cranePosition,  
};
