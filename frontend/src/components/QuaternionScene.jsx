import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo} from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export function QuaternionCube({ quaternion }) {
  const cubeRef = useRef();

  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: "#FFFFFF" }),
      new THREE.MeshStandardMaterial({ color: "#FFD500" }),
      new THREE.MeshStandardMaterial({ color: "#B71234" }),
      new THREE.MeshStandardMaterial({ color: "#FF5800" }),
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
    <group ref={cubeRef}>
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

// Escena principal
export function QuaternionScene({ objects, setObjects }) {
  const getObject = (objs) => {
    if (!objs) return null;
    if (Array.isArray(objs)) return objs[0] ?? null;
    if (typeof objs === "object") {
      const vals = Object.values(objs);
      return vals[0] ?? null;
    }
    return null;
  };

  const toNumber = (v) => {
    if (v === undefined || v === null) return 0;
    if (typeof v === "string") {
      const n = parseFloat(v);
      return Number.isNaN(n) ? 0 : n;
    }
    return typeof v === "number" ? v : Number(v) || 0;
  };

  const toRad = (v) => (toNumber(v) * Math.PI) / 180;

  const obj = getObject(objects) || {
    orientation: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 0, z: 0 },
    transformations: [],
  };

  // posición base
  const position = new THREE.Vector3(
    (obj.position?.x) / 5.0 ?? 0,
    (obj.position?.y) / 5.0 ?? 0,
    (obj.position?.z) / 5.0 ?? 0
  );

  // quaternion inicial desde orientation (asume euler XYZ)
  const initialEuler = new THREE.Euler(
    toRad(obj.orientation?.x ?? 0),
    toRad(obj.orientation?.y ?? 0),
    toRad(obj.orientation?.z ?? 0),
    "XYZ"
  );
  const finalQuat = new THREE.Quaternion().setFromEuler(initialEuler);

  // aplica transformaciones en orden
  (obj.transformations || []).forEach((t) => {
    if (!t || !t.type) return;
    if (t.type === "translation") {
      position.add(
        new THREE.Vector3(t.x / 5.0 ?? 0, t.y / 5.0 ?? 0, t.z / 5.0 ?? 0)
      );
    } else if (t.type === "rotation") {
      // interpreta rotation como euler (x,y,z)
      const rotEuler = new THREE.Euler(
        toRad(t.x ?? 0),
        toRad(t.y ?? 0),
        toRad(t.z ?? 0),
        "XYZ"
      );
      const rotQ = new THREE.Quaternion().setFromEuler(rotEuler);
      // composicion: aplica la rotación de la transformación después de la actual
      finalQuat.multiply(rotQ);
    }
  });

  function CameraFollower({ target, controlsRef, offset = [5, 5, 5] }) {
    const { camera } = useThree();
    const lastTargetRef = useRef(new THREE.Vector3(Infinity, Infinity, Infinity));

    useFrame(() => {
      if (!target) return;

      // si el target no cambió desde la última vez, no hacemos nada
      if (
        target.x === lastTargetRef.current.x &&
        target.y === lastTargetRef.current.y &&
        target.z === lastTargetRef.current.z
      ) {
        return;
      }

      // marcamos el nuevo target (esto indica que el objeto cambió de posición)
      lastTargetRef.current.set(target.x, target.y, target.z);

      // lógica de movimiento (mantiene comportamiento previo: si target > cámara, saltar hacia target+offset)
      const nx = target.x > camera.position.x ? target.x + offset[0] : camera.position.x;
      const ny = target.y > camera.position.y ? target.y + offset[1] : camera.position.y;
      const nz = target.z > camera.position.z ? target.z + offset[2] : camera.position.z;

      // actualiza cámara y objetivo de controls solo cuando realmente cambia la posición
      if (nx !== camera.position.x || ny !== camera.position.y || nz !== camera.position.z) {
        camera.position.set(nx, ny, nz);
        if (controlsRef && controlsRef.current) {
          controlsRef.current.target.set(target.x, target.y, target.z);
          controlsRef.current.update();
        }
      }
      });

    return null;
  }

  const controlsRef = useRef();

  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <axesHelper args={[5]} />
      <group position={[position.x, position.y, position.z]}>
        <QuaternionCube quaternion={finalQuat} />
      </group>
      <CameraFollower target={position} controlsRef={controlsRef} offset={[5, 5, 5]} />
      <OrbitControls />
    </Canvas>
  );
}