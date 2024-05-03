import * as THREE from "three";
import {
  UNIT,
  colors,
  baseVals,
  towerVals,
  cabVals,
  cranePosition,
  jibVals,
  upperTowerVals,
  counterWeightVals,
  trolleyVals,
  cableVals,
} from "./constants.js";
import { createObject, setPosition } from "./utils.js";
import { scene } from "./main-script.js";

let lowerStructure;

function createCrane() {
  "use strict";

  let crane = new THREE.Group();
  let lowerStructure = createLowerStructure();
  let upperStructure = createUpperStructure();

  crane.add(lowerStructure);
  crane.add(upperStructure);

  setPosition(crane, cranePosition);
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
  let group = new THREE.Group();
  const cab = createCab();
  const jib = createJib();
  const upperTower = createUpperTower();
  const counterWeight = createCounterWeight();
  const trolley = createTrolley();
  const cable = createCable();

  group.add(cab);
  group.add(jib);
  group.add(upperTower);
  group.add(counterWeight);
  group.add(trolley);
  group.add(cable);
  return group;
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

export { createCrane };
