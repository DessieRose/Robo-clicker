import React, { useState, useRef, useEffect } from "react";

const Level = ({ level, maxLevel, onLevelSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  const levels = [];
  for (let i = maxLevel; i >= 1; i--) levels.push(i);

  return (
    <div className="levelNum" ref={ref} onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", touchAction: "manipulation" }}>
      <h2>{level}</h2>
      {open && (
        <div className="level-dropdown">
          {levels.map(l => (
            <button
              key={l}
              className={`level-dropdown-item${l === level ? " active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onLevelSelect(l);
                setOpen(false);
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Level;
