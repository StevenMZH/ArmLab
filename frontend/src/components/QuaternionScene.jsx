import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export function QuaternionCube({ position, quaternion }) {
  const cubeRef = useRef();

  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: "#B71234" }),
      new THREE.MeshStandardMaterial({ color: "#ff6200" }),
      new THREE.MeshStandardMaterial({ color: "#FFFFFF" }),
      new THREE.MeshStandardMaterial({ color: "#FFD500" }),
      new THREE.MeshStandardMaterial({ color: "#009B48" }),
      new THREE.MeshStandardMaterial({ color: "#0045AD" }),
    ],
    []
  );

  useFrame(() => {
    if (quaternion && cubeRef.current) {
      cubeRef.current.quaternion.copy(quaternion);
    }
  });

  return (
    <group ref={cubeRef} position={position}>
      <mesh material={materials}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.5)]} />
        <lineBasicMaterial color="black" />
      </lineSegments>
    </group>
  );
}

export function QuaternionScene({ objects }) {
  const toNumber = (v) => {
    if (v === undefined || v === null) return 0;
    if (typeof v === "string") {
      const n = parseFloat(v);
      return Number.isNaN(n) ? 0 : n;
    }
    return typeof v === "number" ? v : Number(v) || 0;
  };

  const toRad = (v) => (toNumber(v) * Math.PI) / 180;

  const applyTransformations = (object, parentPosition = new THREE.Vector3(0, 0, 0)) => {
    const position = new THREE.Vector3(
      toNumber(object.position?.x / 5.0),
      toNumber(object.position?.y / 5.0),
      toNumber(object.position?.z / 5.0)
    ).add(parentPosition); // Sumar la posición del padre

    const quaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        toRad(object.orientation?.x ?? 0),
        toRad(object.orientation?.y ?? 0),
        toRad(object.orientation?.z ?? 0),
        "XYZ"
      )
    );

    (object.transformations || []).forEach((t) => {
      if (!t || !t.type) return;
      if (t.type === "translation") {
        const translation = new THREE.Vector3(
          toNumber(t.x / 5.0),
          toNumber(t.y / 5.0),
          toNumber(t.z / 5.0)
        );
        position.add(translation);
      } else if (t.type === "rotation") {
        const rotation = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            toRad(t.x ?? 0),
            toRad(t.y ?? 0),
            toRad(t.z ?? 0),
            "XYZ"
          )
        );
        quaternion.multiply(rotation);
      }
    });

    return { position, quaternion };
  };

  const transformedObjects = Object.entries(objects).map(([id, obj]) => {
    const parent = objects[obj.frame]; // Buscar el objeto padre por el ID en "frame"
    const parentPosition = parent
      ? applyTransformations(parent).position // Obtener la posición del padre
      : new THREE.Vector3(0, 0, 0); // Si no hay padre, usar el origen
    return applyTransformations(obj, parentPosition);
  });

  const farthestObject = transformedObjects.reduce(
    (farthest, current) => {
      const currentDistance = current.position.length();
      return currentDistance > farthest.distance
        ? { distance: currentDistance, position: current.position }
        : farthest;
    },
    { distance: 0, position: new THREE.Vector3(0, 0, 0) }
  );

  function CameraFollower({ target, controlsRef, offset = [5, 5, 5] }) {
    const { camera } = useThree();
    const lastTargetRef = useRef(new THREE.Vector3(Infinity, Infinity, Infinity));

    useFrame(() => {
      if (!target) return;

      if (
        target.x === lastTargetRef.current.x &&
        target.y === lastTargetRef.current.y &&
        target.z === lastTargetRef.current.z
      ) {
        return;
      }

      lastTargetRef.current.copy(target);

      const nx = target.x + offset[0];
      const ny = target.y + offset[1];
      const nz = target.z + offset[2];

      camera.position.set(nx, ny, nz);

      if (controlsRef && controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    });

    return null;
  }

  const controlsRef = useRef();

  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} />
      <axesHelper args={[20]} />

      {transformedObjects.map((obj, index) => (
        <QuaternionCube
          key={index}
          position={obj.position.toArray()}
          quaternion={obj.quaternion}
        />
      ))}

      <CameraFollower
        target={farthestObject.position}
        controlsRef={controlsRef}
        offset={[5, 5, 5]}
      />
      <OrbitControls ref={controlsRef} />
    </Canvas>
  );
}