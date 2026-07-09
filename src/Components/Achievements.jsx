import React, { useState, useEffect, useRef } from "react";
import ReactCardFlip from 'react-card-flip';
import "./achievements.css";
import { TfiLock } from "react-icons/tfi";
import { FaTrophy } from "react-icons/fa6";

const ACHIEVEMENTS = [
  // ── Clicking ––
  { id: 'clicks_1',       icon: '👆', name: 'First Strike',     description: 'Make your first click',            condition: s => s.clickCount >= 1 },
  { id: 'clicks_100',     icon: '✊', name: 'Getting Serious',   description: 'Make 100 clicks',                  condition: s => s.clickCount >= 100 },
  { id: 'clicks_500',     icon: '💢', name: 'Relentless',        description: 'Make 500 clicks',                  condition: s => s.clickCount >= 500 },
  { id: 'clicks_2500',    icon: '⚡', name: 'Click Fanatic',     description: 'Make 2,500 clicks',                condition: s => s.clickCount >= 2500 },
  { id: 'clicks_10000',   icon: '🌪️', name: 'Click God',         description: 'Make 10,000 clicks',               condition: s => s.clickCount >= 10000 },

  // ── Kills ––
  { id: 'kills_1',        icon: '🤖', name: 'First Blood',       description: 'Defeat your first robot',          condition: s => s.enemiesDefeated >= 1 },
  { id: 'kills_10',       icon: '⚔️', name: 'Robot Hunter',      description: 'Defeat 10 robots',                 condition: s => s.enemiesDefeated >= 10 },
  { id: 'kills_50',       icon: '🗡️', name: 'Warrior',           description: 'Defeat 50 robots',                 condition: s => s.enemiesDefeated >= 50 },
  { id: 'kills_200',      icon: '💀', name: 'Slayer',            description: 'Defeat 200 robots',                condition: s => s.enemiesDefeated >= 200 },
  { id: 'kills_1000',     icon: '☠️', name: 'Exterminator',      description: 'Defeat 1,000 robots',              condition: s => s.enemiesDefeated >= 1000 },

  // ── Levels ––
  { id: 'level_5',        icon: '🌱', name: 'Rookie',            description: 'Reach level 5',                    condition: s => s.level >= 5 },
  { id: 'level_15',       icon: '🔥', name: 'Veteran',           description: 'Reach level 15',                   condition: s => s.level >= 15 },
  { id: 'level_30',       icon: '💪', name: 'Elite',             description: 'Reach level 30',                   condition: s => s.level >= 30 },
  { id: 'level_50',       icon: '👑', name: 'Master',            description: 'Reach level 50',                   condition: s => s.level >= 50 },
  { id: 'level_75',       icon: '🌟', name: 'Legend',            description: 'Reach level 75',                   condition: s => s.level >= 75 },
  { id: 'level_100',      icon: '🏆', name: 'Champion',          description: 'Reach level 100',                  condition: s => s.level >= 100 },

  // ── Money ––
  { id: 'coins_100',      icon: '🪙', name: 'First Coins',       description: 'Earn 100 coins',                   condition: s => s.totalMoneyEarned >= 100 },
  { id: 'coins_1000',     icon: '💰', name: 'Saving Up',         description: 'Earn 1,000 coins',                 condition: s => s.totalMoneyEarned >= 1000 },
  { id: 'coins_10000',    icon: '💎', name: 'Wealthy',           description: 'Earn 10,000 coins',                condition: s => s.totalMoneyEarned >= 10000 },
  { id: 'coins_100000',   icon: '🤑', name: 'Filthy Rich',       description: 'Earn 100,000 coins',               condition: s => s.totalMoneyEarned >= 100000 },

  // ── Upgrades ──
  { id: 'upgrade_first',  icon: '🔧', name: 'Tinkerer',          description: 'Buy your first combat upgrade',    condition: s => Object.values(s.upgrades).some(u => u.level > 1 || u.progress > 0) },
  { id: 'upgrade_master', icon: '🛠️', name: 'Combat Master',     description: 'Max out all combat upgrades',      condition: s => Object.values(s.upgrades).every(u => u.level === 'MAX') },
  { id: 'auto_first',     icon: '🦾', name: 'Hands Free',        description: 'Buy your first auto upgrade',      condition: s => Object.values(s.autoUpgrades).some(u => u.stage > 0) },
  { id: 'auto_master',    icon: '🚀', name: 'Full Arsenal',      description: 'Max out all auto upgrades',        condition: s => Object.values(s.autoUpgrades).every(u => u.stage >= 5) },
];


export { ACHIEVEMENTS };
 
const Achievements = ({ clickCount, enemiesDefeated, totalMoneyEarned, level, autoUpgrades, upgrades, onUnlock }) => {
  const [unlocked, setUnlocked]   = useState(new Set());
  const [seenCount, setSeenCount] = useState(0);
  const [isOpen, setIsOpen]       = useState(false);
  const [flippedId, setFlippedId] = useState(null);   // ← which card is flipped
  const onUnlockRef = useRef(onUnlock);
  const isInitialMount = useRef(true);
  useEffect(() => { onUnlockRef.current = onUnlock; });
 
  // Check for newly unlocked achievements
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
      if (!isInitialMount.current) {
        onUnlockRef.current?.();
      }
    }
    isInitialMount.current = false;
  }, [clickCount, enemiesDefeated, totalMoneyEarned, level, autoUpgrades, upgrades, unlocked]);
 
  const handleOpen = () => {
    if (!isOpen) setSeenCount(unlocked.size);
    setIsOpen(o => !o);
    setFlippedId(null); // reset any flipped card when closing
  };
 
  return (
    <>
      <div
        className={`achievements ${unlocked.size > seenCount ? 'has-new' : ''}`}
        onClick={handleOpen}
      >
        <FaTrophy className="icon" />
      </div>
 
      <div className={`achievements-menu ${isOpen ? 'open' : ''}`}>
        <h3>Achievements <span className="achievements-count">{unlocked.size}/{ACHIEVEMENTS.length}</span></h3>
 
        <div className="achievements-grid">
          {ACHIEVEMENTS.map(a => {
            const isUnlocked = unlocked.has(a.id);
            const isFlipped  = flippedId === a.id;
 
            return (
              <div key={a.id}>
                <ReactCardFlip
                  isFlipped={isFlipped}
                  flipDirection="horizontal"
                  flipSpeedBackToFront={0.5}
                  flipSpeedFrontToBack={0.5}
                >
                
                  {/* FRONT — key="front" is required by the library */}
                  <div
                    key="front"
                    className={`achievement-card ${isUnlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}
                    onClick={() => setFlippedId(isFlipped ? null : a.id)}
                  >
                    <span className="achievement-icon">{isUnlocked ? a.icon : <TfiLock />}</span>
                    <span className="achievement-name">{isUnlocked ? a.name : 'Locked'}</span>
                  </div>

                  {/* BACK — key="back" is required by the library */}
                  <div
                    key="back"
                    className={`achievement-card achievement-card--back ${isUnlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}
                    onClick={() => setFlippedId(null)}
                  >
                    <span className="achievement-icon-back">{isUnlocked ? a.icon : <TfiLock />}</span>
                    <span className="achievement-desc">{a.description}</span>
                  </div>
                </ReactCardFlip>
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
 