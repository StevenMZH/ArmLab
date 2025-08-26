// ...existing code...
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export function QuaternionCube({ quaternion, id }) {
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
    <group ref={cubeRef} name={id}>
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
export function QuaternionScene({ objects = {}, setObjects }) {
  // helper: obtener entries con id como key
  const getEntries = (objs) => {
    if (!objs) return [];
    if (Array.isArray(objs)) return objs.map((o, i) => [String(i), o]);
    if (typeof objs === "object") return Object.entries(objs);
    return [];
  };

  const toNumber = (v) => {
    if (v === undefined || v === null) return 0;
    if (typeof v === "string") {
      const n = parseFloat(v);
      return Number.isNaN(n) ? 0 : n;
    }
    return typeof v === "number" ? v : Number(v) || 0;
  };

  const degToRad = (d) => THREE.MathUtils.degToRad(toNumber(d));

  // aplica transformaciones y devuelve position (Vector3) y quaternion (Quaternion)
  const applyTransformations = (object) => {
    const position = new THREE.Vector3(
      toNumber(object.position?.x),
      toNumber(object.position?.y),
      toNumber(object.position?.z)
    );

    // quaternion inicial desde orientation (Euler en grados)
    const quat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        degToRad(object.orientation?.x ?? 0),
        degToRad(object.orientation?.y ?? 0),
        degToRad(object.orientation?.z ?? 0),
        "XYZ"
      )
    );

    // aplicar transformaciones en orden
    (object.transformations || []).forEach((t) => {
      if (!t || !t.type) return;
      if (t.type === "rotation") {
        // rotación en Euler (grados)
        const qRot = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(degToRad(t.x ?? 0), degToRad(t.y ?? 0), degToRad(t.z ?? 0), "XYZ")
        );
        // composicion: aplicar rotación después de la actual (post-multiplicar)
        quat.multiply(qRot);
      } else if (t.type === "translation") {
        // traslación (números en las mismas unidades que position)
        const trans = new THREE.Vector3(toNumber(t.x), toNumber(t.y), toNumber(t.z));
        // si las traslaciones deben respetar la orientación actual, aplicar quaternion al vector
        trans.applyQuaternion(quat);
        position.add(trans);
      }
    });

    return { position, quaternion: quat };
  };

  const entries = getEntries(objects);
  // escoger primer target para CameraFollower (si hay varios, usa el primero)
  const firstTarget = (() => {
    if (!entries.length) return new THREE.Vector3(0, 0, 0);
    const [, obj] = entries[0];
    const applied = applyTransformations(obj);
    // aplicar escala / división si tu escena la usa; aquí mantengo valores crudos
    return applied.position.clone();
  })();

  // CameraFollower: solo reacciona cuando cambia la posición del objeto (target)
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

      lastTargetRef.current.set(target.x, target.y, target.z);

      const nx = target.x > camera.position.x ? target.x + offset[0] : camera.position.x;
      const ny = target.y > camera.position.y ? target.y + offset[1] : camera.position.y;
      const nz = target.z > camera.position.z ? target.z + offset[2] : camera.position.z;

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
      <axesHelper args={[8]} />

      {entries.length === 0 ? (
        // default cube when no objects
        <group position={[0, 0, 0]}>
          <QuaternionCube quaternion={new THREE.Quaternion()} id={"_default"} />
        </group>
      ) : (
        entries.map(([id, obj]) => {
          const { position, quaternion } = applyTransformations(obj);
          // si tu escena escala posiciones (antes usabas /5) aplícalo aquí:
          const scenePos = [position.x / 5.0, position.y / 5.0, position.z / 5.0];
          return (
            <group key={id} position={scenePos}>
              <QuaternionCube quaternion={quaternion} id={id} />
            </group>
          );
        })
      )}

      <CameraFollower target={firstTarget} controlsRef={controlsRef} offset={[5, 5, 5]} />
      <OrbitControls ref={controlsRef} />
    </Canvas>
  );
}
// ...existing code...