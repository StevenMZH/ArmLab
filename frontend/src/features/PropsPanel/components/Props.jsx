import { useState } from 'react';

export function Props({ 
  children, 
  className = '', 
  name = '', 
  icon = '', 
  padding = 15,
  isOpen: controlledOpen,
  onToggle,
  contractible = true,
  deletable = false,
  onDelete // <-- agrega la prop para borrar
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Si es contractible, usa el estado; si no, siempre abierto
  const open = contractible
    ? (controlledOpen !== undefined ? controlledOpen : isOpen)
    : true;

  const toggleOpen = contractible
    ? (onToggle || (() => setIsOpen(prev => !prev)))
    : undefined;

  const identation = { paddingLeft: `${padding}px` };

  return (
    <div className={`props column full-w ${className}`}>
      {contractible ? (
        <button className="full-w row-left gap10 prop-button" onClick={toggleOpen} style={identation}>
          {icon && <img src={icon} alt={`${name} icon`} className="icon" />}
          <p>{name}</p>
        </button>
      ) : (
        <div className="full-w row-left prop-title" style={identation}>
          <div className="full-w row-left gap5">
            {icon && <img src={icon} alt={`${name} icon`} className="icon" />}
            <p>{name}</p>
          </div>
          {deletable && (
            <button
              className='prop-button delete-button column center'
              onClick={onDelete}
            >
              <img src="delete.png" alt="Delete transformation" className='delete-icon icon'/>
            </button>
          )}
        </div>
      )}

      {open && (
        <div className="full-w column-left">
          {children}
        </div>
      )}
    </div>
  );
}

export default Props;