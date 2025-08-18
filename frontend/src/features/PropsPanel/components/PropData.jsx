import Props from "./Props";

export function PropActualValues({ finalValues }) {
  const quaternion = finalValues?.quaternion || { w: 0, x: 0, y: 0, z: 0 };
  const position = finalValues?.position || { x: 0, y: 0, z: 0 };
  const orientation = finalValues?.orientation || { x: 0, y: 0, z: 0 };

  return (
    <Props name="Current Values" icon="PropsPanel/transformation.png" className="column" padding={30} contractible={true}>
      <div className="column full-w prop-group">
        <Props name="Quaternion" icon="PropsPanel/quaternion.svg" padding={45} contractible={false}>
          <div className="prop-data full-w row center gap10">
            <div className="row gap5"><p>w</p> <div className="card object-value">{quaternion.w.toFixed(3)}</div></div>
            <div className="row gap5"><p>x</p> <div className="card object-value">{quaternion.x.toFixed(3)}</div></div>
            <div className="row gap5"><p>y</p> <div className="card object-value">{quaternion.y.toFixed(3)}</div></div>
            <div className="row gap5"><p>z</p> <div className="card object-value">{quaternion.z.toFixed(3)}</div></div>
          </div>
        </Props>

        <Props name="Position" icon="PropsPanel/translation.png" padding={45} contractible={false}>
          <div className="prop-data full-w row center gap10">
            <div className="row gap5"><p>x</p> <div className="card object-value">{position.x.toFixed(2)}</div></div>
            <div className="row gap5"><p>y</p> <div className="card object-value">{position.y.toFixed(2)}</div></div>
            <div className="row gap5"><p>z</p> <div className="card object-value">{position.z.toFixed(2)}</div></div>
          </div>
        </Props>

        <Props name="Orientation" icon="PropsPanel/rotation.png" padding={45} contractible={false}>
          <div className="prop-data full-w row center gap10">
            <div className="row gap5"><p>x</p> <div className="card object-value">{orientation.x.toFixed(2)}</div></div>
            <div className="row gap5"><p>y</p> <div className="card object-value">{orientation.y.toFixed(2)}</div></div>
            <div className="row gap5"><p>z</p> <div className="card object-value">{orientation.z.toFixed(2)}</div></div>
          </div>
        </Props>
      </div>
      <div className="full-w"><hr/></div>
    </Props>
  );
}

export default PropActualValues;


// Initial Props
export function PropInit({ position, setPosition, orientation, setOrientation, frame, setFrame, object_id }) {
  return (
    <Props name="Base Properties" icon="PropsPanel/transformation.png" className="column" padding={30} contractible={true}>
      <div className="column full-w prop-group">
        <PropInitPosition position={position} setPosition={setPosition} />
        <PropInitOrientation orientation={orientation} setOrientation={setOrientation} />
        <PropFrame frame={frame} setFrame={setFrame} currentId={object_id}/>
      </div>
      <div className="full-w"><hr/></div>
    </Props>
  );
}

export function PropInitPosition({ position, setPosition }) {
  return (
    <Props name="Initial Position" icon="PropsPanel/translation.png" className="row" padding={45} contractible={false}>
      <div className="prop-data full-w row center gap10">
        {["x", "y", "z"].map(axis => (
          <div className="row gap5" key={axis}>
            <p>{axis}</p>
            <input
              type="text"
              value={position[axis]}
              onChange={e => setPosition({ ...position, [axis]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </Props>
  );
}

export function PropInitOrientation({ orientation, setOrientation }) {
  return (
    <Props name="Initial Orientation" icon="PropsPanel/rotation.png" className="row" padding={45} contractible={false}>
      <div className="prop-data full-w row center gap10">
        {["x", "y", "z"].map(axis => (
          <div className="row gap5" key={axis}>
            <p>{axis}</p>
            <input
              type="text"
              value={orientation[axis]}
              onChange={e => setOrientation({ ...orientation, [axis]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </Props>
  );
}

export function PropFrame({ frame, setFrame, currentId }) {
  const objectsDict = JSON.parse(localStorage.getItem("Objects")) || {};
  const filteredObjects = Object.entries(objectsDict)
    .filter(([id]) => id !== String(currentId)) // filtra por key, no por obj.id
    .map(([id, obj]) => ({ id, name: obj.name }));

  return (
    <Props name="Reference Frame" icon="PropsPanel/reference.png" className="row icon-size3" padding={45} contractible={false}>
      <div className="prop-data full-w row center gap10">
        <select
          className="full-w"
          value={frame}
          onChange={e => setFrame(e.target.value)}
        >
          <option value="Origen">Origen</option>
          {filteredObjects.map(obj => (
            <option key={obj.id} value={obj.id}>{obj.name}</option>
          ))}
        </select>
      </div>
    </Props>
  );
}


// Transformations
export function PropTransformation({ transformations, setTransformations }) {
  const handleAddTranslation = () => {
    setTransformations([
      ...transformations,
      { id: Date.now() + Math.random(), type: "translation", x: 0, y: 0, z: 0 }
    ]);
  };

  const handleAddRotation = () => {
    setTransformations([
      ...transformations,
      { id: Date.now() + Math.random(), type: "rotation", x: 0, y: 0, z: 0 }
    ]);
  };

  const handleChange = (idx, newData) => {
    setTransformations(
      transformations.map((t, i) => (i === idx ? { ...t, ...newData } : t))
    );
  };

  const handleDelete = id => {
    setTransformations(transformations.filter(t => t.id !== id));
  };

  return (
    <Props name="Transformations" icon="PropsPanel/transformation.png" className="column" padding={30} contractible={true}>
      <div className="column full-w prop-group">
        {transformations.map((item, idx) =>
          item.type === "translation"
            ? <PropTranslation
                key={item.id}
                data={item}
                onChange={newData => handleChange(idx, newData)}
                deletable={true}
                onDelete={() => handleDelete(item.id)}
              />
            : <PropRotation
                key={item.id}
                data={item}
                onChange={newData => handleChange(idx, newData)}
                deletable={true}
                onDelete={() => handleDelete(item.id)}
              />
        )}
      </div>
      <div className="row-right prop-container gap5">
        <button className="hl2" onClick={handleAddTranslation}>Add Translation</button>
        <button className="hl2" onClick={handleAddRotation}>Add Rotation</button>
      </div>
      <div className="full-w"><hr/></div>
    </Props>
  );
}

export function PropTranslation({ data, onChange, deletable, onDelete }) {
  return (
    <Props
      name="Translation"
      icon="PropsPanel/translation.png"
      className=""
      padding={45}
      contractible={false}
      deletable={deletable}
      onDelete={onDelete}
    >
      <div className="prop-data full-w row center gap10">
        {["x", "y", "z"].map(axis => (
          <div className="row gap5" key={axis}>
            <p>{axis}</p>
            <input
              type="text"
              value={data[axis]}
              onChange={e => onChange({ ...data, [axis]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </Props>
  );
}

export function PropRotation({ data, onChange, deletable, onDelete }) {
  return (
    <Props
      name="Rotation"
      icon="PropsPanel/rotation.png"
      className=""
      padding={45}
      contractible={false}
      deletable={deletable}
      onDelete={onDelete}
    >
      <div className="prop-data full-w row center gap10">
        {["x", "y", "z"].map(axis => (
          <div className="row gap5" key={axis}>
            <p>{axis}</p>
            <input
              type="text"
              value={data[axis]}
              onChange={e => onChange({ ...data, [axis]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </Props>
  );
}