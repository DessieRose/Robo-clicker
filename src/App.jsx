import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Enemies from './Components/Enemies.jsx';
import Exp from './Components/Exp.jsx';
import Progress from './Components/Progress.jsx';
import Clicks from './Components/Clicks.jsx';
import Level from './Components/Level.jsx';
import Money from './Components/Money.jsx';
import Settings from './Components/Settings.jsx';
import Achievements from './Components/Achievements.jsx';
import Upgrades, { hasAffordableUpgrade } from './Components/Upgrades.jsx';
import { Stages } from './Components/AutoUpgradeCard.jsx';
import StartScreen from './Components/StartScreen.jsx';
import Modal from './Modals/Modal.jsx';
import { TIPS } from './Modals/tips.js';
import backgroundMusic from './music/background-music.mp3';
import LevelUpSound from './music/level-up.mp3';
import MetalTap from './music/metal-tap.mp3';
import AchievementSound from './music/achievement.mp3';
import { getEnemyMaxHp, getStrengthBonus, getAttackMultiplier, getCritChance, getLuckMultiplier, getKillReward, getExpGain, getBackground } from './gameFormulas.js';
import { loadGame, loadFromSupabase, useGameSave } from './hooks/useGameSave';
import { useAuth } from './hooks/useAuth.js';
import './App.css';

// ── Default state values ──
const DEFAULT_UPGRADES = {
  strength:       { level: 1, progress: 0 },
  luck:           { level: 1, progress: 0 },
  attackDamage:   { level: 1, progress: 0 },
  criticalDamage: { level: 1, progress: 0 },
};
 
const DEFAULT_AUTO_UPGRADES = {
  drone:  { stage: 0 },
  turret: { stage: 0 },
  robot:  { stage: 0 },
};

// Called once outside the component so it doesn't re-run on every render
// const initialSave = loadGame();

