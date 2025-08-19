import { useState } from "react";
import { SimObject } from "../features/PropsPanel/components/SimObject";

export function PropsPanel({ objects, setObjects, finalValues }) {
  const [openId, setOpenId] = useState(null);

  const handleAddObject = () => {
    const newId = Date.now();
    setObjects(prev => ({
      ...prev,
      [newId]: {
        name: `Object ${Object.keys(prev).length + 1}`,
        position: { x: 0, y: 0, z: 0 },
        orientation: { x: 0, y: 0, z: 0 },
        frame: "Origen",
        transformations: []
      }
    }));
  };

  const updateObject = (id, newData) => {
    setObjects(prev => ({
      ...prev,
      [id]: { ...prev[id], ...newData }
    }));
  };

  const deleteObject = (id) => {
    const { [id]: removed, ...rest } = objects;
    setObjects(rest);
    if (openId === id) setOpenId(null);
  };

  return (
    <div className="card side-panel full-h">
      {Object.entries(objects).map(([id, obj]) => (
        <SimObject
          key={id}
          id={id}
          name={obj.name}
          isOpen={openId === id}
          onToggle={() => setOpenId(openId === id ? null : id)}
          data={obj}
          updateData={(newData) => updateObject(id, newData)}
          onDelete={() => deleteObject(id)}
          finalValues={finalValues[id]}
        />
      ))}

      <button className="full-w hl1 add_object" onClick={handleAddObject}>
        Add Object
      </button>
    </div>
  );
}

export default PropsPanel;
