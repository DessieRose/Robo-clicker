import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { IoInformationCircle } from "react-icons/io5";
import UpgradeCard, { getUpgradePrice } from "./UpgradeCard";
import AutoUpgradeCard from "./AutoUpgradeCard";
import "./upgrade.css";

import strengthIcon from "../Images/strength-icon.png";
import staminaIcon from "../Images/stamina-icon.png";
import attackDamageIcon from "../Images/attack-damage-icon.png";
import criticalDamageIcon from "../Images/critical-damage-icon.png";
import droneIcon from "../Images/drone-icon.png";
import turretIcon from "../Images/turret-icon.png";
import robotIcon from "../Images/robot-icon.png";

const Upgrades = ({ money, setMoney, upgrades, setUpgrades, autoUpgrades, setAutoUpgrades }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('combat');

  const handleUpgrade = (key) => {
    const current = upgrades[key];
    if (current.level === 'MAX') return;

    const price = getUpgradePrice(current.level);
    if (money < price) return;

    setMoney(prev => prev - price);
    setUpgrades(prev => {
      const newProgress = prev[key].progress + 20;
      if (newProgress >= 100) {
        const newLevel = prev[key].level + 1;
        return {
          ...prev,
          [key]: {
            level: newLevel >= 5 ? 'MAX' : newLevel,
            progress: newLevel >= 5 ? 100 : 0
          }
        };
      }
      return { ...prev, [key]: { ...prev[key], progress: newProgress } };
    });
  };

  const handleAutoUpgrade = (key, price) => {
    setMoney(prev => prev - price);
    setAutoUpgrades(prev => ({
      ...prev,
      [key]: { stage: prev[key].stage + 1 }
    }));
  };

  return (
    <>
      <div className="upgrades" onClick={() => setIsOpen(!isOpen)}>
        <GoPlusCircle className="icon" />
      </div>

      <div className={`upgrade-sheet ${isOpen ? 'open' : ''}`}>
        <div className="upgrade-tabs">
          <button
            className={`upgrade-tab ${activeTab === 'combat' ? 'active' : ''}`}
            onClick={() => setActiveTab('combat')}
          >
            Combat
          </button>
          <button
            className={`upgrade-tab ${activeTab === 'auto' ? 'active' : ''}`}
            onClick={() => setActiveTab('auto')}
          >
            Auto
          </button>
        </div>

        {activeTab === 'combat' && <>
          <UpgradeCard
            title="Strength"
            image={strengthIcon}
            progress={upgrades.strength.progress}
            level={upgrades.strength.level}
            onUpgrade={() => handleUpgrade('strength')}
            money={money}
          />
          <UpgradeCard
            title="Stamina"
            image={staminaIcon}
            progress={upgrades.stamina.progress}
            level={upgrades.stamina.level}
            onUpgrade={() => handleUpgrade('stamina')}
            money={money}
          />
          <UpgradeCard
            title="Attack damage"
            image={attackDamageIcon}
            progress={upgrades.attackDamage.progress}
            level={upgrades.attackDamage.level}
            onUpgrade={() => handleUpgrade('attackDamage')}
            money={money}
          />
          <UpgradeCard
            title="Critical damage"
            image={criticalDamageIcon}
            progress={upgrades.criticalDamage.progress}
            level={upgrades.criticalDamage.level}
            onUpgrade={() => handleUpgrade('criticalDamage')}
            money={money}
          />
          <div className="information">
            <button className="information-toggle" onClick={() => setIsInfoOpen(o => !o)}>
              <IoInformationCircle className="info-icon" />
              <span>Information</span>
              <span className={`info-chevron ${isInfoOpen ? 'open' : ''}`}>▾</span>
            </button>
            <ul className={`information-list ${isInfoOpen ? 'open' : ''}`}>
              <li><strong>Strength</strong>: Increases base damage by 1 per upgrade.</li>
              <li><strong>Stamina</strong>: Increases max health by 10 per upgrade.</li>
              <li><strong>Attack damage</strong>: Increases damage multiplier by 0.1 per upgrade.</li>
              <li><strong>Critical damage</strong>: Increases critical hit chance by 10% per level.</li>
            </ul>
          </div>
        </>}

        {activeTab === 'auto' && <>
            <AutoUpgradeCard
              upgradeName="Drone"
              stage={autoUpgrades.drone.stage}
              image={droneIcon}
              onStage={(price) => handleAutoUpgrade('drone', price)}
              money={money}
            />
            <AutoUpgradeCard
              upgradeName="Turret"
              stage={autoUpgrades.turret.stage}
              image={turretIcon}
              onStage={(price) => handleAutoUpgrade('turret', price)}
              money={money}
            />
            <AutoUpgradeCard
              upgradeName="Robot"
              stage={autoUpgrades.robot.stage}
              image={robotIcon}
              onStage={(price) => handleAutoUpgrade('robot', price)}
              money={money}
            />
        </>}

        <button className="close-btn" onClick={() => setIsOpen(false)}>
          Close
        </button>
      </div>
    </>
  );
};

export default Upgrades;
