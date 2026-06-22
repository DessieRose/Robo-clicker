import { FiSettings } from "react-icons/fi";
import { useState } from "react";

const Toggle = ({ label, checked, onChange }) => (
  <div className="settings-toggle-row">
    <span>{label}</span>
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  </div>
);

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [music, setMusic] = useState(true);
  const [sfx, setSfx] = useState(true);

  return (
    <>
      <div className={"settings"} onClick={() => setIsOpen(!isOpen)}>
        <FiSettings className="icon" />
      </div>

      <div className={`settings-menu ${isOpen ? 'open' : ''}`}>
        <h3>Settings</h3>
        <Toggle label="Music" checked={music} onChange={() => setMusic(m => !m)} />
        <Toggle label="Sound effects" checked={sfx} onChange={() => setSfx(s => !s)} />
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          Close
        </button>
      </div>
    </>
  );
};

export default Settings;
