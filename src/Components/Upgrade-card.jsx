export const getUpgradePrice = (level) => {
    switch (level) {
        case 1: return 50;
        case 2: return 100;
        case 3: return 150;
        case 4: return 200;
        case 5: return 250;
        default: return 0;
    }
};

const UpgradeCard = ({ title, image, progress, level, onUpgrade, money }) => {
    const price = getUpgradePrice(level);
    const canAfford = money >= price;

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
                className={`upgrade-button ${canAfford ? '' : 'upgrade-button--disabled'}`}
                onClick={onUpgrade}
            >
                {`Upgrade $${price}`}
            </div>
        </div>
    );
};

export default UpgradeCard;
