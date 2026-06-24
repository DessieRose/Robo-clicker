import React, { useState, useEffect, useRef } from "react";
import { FaTrophy } from "react-icons/fa6";

const ACHIEVEMENTS = [
  { id: 'bonus_coin',      name: 'Lucky Five',         description: 'Trigger the 5-click coin bonus',         condition: s => s.clickCount >= 5 },
  { id: 'kills_1',         name: 'First Kill',         description: 'Defeat your first enemy',                condition: s => s.enemiesDefeated >= 1 },
  { id: 'coins_50',        name: 'Pocket Change',      description: 'Earn 50 coins',                          condition: s => s.totalMoneyEarned >= 50 },
  { id: 'clicks_50',       name: 'Warming Up',         description: 'Make 50 clicks',                         condition: s => s.clickCount >= 50 },
  { id: 'combat_beginner', name: 'Combat Initiate',    description: 'Buy your first combat upgrade',          condition: s => Object.values(s.upgrades).some(u => u.level > 1 || u.progress > 0) },
  { id: 'clicks_500',      name: 'Click Machine',      description: 'Make 500 clicks',                        condition: s => s.clickCount >= 500 },
  { id: 'kills_10',        name: 'Enemy Slayer',        description: 'Defeat 10 enemies',                      condition: s => s.enemiesDefeated >= 10 },
  { id: 'kills_50',        name: 'Destroyer',          description: 'Defeat 50 enemies',                      condition: s => s.enemiesDefeated >= 50 },
  { id: 'coins_500',       name: 'Stacking Coins',     description: 'Earn 500 coins',                         condition: s => s.totalMoneyEarned >= 500 },
  { id: 'level_10',        name: 'Veteran',            description: 'Reach level 10',                         condition: s => s.level >= 10 },
  { id: 'level_40',        name: 'Master',             description: 'Reach level 40',                         condition: s => s.level >= 40 },
  { id: 'level_70',        name: 'Legend',             description: 'Reach level 70',                         condition: s => s.level >= 70 },
  { id: 'level_100',       name: 'Maxed Out',          description: 'Reach level 100',                        condition: s => s.level >= 100 },
  { id: 'auto_attack',     name: 'Hands Free',         description: 'Buy your first auto upgrade',            condition: s => Object.values(s.autoUpgrades).some(u => u.stage > 0) },
  { id: 'auto_attack_5',   name: 'Automation Expert',  description: 'Buy all auto upgrades',                  condition: s => Object.values(s.autoUpgrades).every(u => u.stage >= 5) },
  { id: 'combat_master',   name: 'Combat Master',      description: 'Reach max level in all combat upgrades', condition: s => Object.values(s.upgrades).every(u => u.level === 'MAX') },
];

export { ACHIEVEMENTS };

const Achievements = ({ clickCount, enemiesDefeated, totalMoneyEarned, level, autoUpgrades, upgrades, onUnlock }) => {
  const [unlocked, setUnlocked] = useState(new Set());
  const [seenCount, setSeenCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const onUnlockRef = useRef(onUnlock);
  useEffect(() => { onUnlockRef.current = onUnlock; });

  useEffect(() => {
    const state = { clickCount, enemiesDefeated, totalMoneyEarned, level, autoUpgrades, upgrades };
    const newIds = ACHIEVEMENTS
      .filter(a => !unlocked.has(a.id) && a.condition(state))
      .map(a => a.id);
    if (newIds.length > 0) {
      setUnlocked(prev => {
        const next = new Set(prev);
        newIds.forEach(id => next.add(id));
        return next;
      });
      onUnlockRef.current?.();
    }
  }, [clickCount, enemiesDefeated, totalMoneyEarned, level, autoUpgrades, upgrades, unlocked]);

  const handleOpen = () => {
    if (!isOpen) setSeenCount(unlocked.size);
    setIsOpen(o => !o);
  };

  return (
    <>
      <div className={`achievements ${unlocked.size > seenCount ? 'has-new' : ''}`} onClick={handleOpen}>
        <FaTrophy className="icon" />
      </div>

      <div className={`achievements-menu ${isOpen ? 'open' : ''}`}>
        <h3>Achievements</h3>
        <div className="achievements-grid">
          {ACHIEVEMENTS.map(a => {
            const isUnlocked = unlocked.has(a.id);
            return (
              <div key={a.id} className={`achievement-card ${isUnlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}>
                {isUnlocked ? (
                  <>
                    <FaTrophy className="achievement-icon" />
                    <span className="achievement-name">{a.name}</span>
                    <span className="achievement-desc">{a.description}</span>
                  </>
                ) : (
                  <span className="achievement-unknown">?</span>
                )}
              </div>
            );
          })}
        </div>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          Close
        </button>
      </div>
    </>
  );
};

export default Achievements;
