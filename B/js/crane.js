import * as THREE from 'three';
import { UNIT, colors, baseVals, towerVals, cabVals, cranePosition } from './constants.js';
import { createObject, setPosition } from './utils.js';
import { scene } from './main-script.js';

let lowerStructure;



function createCube() {
    "use strict";
  
    let cube = new THREE.Mesh(
      new THREE.BoxGeometry(UNIT, UNIT, UNIT),
      new THREE.MeshBasicMaterial({ color: colors.green })
    );

    // add white limits
    let edges = new THREE.EdgesGeometry(cube.geometry);
    let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
    // increase the size of the edges
    line.scale.set(1.1, 1.1, 1.1);

    cube.add(line);
    
    cube.position.set(0, 0, 0);

    return cube;
  }

function createCrane() {
    "use strict";

    let crane = new THREE.Group();
    let lowerStructure = createLowerStructure();
    let upperStructuire = createUpperStructure();

    crane.add(lowerStructure);
    crane.add(upperStructuire);

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
    let group = new THREE.Group();
    const cab = createCab();

    group.add(cab);
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

export { createCrane };