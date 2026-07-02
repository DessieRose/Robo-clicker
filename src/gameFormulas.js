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
