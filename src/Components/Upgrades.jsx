import { GoPlusCircle } from "react-icons/go";
import { useState } from "react";
import UpgradeCard, { getUpgradePrice } from "./Upgrade-card";
import "./upgrade.css";

import strengthIcon from "../Images/strength-icon.png";
import staminaIcon from "../Images/stamina-icon.png";
import attackDamageIcon from "../Images/attack-damage-icon.png";
import criticalDamageIcon from "../Images/critical-damage-icon.png";

const Upgrades = ({ money, setMoney, upgrades, setUpgrades }) => {
  const [isOpen, setIsOpen] = useState(false);

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


  const images = {
    strength: strengthIcon,
    stamina: staminaIcon,
    attackDamage: attackDamageIcon,
    criticalDamage: criticalDamageIcon
  };

  return (
    <>
        <div className="upgrades" onClick={() => setIsOpen(!isOpen)}>
        <GoPlusCircle className="icon" />
        </div>

        <div className={`upgrade-sheet ${isOpen ? 'open' : ''}`}>
            <UpgradeCard
                title="Strength"
                image={images.strength}
                progress={upgrades.strength.progress}
                level={upgrades.strength.level}
                onUpgrade={() => handleUpgrade('strength')}
                money={money}
            />

            <UpgradeCard
                title="Stamina"
                image={images.stamina}
                progress={upgrades.stamina.progress}
                level={upgrades.stamina.level}
                onUpgrade={() => handleUpgrade('stamina')}
                money={money}
            />

            <UpgradeCard
                title="Attack damage"
                image={images.attackDamage}
                progress={upgrades.attackDamage.progress}
                level={upgrades.attackDamage.level}
                onUpgrade={() => handleUpgrade('attackDamage')}
                money={money}
            />

            <UpgradeCard
                title="Critical damage"
                image={images.criticalDamage}
                progress={upgrades.criticalDamage.progress}
                level={upgrades.criticalDamage.level}
                onUpgrade={() => handleUpgrade('criticalDamage')}
                money={money}
            />

            <button onClick={() => setIsOpen(false)}>
                Close
            </button>
            
        </div>
    </>

  );
};

export default Upgrades;
