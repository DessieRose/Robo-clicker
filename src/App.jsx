import React, { useState, useEffect, useRef } from 'react';
import Enemies from './Components/Enemies.jsx';
import Exp from './Components/Exp.jsx';
import Progress from './Components/Progress.jsx';
import Clicks from './Components/Clicks.jsx';
import Level from './Components/Level.jsx';
import Money from './Components/Money.jsx';
import Upgrades from './Components/Upgrades.jsx';
import Settings from './Components/Settings.jsx';
import StartScreen from './Components/StartScreen.jsx';

import backgroundMusic from './music/background-music.mp3';
import LevelUpSound from './music/level-up.mp3';
import MetalTap from './music/metal-tap.mp3';
import './App.css';


export default function App() {
  const [started, setStarted] = useState(false);
  const [music, setMusic] = useState(true);
  const [sfx, setSfx] = useState(true);
  const bgMusic = useRef(new Audio(backgroundMusic));
  const levelUpSfx = useRef(new Audio(LevelUpSound));
  const metalTapSfx = useRef(new Audio(MetalTap));

  levelUpSfx.current.volume = 0.2;
  metalTapSfx.current.volume = 0.2;

  const handleStart = () => {
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.1;
    bgMusic.current.play();
    setStarted(true);
  };

  useEffect(() => {
    if (!started) return;
    music ? bgMusic.current.play() : bgMusic.current.pause();
  }, [music, started]);
  const [clickCount, setClickCount] = useState(0);
  const [progress, setProgress] = useState(100);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [enemyId, setEnemyId] = useState(Math.floor(Math.random() * 1000000));
  const [money, setMoney] = useState(0);

  const [upgrades, setUpgrades] = useState({
    strength:       { level: 1, progress: 0 },
    stamina:        { level: 1, progress: 0 },
    attackDamage:   { level: 1, progress: 0 },
    criticalDamage: { level: 1, progress: 0 },
  });

  const [autoUpgrades, setAutoUpgrades] = useState({
    drone:  { stage: 0 },
    turret: { stage: 0 },
    robot:  { stage: 0 },
  });

  const handleAttack = () => {
    setClickCount(prev => prev + 1);
    setMoney(prev => prev + 1);

    const strengthLevel = upgrades.strength.level === 'MAX' ? 5 : upgrades.strength.level;
    const strengthBonus = (strengthLevel - 1) + upgrades.strength.progress / 100;

    const staminaLevel = upgrades.stamina.level === 'MAX' ? 5 : upgrades.stamina.level;
    const staminaBonus = (staminaLevel - 1) + upgrades.stamina.progress / 100;

    const attackLevel = upgrades.attackDamage.level === 'MAX' ? 5 : upgrades.attackDamage.level;
    const attackBonus = (attackLevel - 1) + upgrades.attackDamage.progress / 100;

    const critLevel = upgrades.criticalDamage.level;
    const critChance = (critLevel === 'MAX' ? 5 : critLevel - 1) * 0.1;
    const critBonus = Math.random() < critChance ? 5 : 0;

    const baseDamage = Math.floor(level / 5) + 1;
    setProgress(prev => prev - (baseDamage + strengthBonus + staminaBonus + attackBonus + critBonus));
  };

  const handleAttackRef = useRef(handleAttack);
  useEffect(() => { handleAttackRef.current = handleAttack; });

  useEffect(() => {
    const interval = setInterval(() => {
      Object.values(autoUpgrades).forEach((upgrade) => {
        if (upgrade.stage > 0) {
          handleAttackRef.current();
        }
      });
    }, 1000);
    return () => clearInterval(interval);
    
  }, [autoUpgrades]);

  useEffect(() => {
    if (level > 1 && sfx) levelUpSfx.current.play();
  }, [level]);

  useEffect(() => {
    if (clickCount > 0 && sfx) metalTapSfx.current.play();
  }, [clickCount]);

  useEffect(() => {
    const img = new Image();
    img.src = `https://robohash.org/${enemyId + 1}?size=350x350`;
  }, [enemyId]);

  useEffect(() => {
    if (progress <= 0) {
      setEnemyId(prev => prev + 1);
      setProgress(100);
      setExp(prev => {
        const newExp = prev + Math.max(1, Math.floor(50 / level));
        if (newExp >= 100) {
          setLevel(l => l + 1);
          setMoney(m => m + 5);
          return 0;
        }
        return newExp;
      });
    }
  }, [progress]);

  if (!started) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="container">

      <Exp exp={exp} />
      <div>
        <Level level={level} />
      </div>
      <div className="level">
        <h3>LEVEL</h3>
      </div>
      <Money money={money} />
      <div>
        <Clicks clickCount={clickCount} />
      </div>
      <div>
        <Enemies key={enemyId} id={enemyId} onClick={handleAttack} level={level} />
        <Progress progress={progress} />
      </div>
      <div className="buttons">
        <Settings music={music} setMusic={setMusic} sfx={sfx} setSfx={setSfx} />
        <Upgrades money={money} setMoney={setMoney} upgrades={upgrades} setUpgrades={setUpgrades} autoUpgrades={autoUpgrades} setAutoUpgrades={setAutoUpgrades} />
      </div>
    </div>
  );
}
