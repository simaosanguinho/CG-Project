import * as THREE from 'three';

const UNIT = 200;

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
};

const cameraValues = [
    [0, 0, 1000],
    [1000, 0, 0],
    [0, 1000, 0],
    [2000, 1000, 3000],
    [1000, 1000, 1000],
    [500, 2000, 2000],
 ];


export { UNIT, Primitives, AXIS, cameraValues, CLOCK, DELTA_MULT, backgroundColor, fov, minViewDistance, maxViewDistance };