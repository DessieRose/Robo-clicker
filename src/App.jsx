import React, { useState, useEffect, useRef } from 'react';
import Enemies from './Components/Enemies.jsx';
import Exp from './Components/Exp.jsx';
import Progress from './Components/Progress.jsx';
import Clicks from './Components/Clicks.jsx';
import Level from './Components/Level.jsx';
import Money from './Components/Money.jsx';
import Settings from './Components/Settings.jsx';
import Achievements from './Components/Achievements.jsx';
import Upgrades from './Components/Upgrades.jsx';
import { Stages } from './Components/AutoUpgradeCard.jsx';
import StartScreen from './Components/StartScreen.jsx';
import backgroundMusic from './music/background-music.mp3';
import LevelUpSound from './music/level-up.mp3';
import MetalTap from './music/metal-tap.mp3';
import AchievementSound from './music/achievement.mp3';
import './App.css';

export default function App() {
  const [started, setStarted] = useState(false);
  const [music, setMusic] = useState(true);
  const [sfx, setSfx] = useState(true);
  const bgMusic = useRef(new Audio(backgroundMusic));
  const levelUpSfx = useRef(new Audio(LevelUpSound));
  const metalTapSfx = useRef(new Audio(MetalTap));
  const achievementSfx = useRef(new Audio(AchievementSound));

  levelUpSfx.current.volume = 0.2;
  metalTapSfx.current.volume = 0.2;
  achievementSfx.current.volume = 0.2;

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
  const [autoClickCount, setAutoClickCount] = useState(0);
  const [progress, setProgress] = useState(100);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [enemyId, setEnemyId] = useState(Math.floor(Math.random() * 1000000));
  const [money, setMoney] = useState(0);
  const [totalMoneyEarned, setTotalMoneyEarned] = useState(0);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);

  const [upgrades, setUpgrades] = useState({
    strength:       { level: 1, progress: 0 },
    luck:           { level: 1, progress: 0 },
    attackDamage:   { level: 1, progress: 0 },
    criticalDamage: { level: 1, progress: 0 },
  });

  const [autoUpgrades, setAutoUpgrades] = useState({
    drone:  { stage: 0 },
    turret: { stage: 0 },
    robot:  { stage: 0 },
  });

  const handleAttack = (baseDamage = 1) => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    const luckLevel = upgrades.luck.level === 'MAX' ? 5 : upgrades.luck.level;
    const luckMultiplier = 1 + (luckLevel - 1) * 0.5;
    const coinsEarned = Math.round((1 + (newCount % 5 === 0 ? 3 : 0)) * luckMultiplier);
    setMoney(m => m + coinsEarned);
    setTotalMoneyEarned(t => t + coinsEarned);

    const strengthLevel = upgrades.strength.level === 'MAX' ? 5 : upgrades.strength.level;
    const strengthBonus = (strengthLevel - 1) * 3;

    const attackLevel = upgrades.attackDamage.level === 'MAX' ? 5 : upgrades.attackDamage.level;
    const attackMultiplier = 1 + (attackLevel - 1) * 0.2;

    const critLevel = upgrades.criticalDamage.level === 'MAX' ? 5 : upgrades.criticalDamage.level;
    const critChance = (critLevel - 1) * 0.12;
    const critBonus = Math.random() < critChance ? baseDamage * 0.5 : 0;

    const enemyMaxHp = Math.pow(level * 1.2, 2) * 100; // Example formula for enemy max HP based on level
    const totalDamage = (baseDamage + strengthBonus + critBonus) * attackMultiplier;
    setProgress(prev => prev - (totalDamage / enemyMaxHp) * 100);
  };

  const handleAttackRef = useRef(handleAttack);
  useEffect(() => { handleAttackRef.current = handleAttack; });

  useEffect(() => {
    const id = setInterval(() => {
      let autoHits = 0;
      Object.entries(autoUpgrades).forEach(([key, upgrade]) => {
        if (upgrade.stage > 0) {
          const stageData = Stages.find(s => s.upgradeName.toLowerCase() === key);
          const stageDamage = stageData?.stages.find(s => s.stage === upgrade.stage)?.damage ?? 1;
          handleAttackRef.current(stageDamage);
          autoHits++;
        }
      });
      if (autoHits > 0) setAutoClickCount(prev => prev + autoHits);
    }, 1000);
    return () => clearInterval(id);
  }, [autoUpgrades]);

  useEffect(() => {
    if (level > 1 && sfx) levelUpSfx.current.play();
  }, [level, sfx]);

  useEffect(() => {
    if (clickCount > 0 && sfx) metalTapSfx.current.play();
  }, [clickCount, sfx]);

  useEffect(() => {
    const img = new Image();
    img.src = `https://robohash.org/${enemyId + 1}?size=350x350`;
  }, [enemyId]);

  useEffect(() => {
    if (progress <= 0) {
      setEnemyId(prev => prev + 1);
      setProgress(100);
      setEnemiesDefeated(prev => prev + 1);
      setExp(prev => {
        const newExp = prev + Math.max(1, Math.floor(50 / level));
        if (newExp >= 100) {
          setLevel(l => l + 1);
          const levelBonus = level * 10;
          setMoney(m => m + levelBonus);
          setTotalMoneyEarned(t => t + levelBonus);
          return 0;
        }
        return newExp;
      });
    }
  }, [progress, level]);

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
        <Clicks clickCount={autoClickCount} />
      </div>
      <div>
        <Enemies key={enemyId} id={enemyId} onClick={() => handleAttack()} level={level} />
        <Progress progress={progress} level={level} />
      </div>
      <div className="buttons">
        <Settings music={music} setMusic={setMusic} sfx={sfx} setSfx={setSfx} />
        <Achievements
          clickCount={clickCount}
          enemiesDefeated={enemiesDefeated}
          totalMoneyEarned={totalMoneyEarned}
          level={level}
          autoUpgrades={autoUpgrades}
          upgrades={upgrades}
          onUnlock={() => { if (sfx) achievementSfx.current.play(); }}
        />
        <Upgrades money={money} setMoney={setMoney} upgrades={upgrades} setUpgrades={setUpgrades} autoUpgrades={autoUpgrades} setAutoUpgrades={setAutoUpgrades} />
      </div>
    </div>
  );
}
