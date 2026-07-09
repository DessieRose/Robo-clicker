import { FiSettings } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Toggle = ({ label, checked, onChange }) => (
  <div className="settings-toggle-row">
    <span>{label}</span>
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  </div>
);

const getFirstName = (email) => {
  const local = email.split('@')[0].split(/[._]/)[0].replace(/\d+$/, '');
  return local.charAt(0).toUpperCase() + local.slice(1);
};

const Settings = ({ music, setMusic, sfx, setSfx }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signIn, signUp, signOut } = useAuth();

  return (
    <>
      <div className={"settings"} onClick={() => setIsOpen(!isOpen)}>
        <FiSettings className="icon" />
      </div>

      <div className={`settings-menu ${isOpen ? 'open' : ''}`}>
        <h3>Settings</h3>
        <Toggle label="Music" checked={music} onChange={() => setMusic(m => !m)} />
        <Toggle label="Sound effects" checked={sfx} onChange={() => setSfx(s => !s)} />
        {!user && (
          <>
            <button className="signin-btn" onClick={() => { signIn(); }}>
              Login
            </button>
            <button className="signup-btn" onClick={() => { signUp(); }}>
              Sign Up
            </button>
          </>
        )}

        {user && (
          <>
            <p className="settings-username">You are signed in as:</p>
            <p className="settings-username">{getFirstName(user.email)}</p>
            <button className="signout-btn" onClick={() => { signOut(); }}>
              Log Out
            </button>
          </>
        )}
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          Close
        </button>
      </div>
    </>
  );
};

export default Settings;
