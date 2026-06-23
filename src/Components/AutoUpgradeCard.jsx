const Stages = [
    {
        upgradeName: "Drone", stages: [
    {stage: 1, name: "Scrap Drone",    price: 200, damage: 15},
    {stage: 2, name: "Tiny Drone",     price: 300, damage: 25},
    {stage: 3, name: "Large Drone",    price: 400, damage: 35},
    {stage: 4, name: "Military Drone", price: 500, damage: 45},
    {stage: 5, name: "Battle Drone",   price: 600, damage: 55},
        ]
    },
    {
        upgradeName: "Turret", stages: [
    {stage: 1, name: "Small Turret",   price: 200, damage: 15},
    {stage: 2, name: "Large Turret",   price: 300, damage: 25},
    {stage: 3, name: "Laser Turret",   price: 400, damage: 35},
    {stage: 4, name: "Missile Turret", price: 500, damage: 45},
    {stage: 5, name: "Plasma Turret",  price: 600, damage: 55},
    ]},
    {
        upgradeName: "Robot", stages: [
    {stage: 1, name: "Broken Robot",   price: 200, damage: 15},
    {stage: 2, name: "Robot Friend",   price: 300, damage: 25},
    {stage: 3, name: "Robot Cop",      price: 400, damage: 35},
    {stage: 4, name: "Military Robot", price: 500, damage: 45},
    {stage: 5, name: "Robot Arnold",   price: 600, damage: 55},
    ]},
];

// onStage receives the next stage's price so Upgrades can deduct money
const AutoUpgradeCard = ({ upgradeName, stage, image, onStage, money }) => {
    const stageData = Stages.find(s => s.upgradeName === upgradeName);
    const currentStage = stageData.stages.find(s => s.stage === stage) ?? null;
    const nextStage = stageData.stages.find(s => s.stage === stage + 1) ?? null;
    const isMax = currentStage && !nextStage;
    const canAfford = nextStage && money >= nextStage.price;

    return (
        <div className="upgrade-item">
            <img src={image} alt={upgradeName} />
            <div className="upgrade-info">
                <h3>{currentStage ? currentStage.name : upgradeName}</h3>
                {nextStage && <p>{currentStage ? `Next: ${nextStage.name}` : nextStage.name}</p>}
            </div>
            <div
                className={`upgrade-button ${isMax || !canAfford ? 'upgrade-button--disabled' : ''}`}
                onClick={() => canAfford && onStage(nextStage.price)}
            >
                {isMax ? 'MAX' : `$${nextStage ? nextStage.price : ''}`}
            </div>
        </div>
    );
};

export default AutoUpgradeCard;
