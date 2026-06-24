const PRICES = {
    strength:       [30,  60,  100, 150, 220],
    luck:           [80, 150, 250, 400, 600],
    attackDamage:   [60,  120, 200, 320, 500],
    criticalDamage: [50,  100, 160, 250, 380],
};

export const getUpgradePrice = (key, level) => {
    const levelPrices = PRICES[key];
    if (!levelPrices || level < 1 || level > 5) return 0;
    return levelPrices[level - 1];
};

const UpgradeCard = ({ upgradeKey, title, image, progress, level, onUpgrade, money }) => {
    const isMax = level === 'MAX';
    const price = getUpgradePrice(upgradeKey, level);
    const canAfford = !isMax && money >= price;

    return (
        <div className="upgrade-item">
            <img src={image} alt={title} />

            <div className="upgrade-info">
                <h3>{title}</h3>
                <div className="upgrade-progress-bar">
                    <div className="upgrade-progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <p>Level: {level}</p>
            </div>

            <div
                className={`upgrade-button ${isMax || !canAfford ? 'upgrade-button--disabled' : ''}`}
                onClick={!isMax ? onUpgrade : undefined}
            >
                {isMax ? 'MAX' : `Upgrade $${price}`}
            </div>
        </div>
    );
};

export default UpgradeCard;
