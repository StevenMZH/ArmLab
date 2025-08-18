import { useEffect, useState } from 'react';
import { QuaternionScene } from '../components/QuaternionCube';
import * as THREE from 'three';


export function Scene({ objects, finalValues, className = "" }) {
  const [objects, setObjects] = useState([]);

  const applyTransformations = (object) => {
    // Asegura que los valores sean números
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
        'XYZ'
      )
    );

    object.transformations.forEach(t => {
      if (t.type === 'rotation') {
        const qRot = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            THREE.MathUtils.degToRad(Number(t.x)),
            THREE.MathUtils.degToRad(Number(t.y)),
            THREE.MathUtils.degToRad(Number(t.z)),
            'XYZ'
          )
        );
        quaternion.multiply(qRot);
      } else if (t.type === 'translation') {
        const translation = new THREE.Vector3(
          Number(t.x),
          Number(t.y),
          Number(t.z)
        );
        translation.applyQuaternion(quaternion);
        position.add(translation);
      }
    });

    const finalEuler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');
    const orientation = {
      x: THREE.MathUtils.radToDeg(finalEuler.x),
      y: THREE.MathUtils.radToDeg(finalEuler.y),
      z: THREE.MathUtils.radToDeg(finalEuler.z),
    };

    return {
      position: {
        x: Number(position.x),
        y: Number(position.y),
        z: Number(position.z)
      },
      orientation,
      quaternion: {
        x: Number(quaternion.x),
        y: Number(quaternion.y),
        z: Number(quaternion.z),
        w: Number(quaternion.w)
      }
    };
  };
    
  useEffect(() => {
    const updateObjects = () => {
      const storedObjects = JSON.parse(localStorage.getItem('Objects')) || [];
      const processed = storedObjects.map(obj => ({ ...obj, final: applyTransformations(obj) }));
      setObjects(processed);
    };

    window.addEventListener('storage', updateObjects);
    window.addEventListener('objectsUpdated', updateObjects);
    updateObjects();

    return () => {
      window.removeEventListener('storage', updateObjects);
      window.removeEventListener('objectsUpdated', updateObjects);
    };
  }, []);


  return (
    <div className={`card scene ${className}`}>
      {/* <h2>Scene Objects</h2>
      <ul>
        {objects.map(obj => (
          <li key={obj.id} style={{ marginBottom: '1rem' }}>
            <strong>{obj.name}</strong>
            <div>
              Position: x={obj.final.position.x.toFixed(2)}, y={obj.final.position.y.toFixed(2)}, z={obj.final.position.z.toFixed(2)}
            </div>
            <div>
              Orientation: x={obj.final.orientation.x.toFixed(2)}, y={obj.final.orientation.y.toFixed(2)}, z={obj.final.orientation.z.toFixed(2)}
            </div>
            <div>
              Quaternion: x={obj.final.quaternion.x.toFixed(3)}, y={obj.final.quaternion.y.toFixed(3)}, z={obj.final.quaternion.z.toFixed(3)}, w={obj.final.quaternion.w.toFixed(3)}
            </div>
          </li>
        ))}
      </ul> */}
      <QuaternionScene/>
        {Object.entries(objects).map(([key, obj]) => {
          const final = finalValues[key] || {
            quaternion: { w: 0, x: 0, y: 0, z: 0 },
            position: { x: 0, y: 0, z: 0 },
            orientation: { x: 0, y: 0, z: 0 },
          };

          return (
            <li key={key} style={{ marginBottom: "1rem" }}>
              <strong>{obj.name}</strong>
              <div>
                Quaternion: w={final.quaternion.w.toFixed(3)}, x={final.quaternion.x.toFixed(3)}, y={final.quaternion.y.toFixed(3)}, z={final.quaternion.z.toFixed(3)}
              </div>
              <div>
                Position: x={final.position.x.toFixed(2)}, y={final.position.y.toFixed(2)}, z={final.position.z.toFixed(2)}
              </div>
              <div>
                Orientation: x={final.orientation.x.toFixed(2)}, y={final.orientation.y.toFixed(2)}, z={final.orientation.z.toFixed(2)}
              </div>
            </li>
          );
        })}
    </div>
  );
}

export default Scene;
