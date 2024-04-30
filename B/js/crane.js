import * as THREE from 'three';
import { UNIT, colors, baseVals } from './constants.js';
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

    let  lowerStructure = createLowerStructure();
    lowerStructure.position.set(0, 0, 0);
    scene.add(lowerStructure);

    return lowerStructure;

}

function createLowerStructure() {
    "use strict";

    let group = new THREE.Group();
    // const tower = createTower();
    const base = createBase();

    group.add(base);
    // group.add(tower);
    return group;

}

function createBase() {
    "use strict";
    const base = createObject(baseVals);
    setPosition(base, baseVals);
    return base;
}

export { createCrane };