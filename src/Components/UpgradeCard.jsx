import { getUpgradePrice } from '../gameFormulas.js';
export { getUpgradePrice };

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
