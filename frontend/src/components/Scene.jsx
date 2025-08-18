import { QuaternionScene } from '../components/QuaternionCube';

export function Scene({ objects, setObjects, className = "" }) {
  return (
    <div className={`card scene ${className}`}>
      <QuaternionScene/>
    </div>
  );
}

export default Scene;
