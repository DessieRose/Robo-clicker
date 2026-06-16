import React, { useState, useEffect } from 'react';
import Enemies from './Components/Enemies.jsx';
import Exp from './Components/Exp.jsx';
import Progress from './Components/Progress.jsx';
import Clicks from './Components/Clicks.jsx';
import Level from './Components/Level.jsx';
import './App.css';
import Money from './Components/Money.jsx';


export default function App() {
  const [clickCount, setClickCount] = useState(0);
  const [progress, setProgress] = useState(100);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [enemyId, setEnemyId] = useState(Math.floor(Math.random() * 1000000));
  const [money, setMoney] = useState(0);

  const handleAttack = () => {
    setClickCount(prev => prev + 1);
    setMoney(prev => prev + 1);
    setProgress(prev => prev - 10);
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
        <Enemies key={enemyId} id={enemyId} onClick={handleAttack} />
        <Progress progress={progress} />
      </div>
    </div>
  );
}
