export function Scene({ objects, finalValues, className = "" }) {
  return (
    <div className={`card scene ${className}`}>
      <h2>Scene Objects</h2>
      <ul>
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
      </ul>
    </div>
  );
}

export default Scene;
