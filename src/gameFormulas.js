import BgGrassland from './Images/bg/grassland.webp';
import BgDarkForest from './Images/bg/dark_forest_2.jpeg';
import BgDesert from './Images/bg/desert.webp';
import BgMountains from './Images/bg/mountains.webp';
import BgStorm from './Images/bg/storm.webp';
import BgCave from './Images/bg/cave.webp';
import BgVolcanic from './Images/bg/volcanic.webp';
import BgDeadPlanet from './Images/bg/dead_planet.webp';
import BgAlienWorld from './Images/bg/alien_world.webp';
import BgLavaPlanet from './Images/bg/lava_planet.webp';


export const getEnemyMaxHp = (level) => Math.round(50 * Math.pow(1.3, level - 1));

export const formatHp = (n) => {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000)         return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
};

const UPGRADE_PRICES = {
    strength:       [170,  330,  610, 1150, 2050],
    criticalDamage: [200,  480,  960, 1900, 3600],
    attackDamage:   [250,  600, 1200, 2400, 4500],
    luck:           [350,  800, 1600, 3200, 6000],
};

export const getUpgradePrice = (key, level) => {
    const levelPrices = UPGRADE_PRICES[key];
    if (!levelPrices || level < 1 || level > 5) return 0;
    return levelPrices[level - 1];
};

const getUpgradeTier = (upgrade) => {
    const level = upgrade.level === 'MAX' ? 5 : upgrade.level;
    const progress = upgrade.level === 'MAX' ? 0 : upgrade.progress;
    return (level - 1) * 5 + progress / 20;
};

export const getStrengthBonus = (upgrade) => getUpgradeTier(upgrade) * 1.0;
export const getAttackMultiplier = (upgrade) => 1 + getUpgradeTier(upgrade) * 0.08;
export const getCritChance = (upgrade) => getUpgradeTier(upgrade) * 0.03;
export const getLuckMultiplier = (upgrade) => 1 + getUpgradeTier(upgrade) * 0.12;

export const getKillReward = (level, upgrades) => {
    const attackMult = getAttackMultiplier(upgrades.attackDamage);
    return Math.round(level * 7 * getLuckMultiplier(upgrades.luck) * attackMult);
};

export const getExpGain = (level, luckMultiplier) => Math.max(1, Math.floor(level + 50 * luckMultiplier));

export const getBackground = (level) => {
    if (level <= 10)  return BgGrassland;
    if (level <= 20)  return BgDesert;
    if (level <= 30)  return BgMountains;
    if (level <= 40)  return BgDarkForest;
    if (level <= 50)  return BgStorm;
    if (level <= 60)  return BgCave;
    if (level <= 70)  return BgVolcanic;
    if (level <= 80)  return BgDeadPlanet;
    if (level <= 90)  return BgAlienWorld;
    return BgLavaPlanet;
};