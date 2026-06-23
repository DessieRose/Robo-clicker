import React, { useState } from "react";
import { FaTrophy } from "react-icons/fa6";

const Achievements = ({ achievements, unlocked }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="achievements" onClick={() => setIsOpen(!isOpen)}>
        <FaTrophy className="icon" />
      </div>

      <div className={`achievements-menu ${isOpen ? 'open' : ''}`}>
        <h3>Achievements</h3>
        <div className="achievements-grid">
          {achievements.map(a => {
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
