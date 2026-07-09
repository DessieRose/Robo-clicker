import scrapDroneImage from "../Images/auto/drone/scrap-drone.webp";
import tinyDroneImage from "../Images/auto/drone/tiny-drone.webp";
import largeDroneImage from "../Images/auto/drone/large-drone.webp";
import militaryDroneImage from "../Images/auto/drone/military-drone.webp";
import battleDroneImage from "../Images/auto/drone/battle-drone.webp";

import smallTurretImage from "../Images/auto/turret/small-turret.webp";
import largeTurretImage from "../Images/auto/turret/large-turret.webp";
import laserTurretImage from "../Images/auto/turret/laser-turret.webp";
import missileTurretImage from "../Images/auto/turret/missile-turret.webp";
import plasmaTurretImage from "../Images/auto/turret/plasma-turret.webp";

import robotArmImage from "../Images/auto/robot/robot-arm.webp";
import robotFriendImage from "../Images/auto/robot/robot-friend.webp";
import robotCopImage from "../Images/auto/robot/robot-cop.webp";
import militaryRobotImage from "../Images/auto/robot/military-robot.webp";
import robotArnoldImage from "../Images/auto/robot/robot-cyborg.webp";

export const Stages = [
    {
        upgradeName: "Drone", stages: [
    {stage: 1, name: "Scrap Drone",    price: 2000,  damage: 20,  image: scrapDroneImage},
    {stage: 2, name: "Tiny Drone",     price: 5000,  damage: 40,  image: tinyDroneImage},
    {stage: 3, name: "Large Drone",    price: 11000, damage: 70,  image: largeDroneImage},
    {stage: 4, name: "Military Drone", price: 24000, damage: 110, image: militaryDroneImage},
    {stage: 5, name: "Battle Drone",   price: 50000, damage: 160, image: battleDroneImage},
    ]},
    {
        upgradeName: "Turret", stages: [
    {stage: 1, name: "Small Turret",   price: 2500,  damage: 20,  image: smallTurretImage},
    {stage: 2, name: "Large Turret",   price: 6000,  damage: 40,  image: largeTurretImage},
    {stage: 3, name: "Laser Turret",   price: 13000, damage: 70,  image: laserTurretImage},
    {stage: 4, name: "Missile Turret", price: 28000, damage: 110, image: missileTurretImage},
    {stage: 5, name: "Plasma Turret",  price: 60000, damage: 160, image: plasmaTurretImage},
    ]},
    {
        upgradeName: "Robot", stages: [
    {stage: 1, name: "Robot arm",      price: 3000,  damage: 20,  image: robotArmImage},
    {stage: 2, name: "Robot Friend",   price: 7500,  damage: 40,  image: robotFriendImage},
    {stage: 3, name: "Robot Cop",      price: 16000, damage: 70,  image: robotCopImage},
    {stage: 4, name: "Military Robot", price: 34000, damage: 110, image: militaryRobotImage},
    {stage: 5, name: "Robot Arnold",   price: 70000, damage: 160, image: robotArnoldImage},
    ]},
];

// onStage receives the next stage's price so Upgrades can deduct money
const AutoUpgradeCard = ({ upgradeName, stage, onStage, money }) => {
    const stageData = Stages.find(s => s.upgradeName === upgradeName);
    const currentStage = stageData.stages.find(s => s.stage === stage) ?? null;
    const nextStage = stageData.stages.find(s => s.stage === stage + 1) ?? null;
    const isMax = currentStage && !nextStage;
    const canAfford = nextStage && money >= nextStage.price;

    return (
        <div className="upgrade-item">
            <img src={currentStage?.image ?? nextStage?.image} alt={upgradeName} />
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
