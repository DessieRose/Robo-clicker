import { FiSettings } from "react-icons/fi";

const Settings = () => {
  return (
    <div className="settings">
      <FiSettings />
      <label>
        Sound:
        <input type="checkbox" />
      </label>
      <label>
        Notifications:
        <input type="checkbox" />
      </label>
    </div>
  );
};

export default Settings;
