import { useState, useEffect } from "react";
import Scene from "./Scene";
import PropsPanel from "./PropsPanel";
import * as THREE from "three";

export function SceneManager() {
  const [showPanel, setShowPanel] = useState(false);
  const [objects, setObjects] = useState(() => {
    const saved = localStorage.getItem("Objects");
    return saved ? JSON.parse(saved) : {};
  });

  const applyTransformations = (object) => {
    let position = new THREE.Vector3(
      Number(object.position.x),
      Number(object.position.y),
      Number(object.position.z)
    );
    let quaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        THREE.MathUtils.degToRad(Number(object.orientation.x)),
        THREE.MathUtils.degToRad(Number(object.orientation.y)),
        THREE.MathUtils.degToRad(Number(object.orientation.z)),
        "XYZ"
      )
    );

    object.transformations.forEach((t) => {
      if (t.type === "rotation") {
        const qRot = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            THREE.MathUtils.degToRad(Number(t.x)),
            THREE.MathUtils.degToRad(Number(t.y)),
            THREE.MathUtils.degToRad(Number(t.z)),
            "XYZ"
          )
        );
        quaternion.multiply(qRot);
      } else if (t.type === "translation") {
        const translation = new THREE.Vector3(
          Number(t.x),
          Number(t.y),
          Number(t.z)
        );
        translation.applyQuaternion(quaternion);
        position.add(translation);
      }
    });

    const finalEuler = new THREE.Euler().setFromQuaternion(quaternion, "XYZ");

    return {
      position: { x: position.x, y: position.y, z: position.z },
      orientation: {
        x: THREE.MathUtils.radToDeg(finalEuler.x),
        y: THREE.MathUtils.radToDeg(finalEuler.y),
        z: THREE.MathUtils.radToDeg(finalEuler.z),
      },
      quaternion: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
    };
  };

  const finalValues = Object.fromEntries(
    Object.entries(objects).map(([id, obj]) => [id, applyTransformations(obj)])
  );

  useEffect(() => {
    localStorage.setItem("Objects", JSON.stringify(objects));
    // console.log(objects)
  }, [objects]);

  return (
    <div className="full-view row gap5 scene-manager">
      <Scene objects={objects} setObjects={setObjects} />
      <button className="full-view hl1 center sidepanel-open mobile"  onClick={() => setShowPanel(true)} >Object Properties</button>
      <div className={`full-h column side-panel-container ${!showPanel ? "d_none" : ""}`}>
        <button className="full-view sidepanel-exit" onClick={() => setShowPanel(false)} ></button>
        <PropsPanel objects={objects} setObjects={setObjects} finalValues={finalValues} />
      </div>
    </div>
  );
}

export default SceneManager;
