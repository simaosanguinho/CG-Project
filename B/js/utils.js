import * as THREE from "three";

import { Primitives } from "./constants.js";

let meshesToUpdate = [];

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

  /* let edges = new THREE.EdgesGeometry(mesh.geometry);
  let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
  // increase the size of the edges
  line.scale.set(1.1, 1.1, 1.1);

  object.add(line); */

  meshesToUpdate.push(mesh);
  return object;
}

function setPosition(object, vals) {
  "use strict";
  object.position.set(vals.positionX, vals.positionY, vals.positionZ);
}

function rotateObject(object, rotationVals, axis) {
  "use strict";

  switch (axis) {
    case AXIS.X:
      object.rotation.x = THREE.Math.clamp(
        object.userData.step * delta + object.rotation.x,
        rotationVals.min,
        rotationVals.max
      );
      break;

    case AXIS.Y:
      object.rotation.y += THREE.Math.clamp(
        object.userData.step * delta + object.rotation.y,
        rotationVals.min,
        rotationVals.max
      );
      break;

    case AXIS.Z:
      object.rotation.z += THREE.Math.clamp(
        object.userData.step * delta + object.rotation.z,
        rotationVals.min,
        rotationVals.max
      );
      break;

    default:
      console.log("Axis not found");
  }
}

function getMeshesToUpdate() {
  return meshesToUpdate;
}

export { createObject, setPosition , getMeshesToUpdate};
