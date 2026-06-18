import { GoPlusCircle } from "react-icons/go";
import { useState } from "react";
import UpgradeCard from "./Upgrade-card";

import strengthIcon from "../Images/strength-icon.png";
import staminaIcon from "../Images/stamina-icon.png";
import attackDamageIcon from "../Images/attack-damage-icon.png";
import criticalDamageIcon from "../Images/critical-damage-icon.png";

const Upgrades = () => {
  const [isOpen, setIsOpen] = useState(false);
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
                progress={50}
                level={2}
                onUpgrade={() => console.log("Upgrade Strength")}
            />

            <UpgradeCard
                title="Stamina"
                image={images.stamina}
                progress={30}
                level={1}
                onUpgrade={() => console.log("Upgrade Stamina")}
            />

            <UpgradeCard
                title="Attack damage"
                image={images.attackDamage}
                progress={70}
                level={3}
                onUpgrade={() => console.log("Upgrade Attack damage")}
            />

            <UpgradeCard
                title="Critical damage"
                image={images.criticalDamage}
                progress={90}
                level={4}
                onUpgrade={() => console.log("Upgrade Critical damage")}
            />

            <button onClick={() => setIsOpen(false)}>
                Close
            </button>
        </div>
    </>

  );
};

export default Upgrades;
