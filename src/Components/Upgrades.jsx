import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { IoInformationCircle } from "react-icons/io5";
import UpgradeCard, { getUpgradePrice } from "./UpgradeCard";
import AutoUpgradeCard, { Stages } from "./AutoUpgradeCard";
import "./upgrade.css";

import strengthIcon from "../Images/strength-icon.png";
import luckIcon from "../Images/luck-icon.png";
import attackDamageIcon from "../Images/attack-damage-icon.png";
import criticalDamageIcon from "../Images/critical-damage-icon.png";

const Upgrades = ({ money, setMoney, upgrades, setUpgrades, autoUpgrades, setAutoUpgrades }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('combat');

  const handleUpgrade = (key) => {
    const current = upgrades[key];
    if (current.level === 'MAX') return;

    const price = getUpgradePrice(key, current.level);
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

  const hasAffordableUpgrade =
    Object.entries(upgrades).some(([key, u]) => u.level !== 'MAX' && money >= getUpgradePrice(key, u.level)) ||
    Object.entries(autoUpgrades).some(([key, u]) => {
      const stageData = Stages.find(s => s.upgradeName.toLowerCase() === key);
      const nextStage = stageData?.stages.find(s => s.stage === u.stage + 1);
      return nextStage && money >= nextStage.price;
    });

  return (
    <>
      <div className={`upgrades ${hasAffordableUpgrade ? 'has-new' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <FiPlusCircle className="icon" />
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
            upgradeKey="strength"
            title="Strength"
            image={strengthIcon}
            progress={upgrades.strength.progress}
            level={upgrades.strength.level}
            onUpgrade={() => handleUpgrade('strength')}
            money={money}
          />
          <UpgradeCard
            upgradeKey="luck"
            title="Luck"
            image={luckIcon}
            progress={upgrades.luck.progress}
            level={upgrades.luck.level}
            onUpgrade={() => handleUpgrade('luck')}
            money={money}
          />
          <UpgradeCard
            upgradeKey="attackDamage"
            title="Attack damage"
            image={attackDamageIcon}
            progress={upgrades.attackDamage.progress}
            level={upgrades.attackDamage.level}
            onUpgrade={() => handleUpgrade('attackDamage')}
            money={money}
          />
          <UpgradeCard
            upgradeKey="criticalDamage"
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
              <li><strong>Strength</strong>: +5 click damage per level.</li>
              <li><strong>Luck</strong>: +60% kill reward per level (up to ×4 at max).</li>
              <li><strong>Attack damage</strong>: +40% damage multiplier per level.</li>
              <li><strong>Critical damage</strong>: +15% critical hit chance per level.</li>
            </ul>
          </div>
        </>}

        {activeTab === 'auto' && <>
            <AutoUpgradeCard
              upgradeName="Drone"
              stage={autoUpgrades.drone.stage}
              onStage={(price) => handleAutoUpgrade('drone', price)}
              money={money}
            />
            <AutoUpgradeCard
              upgradeName="Turret"
              stage={autoUpgrades.turret.stage}
              onStage={(price) => handleAutoUpgrade('turret', price)}
              money={money}
            />
            <AutoUpgradeCard
              upgradeName="Robot"
              stage={autoUpgrades.robot.stage}
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
