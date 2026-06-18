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
import './App.css';


export default function App() {
  const [started, setStarted] = useState(false);
  const bgMusic = useRef(new Audio(backgroundMusic));

  const handleStart = () => {
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.4;
    bgMusic.current.play();
    setStarted(true);
  };
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

  useEffect(() => {
    const img = new Image();
    img.src = `https://robohash.org/${enemyId + 1}?size=350x350`;
  }, [enemyId]);

  useEffect(() => {
    if (progress <= 0) {
      setEnemyId(prev => prev + 1);
      setProgress(100);
      setExp(prev => {
        const newExp = prev + 5;
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
        <Settings />
        <Upgrades money={money} setMoney={setMoney} upgrades={upgrades} setUpgrades={setUpgrades} />
      </div>
    </div>
  );
}
