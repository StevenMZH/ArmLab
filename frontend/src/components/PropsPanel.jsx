import { useState, useEffect } from "react";
import { SimObject } from "../features/PropsPanel/components/SimObject";

export function SidePanel() {
  const [objects, setObjects] = useState(() => {
    // Al cargar, intenta obtener los objetos de localStorage
    const saved = localStorage.getItem("Objects");
    return saved ? JSON.parse(saved) : [];
  });
  const [openIndex, setOpenIndex] = useState(null);

  const handleAddObject = () => {
    const newId = Date.now();
    setObjects(prev => [
      ...prev,
      {
        id: newId,
        name: `Object ${prev.length + 1}`,
        position: { x: 0, y: 0, z: 0 },
        orientation: { x: 0, y: 0, z: 0 },
        frame: "Origen",
        transformations: []
      }
    ]);
  };

  // Actualiza los datos de un objeto
  const updateObject = (idx, newData) => {
    setObjects(prev =>
      prev.map((obj, i) => (i === idx ? { ...obj, ...newData } : obj))
    );

  };

  // Elimina el objeto por índice
  const deleteObject = idx => {
    setObjects(prev => prev.filter((_, i) => i !== idx));
    if (openIndex === idx) setOpenIndex(null);
    else if (openIndex > idx) setOpenIndex(openIndex - 1);
  };

  // Guarda en localStorage cada vez que objects cambie
  useEffect(() => {
    localStorage.setItem("Objects", JSON.stringify(objects));
    // Dispara evento para actualizar Scene
    window.dispatchEvent(new Event('objectsUpdated'));
  }, [objects]);

  return (
    <div className="card side-panel full-h">
      <div className="full-w">
        {objects.map((obj, idx) => (
          <SimObject
            key={obj.id}
            id={obj.id}
            name={obj.name}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            data={obj}
            updateData={newData => updateObject(idx, newData)}
            onDelete={() => deleteObject(idx)}
          />
        ))}
      </div>
      <div className="full-w">
        <button className="full-w hl1" onClick={handleAddObject}>
          Add Object
        </button>
      </div>
    </div>
  );
}
export default SidePanel;