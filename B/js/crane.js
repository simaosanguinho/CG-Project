import * as THREE from 'three';
import { UNIT } from './constants.js';

function createCube() {
    "use strict";
  
    let cube = new THREE.Mesh(
      new THREE.BoxGeometry(UNIT, UNIT, UNIT),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
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

export { createCube };