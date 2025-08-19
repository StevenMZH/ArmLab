import { useState } from "react";
import { PropActualValues, PropInit, PropTransformation } from "./PropData";

export function SimObject({ name = '', isOpen, onToggle, data, updateData, onDelete, id, finalValues}) {
  const open = isOpen;
  const handleToggle = onToggle;

  return (
    <div className={`props object column full-w contractible ${open ? " object-selected" : ""}`}>
      <button className="full-w row-left gap5 prop-button" onClick={handleToggle} style={{ paddingLeft: "15px" }}>
        <div className="full-w row gap10">
          <img src="PropsPanel/object.png" alt={`${name} icon`} className="icon" />
          <p>{name}</p> 
        </div>
        { open ? (
          <img src="PropsPanel/close.png" alt="Close object" className="icon icon-size2"/>
        ):(
          <img src="PropsPanel/open.png" alt="Open object" className="icon icon-size2"/>
        )}
      </button>

      {open && (
        <div className="object-props full-w column">
          <PropActualValues finalValues={finalValues}/>
          
          <PropInit
            position={data.position}
            setPosition={pos => updateData({ position: pos })}
            orientation={data.orientation}
            setOrientation={ori => updateData({ orientation: ori })}
            frame={data.frame}
            setFrame={frame => updateData({ frame })}
            object_id = {id}
          />

          <PropTransformation
            transformations={data.transformations}
            setTransformations={t => updateData({ transformations: t })}
          />
          
          <button className="full-w hl1 object-delete" onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default SimObject;