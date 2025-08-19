import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export function QuaternionCube({ quaternion }) {
  const cubeRef = useRef();

  useFrame(() => {
    if (quaternion) {
      cubeRef.current.quaternion.copy(quaternion);
    }
  });

  return (
    <group ref={cubeRef}>
      {/* Cube's style */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#b6fffbff" transparent opacity={0.5} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color="black" />
      </lineSegments>
    </group>
  );
}

// Escena principal
export function QuaternionScene() {
  //  quaternion que rota 45° en el eje Y
  const q = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 0),
    Math.PI / 4
  );

  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
        <axesHelper args={[5]} />
      {/* Grupo de referencia */}
      <group position={[1, 0, 0]}>
        <QuaternionCube quaternion={q} />
      </group>
      <OrbitControls />
    </Canvas>
  );
}
