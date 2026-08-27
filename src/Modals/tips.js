// ── In-game contextual tips ──
// Each tip is shown once, the first time its trigger becomes true. Once
// dismissed its id is stored in the game save (`seenTips`) so it never
// reappears, even on another device.
//
// `isTriggered` receives a context object assembled in App.jsx:
//   { started, level, achievementUnlocked, canAffordUpgrade }
//
// Tips are checked in array order — the first triggered, not-yet-seen tip wins,
// so the rest queue up behind it.

export const TIPS = [
  {
    id: 'tap-robot',
    title: 'Attack the robot',
    body: 'Tap the robot in the middle of the screen to deal damage. Defeat it to earn coins and XP.',
    isTriggered: (c) => c.started,
  },
  {
    id: 'level-jump',
    title: 'Jump between levels',
    body: "Tap the big level number at the top to open a list and jump back to any level you've reached.",
    isTriggered: (c) => c.level >= 5,
  },
  {
    id: 'achievements',
    title: 'First achievement!',
    body: 'You unlocked an achievement. Tap the 🏆 trophy button at the bottom to see them all, and tap any card to flip it and read what it does.',
    isTriggered: (c) => c.achievementUnlocked,
  },
  {
    id: 'upgrades',
    title: 'Time to upgrade',
    body: 'You have enough coins for an upgrade! Tap the ⊕ button at the bottom to boost your damage, crit or luck - or buy auto-attackers that fight for you.',
    isTriggered: (c) => c.canAffordUpgrade,
  },
];
