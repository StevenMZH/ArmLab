import { QuaternionScene } from './QuaternionScene';

export function Scene({ objects, setObjects, className = "" }) {
  return (
    <div className={`card scene ${className}`}>
      <QuaternionScene
        objects={objects}
        setObjects={setObjects}
      />
    </div>
  );
}

export default Scene;
