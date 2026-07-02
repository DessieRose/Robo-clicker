import BgGrassland from './Images/bg/grassland.png';
import BgDarkForest from './Images/bg/dark_forest.png';
import BgDesert from './Images/bg/desert.png';
import BgMountains from './Images/bg/mountains.png';
import BgStorm from './Images/bg/storm.png';
import BgCave from './Images/bg/cave.png';
import BgVolcanic from './Images/bg/volcanic.png';
import BgDeadPlanet from './Images/bg/dead_planet.png';
import BgAlienWorld from './Images/bg/alien_world.png';
import BgLavaPlanet from './Images/bg/lava_planet.png';


export const getEnemyMaxHp = (level) => Math.round(50 * Math.pow(1.6, level - 1));

const UPGRADE_PRICES = {
    strength:       [30,  60,  100, 150, 220],
    luck:           [80, 150, 250, 400, 600],
    attackDamage:   [60,  120, 200, 320, 500],
    criticalDamage: [50,  100, 160, 250, 380],
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

export const getStrengthBonus = (upgrade) => getUpgradeTier(upgrade) * 0.6;
export const getAttackMultiplier = (upgrade) => 1 + getUpgradeTier(upgrade) * 0.04;
export const getCritChance = (upgrade) => getUpgradeTier(upgrade) * 0.024;
export const getLuckMultiplier = (upgrade) => 1 + getUpgradeTier(upgrade) * 0.1;

export const getKillReward = (level, upgrades) => {
    const effectiveDamage = (1 + getStrengthBonus(upgrades.strength)) * getAttackMultiplier(upgrades.attackDamage);
    return Math.round(level * 20 * effectiveDamage * getLuckMultiplier(upgrades.luck));
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