export default function App() {
  // –– Auth ––
  const { user, authLoading, signUp, signIn } = useAuth();
  const [playAsGuest, setPlayAsGuest] = useState(false);
  const [saveLoaded, setSaveLoaded] = useState(false);

  // ── Audio refs ──
  const bgMusic = useRef(new Audio(backgroundMusic));
  const levelUpSfx = useRef(new Audio(LevelUpSound));
  const metalTapSfx = useRef(new Audio(MetalTap));
  const achievementSfx = useRef(new Audio(AchievementSound));
  const killProcessed = useRef(false);
  const isNaturalLevelUp = useRef(false);
  const hasInteracted = useRef(false);
  const prevClickCount = useRef(0);

  levelUpSfx.current.volume = 0.2;
  metalTapSfx.current.volume = 0.2;
  achievementSfx.current.volume = 0.2;

  // ── UI state ──
  const [started, setStarted] = useState(false);
  const [music, setMusic] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [sfx, setSfx] = useState(() => {
    const saved = localStorage.getItem('sfxEnabled');
    return saved !== null ? saved === 'true' : true;
  });

  // ── Game state (defaults — overwritten after save loads) ──
  const [level, setLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(1);
  const [money, setMoney] = useState(0);
  const [totalMoneyEarned, setTotalMoneyEarned] = useState(0);
  const [exp, setExp] = useState(0);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [upgrades, setUpgrades] = useState(DEFAULT_UPGRADES);
  const [autoUpgrades, setAutoUpgrades] = useState(DEFAULT_AUTO_UPGRADES);
  const [seenTips, setSeenTips] = useState([]);

  // ── Onboarding tips (session flag; persistence is via seenTips) ──
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);

  // ── Session-only state (never saved) ──
  const [autoClickCount, setAutoClickCount] = useState(0);
  const [progress, setProgress] = useState(100);
  const [enemyId, setEnemyId] = useState(Math.floor(Math.random() + 1));
  const [bgUrl, setBgUrl] = useState(() => getBackground(1));
  const [incomingBg, setIncomingBg] = useState(null);
  const [incomingShow, setIncomingShow] = useState(false);
  const [bgVisible, setBgVisible] = useState(true);

  // ── Save hook (must be called before any early returns) ──
  useGameSave(
    { level, maxLevel, money, totalMoneyEarned, exp, enemiesDefeated, clickCount, upgrades, autoUpgrades, seenTips },
    user,
    saveLoaded
  );

  // ── Auto-start for returning logged-in users ──
  useEffect(() => {
    if (user && saveLoaded && !started) {
      setStarted(true);
    }
  }, [user, saveLoaded, started]);

  // ── Load save after auth is ready ──
  useEffect(() => {
    if (authLoading) return;
    if (!user && !playAsGuest) return;
    setSaveLoaded(false);

    const initSave = async () => {
      let save = null;
      if (user) {
        const [remote, local] = await Promise.all([
        loadFromSupabase(user.id),
        Promise.resolve(loadGame()),
        ]);
        if (remote && local) {
          save = (remote.savedAt ?? 0) >= (local.savedAt ?? 0) ? remote : local;
        } else {
          save = remote ?? local;
        }
      } else {
        save = loadGame();
      }
      
      if (save) {
        setLevel(save.level ?? 1);
        setMaxLevel(save.maxLevel ?? 1);
        setMoney(save.money ?? 0);
        setTotalMoneyEarned(save.totalMoneyEarned ?? 0);
        setExp(save.exp ?? 0);
        setEnemiesDefeated(save.enemiesDefeated ?? 0);
        setClickCount(save.clickCount ?? 0);
        setUpgrades(save.upgrades ?? DEFAULT_UPGRADES);
        setAutoUpgrades(save.autoUpgrades ?? DEFAULT_AUTO_UPGRADES);
        setSeenTips(save.seenTips ?? []);
        setBgUrl(getBackground(save.level ?? 1));
      }

      setSaveLoaded(true);
    };

    initSave();
  }, [user, authLoading, playAsGuest]);

  // ── Start game (plays music, marks started) ──
  const startGame = () => {
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.1;
    bgMusic.current.play().catch(() => {});
    setStarted(true);
  };

  const handleGuest = () => {
    setPlayAsGuest(true);
    startGame();
  };

  const handleLogin = async (email, password) => {
    await signIn(email, password);
    startGame();
  };

  const handleSignUp = async (email, password) => {
    await signUp(email, password);
    startGame();
  };

  useEffect(() => {
    if (!started) return;
    music ? bgMusic.current.play().catch(() => {}) : bgMusic.current.pause();
  }, [music, started]);

  useEffect(() => {
    localStorage.setItem('musicEnabled', music);
  }, [music]);

  useEffect(() => {
    localStorage.setItem('sfxEnabled', sfx);
  }, [sfx]);

  // ── Background transition on level change ──
  // The old background stays put as a static base layer; the new one is
  // preloaded and crossfaded in on top of it, so there's never a moment
  // where nothing but the page's default white is showing through.
  // useLayoutEffect (not useEffect) so bgVisible flips to false before the
  // browser paints — otherwise the new-level enemy briefly renders at full
  // opacity over the old background for one frame before hiding.
  useLayoutEffect(() => {
    const next = getBackground(level);
    if (next === bgUrl || next === incomingBg) return;

    let cancelled = false;
    setBgVisible(false);

    const img = new Image();
    const startCrossfade = () => {
      if (cancelled) return;
      setIncomingBg(next);
      setIncomingShow(false);
    };
    img.onload = startCrossfade;
    img.onerror = startCrossfade;
    img.src = next;

    return () => { cancelled = true; };
  }, [level, bgUrl, incomingBg]);

  // Once the incoming layer is mounted at opacity 0, flip it to 1 on the next
  // frame so the browser actually animates the transition instead of
  // snapping straight to the target opacity.
  useLayoutEffect(() => {
    if (incomingBg == null || incomingShow) return;
    const raf = requestAnimationFrame(() => setIncomingShow(true));
    return () => cancelAnimationFrame(raf);
  }, [incomingBg, incomingShow]);

  // Once the crossfade finishes, promote the incoming image to the base
  // layer and reveal the enemy/progress again.
  const handleBgCrossfadeEnd = () => {
    setBgUrl(incomingBg);
    setIncomingBg(null);
    setIncomingShow(false);
    setBgVisible(true);
  };

  // ── Sound effects ──
  useEffect(() => {
    if (level > 1 && sfx && isNaturalLevelUp.current) {
      levelUpSfx.current.play().catch(() => {});
      isNaturalLevelUp.current = false;
    }
  }, [level, sfx]);

  useEffect(() => {
    if (clickCount > prevClickCount.current && sfx && started) {
      metalTapSfx.current.play().catch(() => {});
    }
    prevClickCount.current = clickCount;
  }, [clickCount, sfx, started]);

  // ── Attack handler ──
  const handleAttack = (baseDamage = 1) => {
    hasInteracted.current = true;
    setClickCount(c => c + 1);

    const strengthBonus = getStrengthBonus(upgrades.strength);
    const attackMultiplier = getAttackMultiplier(upgrades.attackDamage);
    const critBonus = Math.random() < getCritChance(upgrades.criticalDamage) ? baseDamage * 0.5 : 0;

    const totalDamage = (baseDamage + strengthBonus + critBonus) * attackMultiplier;
    setProgress(prev => prev - (totalDamage / getEnemyMaxHp(level)) * 100);
  };

  const handleAttackRef = useRef(handleAttack);
  useEffect(() => { handleAttackRef.current = handleAttack; });

  // ── Auto-attack interval ──
  useEffect(() => {
    const id = setInterval(() => {
      let autoHits = 0;
      Object.entries(autoUpgrades).forEach(([key, upgrade]) => {
        if (upgrade.stage > 0) {
          const stageData   = Stages.find(s => s.upgradeName.toLowerCase() === key);
          const stageDamage = stageData?.stages.find(s => s.stage === upgrade.stage)?.damage ?? 1;
          handleAttackRef.current(stageDamage);
          autoHits++;
        }
      });
      if (autoHits > 0) setAutoClickCount(prev => prev + autoHits);
    }, 1000);
    return () => clearInterval(id);
  }, [autoUpgrades]);

  // ── Kill / level-up logic ──
  useEffect(() => {
    if (progress <= 0) {
      if (killProcessed.current) return;
      killProcessed.current = true;

      const killReward = getKillReward(level, upgrades);
      setMoney(m => m + killReward);
      setTotalMoneyEarned(t => t + killReward);

      setEnemyId(prev => prev + 1);
      setProgress(100);
      setEnemiesDefeated(prev => prev + 1);

      const expGain    = getExpGain(level, getLuckMultiplier(upgrades.luck));
      const willLevelUp = exp + expGain >= 100;
      setExp(willLevelUp ? 0 : exp + expGain);

      if (willLevelUp) {
        isNaturalLevelUp.current = true;
        setLevel(l => {
          const newLevel = l + 1;
          setMaxLevel(m => Math.max(m, newLevel));
          return newLevel;
        });
        const levelBonus = level * 10;
        setMoney(m => m + levelBonus);
        setTotalMoneyEarned(t => t + levelBonus);
      }
    } else {
      killProcessed.current = false;
    }
  }, [progress, exp, level, upgrades]);

  // ── Level select ──
  const handleLevelSelect = (selectedLevel) => {
    setLevel(selectedLevel);
    setProgress(100);
    setEnemyId(prev => prev + 1);
  };

  // ── Onboarding tip: first not-yet-seen tip whose trigger is active ──
  const tipCtx = {
    started,
    level,
    achievementUnlocked,
    canAffordUpgrade: hasAffordableUpgrade(money, upgrades, autoUpgrades),
  };
  const activeTip = TIPS.find(t => !seenTips.includes(t.id) && t.isTriggered(tipCtx));
  const dismissTip = () => setSeenTips(prev => [...prev, activeTip.id]);

  // ── Render ──
  if (authLoading) {
    return <StartScreen loadingText="Loading…" />;
  }

  if ((user || playAsGuest) && !saveLoaded) {
    return <StartScreen loadingText="Loading save…" />;
  }

  if (!started) {
    return (
      <StartScreen
        user={user}
        onStart={startGame}
        onGuest={handleGuest}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    );
  }

  return (
    <div className="container">
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'auto 90%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        zIndex: -2,
      }} />

      {incomingBg && (
        <div
          onTransitionEnd={handleBgCrossfadeEnd}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `url(${incomingBg})`,
            backgroundSize: 'auto 90%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            opacity: incomingShow ? 1 : 0,
            transition: 'opacity 0.6s ease',
            zIndex: -1,
          }}
        />
      )}

      <div className="stats">
        <Exp exp={exp} />
        <div>
          <Level level={level} maxLevel={maxLevel} onLevelSelect={handleLevelSelect} />
        </div>
        <div className="level">
          <h3>LEVEL</h3>
        </div>
        <Money money={money} />
        <div>
          <Clicks clickCount={autoClickCount} />
        </div>
      </div>

      <div style={{ opacity: bgVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
        <Enemies key={enemyId} id={enemyId} level={level} onClick={() => handleAttack()} />
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
          onUnlock={() => {
            if (sfx) achievementSfx.current.play().catch(() => {});
            setAchievementUnlocked(true);
          }}
        />
        <Upgrades
          money={money}
          setMoney={setMoney}
          upgrades={upgrades}
          setUpgrades={setUpgrades}
          autoUpgrades={autoUpgrades}
          setAutoUpgrades={setAutoUpgrades}
        />
      </div>

      {activeTip && (
        <Modal isOpen title={activeTip.title} onClose={dismissTip}>
          <p>{activeTip.body}</p>
        </Modal>
      )}
    </div>
  );
}