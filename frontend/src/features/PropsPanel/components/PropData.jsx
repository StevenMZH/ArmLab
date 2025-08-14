import Props from "./Props";

// Data
export function PropActualValues() {
  return (
    <Props name="ActualValues" icon="PropsPanel/transformation.png" className="column" padding={30} contractible={true}>
      <div className="column full-w">
        <Props name="Quaternion" icon="PropsPanel/quaternion.svg" className="" padding={45} contractible={false}>
          <div className="prop-data full-w row center gap10">
              <div className="row gap5"> <p>w</p> <div className="card object-value">0</div> </div>
              <div className="row gap5"> <p>x</p> <div className="card object-value">0</div> </div>
              <div className="row gap5"> <p>y</p> <div className="card object-value">0</div> </div>
              <div className="row gap5"> <p>z</p> <div className="card object-value">0</div> </div>
          </div>
        </Props>
        <Props name="Position" icon="PropsPanel/translation.png" className="" padding={45} contractible={false}>
          <div className="prop-data full-w row center gap10">
              <div className="row gap5"> <p>x</p> <div className="card object-value">0</div> </div>
              <div className="row gap5"> <p>y</p> <div className="card object-value">0</div> </div>
              <div className="row gap5"> <p>z</p> <div className="card object-value">0</div> </div>
          </div>
        </Props>
        <Props name="Orientation" icon="PropsPanel/rotation.png" className="" padding={45} contractible={false}>
            <div className="prop-data full-w row center gap10">
              <div className="row gap5"> <p>x</p> <div className="card object-value">0</div> </div>
              <div className="row gap5"> <p>y</p> <div className="card object-value">0</div> </div>
              <div className="row gap5"> <p>z</p> <div className="card object-value">0</div> </div>
            </div>
        </Props>
      </div>
    </Props>
  );
}

// Initial Props
export function PropInit({ position, setPosition, orientation, setOrientation, frame, setFrame }) {
  return (
    <Props name="Base Properties" icon="PropsPanel/transformation.png" className="column" padding={30} contractible={true}>
      <div className="column full-w">
        <PropInitPosition position={position} setPosition={setPosition} />
        <PropInitOrientation orientation={orientation} setOrientation={setOrientation} />
        <PropFrame frame={frame} setFrame={setFrame} />
      </div>
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

export function PropFrame({ frame, setFrame}) {
  const objects = JSON.parse(localStorage.getItem("Objects")) || [];
  <PropFrame frame={frame} setFrame={setFrame} objects={objects} />
  return (
    <Props name="Reference Frame" icon="PropsPanel/reference.png" className="row icon-size3" padding={45} contractible={false}>
      <div className="prop-data full-w row center gap10">
        <select
          className="full-w"
          value={frame}
          onChange={e => setFrame(e.target.value)}
        >
          <option value="Origen">Origen</option>
          {objects.map(obj => (
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
      <div className="column full-w">
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
      <div className="row-right prop-container">
        <button className="hl2" onClick={handleAddTranslation}>Add Translation</button>
        <button className="hl2" onClick={handleAddRotation}>Add Rotation</button>
      </div>
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