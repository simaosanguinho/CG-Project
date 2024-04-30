import * as THREE from "three";

import { Primitives } from "./constants.js";

function createObject(objectVals) {
  "use strict";

  const object = new THREE.Object3D();

  let geometry;

  switch (objectVals.type) {
    case Primitives.CUBE:
      console.log("Cube");
      geometry = new THREE.BoxGeometry(
        objectVals.width,
        objectVals.height,
        objectVals.depth
      );
      break;
    case Primitives.CYLINDER:
        console.log("Cylinder");
      geometry = new THREE.CylinderGeometry(
        objectVals.radiusTop,
        objectVals.radiusBottom,
        objectVals.height
      );
      break;
    case Primitives.TETRAEDRON:
        console.log("Tetrahedron");
        geometry = new THREE.TetrahedronGeometry(objectVals.radius);
        break;
    default:
      console.log("Object type not found");
      break;
  }
  // TODO: ADD MATERIAL
  const mesh = new THREE.Mesh(geometry, objectVals.material);
  object.add(mesh);

  return object;
}

function setPosition(object, values) {
    "use strict";
    object.position.set(values.positionX, values.positionY, values.positionZ);
  }


export { createObject, setPosition };