import { FiSettings } from "react-icons/fi";
import { useState } from "react";

const Settings = () => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        <div className={"settings"} onClick={() => setIsOpen(!isOpen)}>
        <FiSettings className="icon" />
        </div>

        <div className={`settings-menu ${isOpen ? 'open' : ''}`}>
            <h3>Settings</h3>
            <p>
                Adjust your preferences here.
            </p>

            <button onClick={() => setIsOpen(false)}>
                Close
            </button>
        </div>
    </>
  );
};

export default Settings;
