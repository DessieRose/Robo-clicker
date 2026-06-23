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
import StartScreen from './Components/StartScreen.jsx';
import backgroundMusic from './music/background-music.mp3';
import LevelUpSound from './music/level-up.mp3';
import MetalTap from './music/metal-tap.mp3';
import AchievementSound from './music/achievement.mp3';
import './App.css';

const ACHIEVEMENTS = [
  { id: 'first_click',  name: 'First Blood',      description: 'Make your first click' },
  { id: 'clicks_50',   name: 'Warming Up',        description: 'Make 50 clicks' },
  { id: 'clicks_200',  name: 'Click Machine',     description: 'Make 200 clicks' },
  { id: 'bonus_coin',  name: 'Lucky Five',        description: 'Trigger the 5-click coin bonus' },
  { id: 'kills_1',     name: 'First Kill',        description: 'Defeat your first enemy' },
  { id: 'kills_10',    name: 'Enemy Slayer',       description: 'Defeat 10 enemies' },
  { id: 'kills_50',    name: 'Destroyer',         description: 'Defeat 50 enemies' },
  { id: 'coins_50',    name: 'Pocket Change',     description: 'Earn 50 coins' },
  { id: 'coins_500',   name: 'Stacking Coins',    description: 'Earn 500 coins' },
  { id: 'level_2',     name: 'Rising Star',       description: 'Reach level 2' },
  { id: 'level_5',     name: 'Veteran',           description: 'Reach level 5' },
  { id: 'auto_attack', name: 'Hands Free',        description: 'Buy your first auto upgrade' },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [music, setMusic] = useState(true);
  const [sfx, setSfx] = useState(true);
  const bgMusic = useRef(new Audio(backgroundMusic));
  const levelUpSfx = useRef(new Audio(LevelUpSound));
  const metalTapSfx = useRef(new Audio(MetalTap));
  const achievementSfx = useRef(new Audio(AchievementSound));
  const achievementFirstRender = useRef(true);

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
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());

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
    const newCount = clickCount + 1;
    setClickCount(newCount);
    const coinsEarned = 1 + (newCount % 5 === 0 ? 3 : 0);
    setMoney(m => m + coinsEarned);
    setTotalMoneyEarned(t => t + coinsEarned);

    const strengthLevel = upgrades.strength.level === 'MAX' ? 5 : upgrades.strength.level;
    const strengthBonus = (strengthLevel - 1) + upgrades.strength.progress / 100;

    const staminaLevel = upgrades.stamina.level === 'MAX' ? 5 : upgrades.stamina.level;
    const staminaBonus = (staminaLevel - 1) + upgrades.stamina.progress / 100;

    const attackLevel = upgrades.attackDamage.level === 'MAX' ? 5 : upgrades.attackDamage.level;
    const attackBonus = (attackLevel - 1) + upgrades.attackDamage.progress / 100;

    const critLevel = upgrades.criticalDamage.level;
    const critChance = (critLevel === 'MAX' ? 5 : critLevel - 1) * 0.1;
    const critBonus = Math.random() < critChance ? 5 : 0;

    const baseDamage = 1;
    const enemyMaxHp = level * 20;
    const totalDamage = baseDamage + strengthBonus + staminaBonus + attackBonus + critBonus;
    setProgress(prev => prev - (totalDamage / enemyMaxHp) * 100);
  };

  const handleAttackRef = useRef(handleAttack);
  useEffect(() => { handleAttackRef.current = handleAttack; });

  useEffect(() => {
    const interval = setInterval(() => {
      let autoHits = 0;
      Object.values(autoUpgrades).forEach((upgrade) => {
        if (upgrade.stage > 0) {
          handleAttackRef.current();
          autoHits++;
        }
      });
      if (autoHits > 0) setAutoClickCount(prev => prev + autoHits);
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
    if (achievementFirstRender.current) { achievementFirstRender.current = false; return; }
    if (sfx) achievementSfx.current.play();
  }, [unlockedAchievements]);

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
  }, [progress]);

  useEffect(() => {
    setUnlockedAchievements(prev => {
      const next = new Set(prev);
      if (clickCount >= 1)   next.add('first_click');
      if (clickCount >= 50)  next.add('clicks_50');
      if (clickCount >= 200) next.add('clicks_200');
      if (clickCount >= 5)   next.add('bonus_coin');
      if (enemiesDefeated >= 1)  next.add('kills_1');
      if (enemiesDefeated >= 10) next.add('kills_10');
      if (enemiesDefeated >= 50) next.add('kills_50');
      if (totalMoneyEarned >= 50)  next.add('coins_50');
      if (totalMoneyEarned >= 500) next.add('coins_500');
      if (level >= 2) next.add('level_2');
      if (level >= 5) next.add('level_5');
      if (Object.values(autoUpgrades).some(u => u.stage > 0)) next.add('auto_attack');
      return next.size !== prev.size ? next : prev;
    });
  }, [clickCount, enemiesDefeated, totalMoneyEarned, level, autoUpgrades]);

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
        <Enemies key={enemyId} id={enemyId} onClick={handleAttack} level={level} />
        <Progress progress={progress} />
      </div>
      <div className="buttons">
        <Settings music={music} setMusic={setMusic} sfx={sfx} setSfx={setSfx} />
        <Achievements achievements={ACHIEVEMENTS} unlocked={unlockedAchievements} />
        <Upgrades money={money} setMoney={setMoney} upgrades={upgrades} setUpgrades={setUpgrades} autoUpgrades={autoUpgrades} setAutoUpgrades={setAutoUpgrades} />
      </div>
    </div>
  );
}
