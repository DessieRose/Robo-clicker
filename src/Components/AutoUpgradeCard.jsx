import scrapDroneImage from "../Images/auto/drone/scrap-drone.png";
import tinyDroneImage from "../Images/auto/drone/tiny-drone.png";
import largeDroneImage from "../Images/auto/drone/large-drone.png";
import militaryDroneImage from "../Images/auto/drone/military-drone.png";
import battleDroneImage from "../Images/auto/drone/battle-drone.png";

import smallTurretImage from "../Images/auto/turret/small-turret.png";
import largeTurretImage from "../Images/auto/turret/large-turret.png";
import laserTurretImage from "../Images/auto/turret/laser-turret.png";
import missileTurretImage from "../Images/auto/turret/missile-turret.png";
import plasmaTurretImage from "../Images/auto/turret/plasma-turret.png";

import robotArmImage from "../Images/auto/robot/robot-arm.png";
import robotFriendImage from "../Images/auto/robot/robot-friend.png";
import robotCopImage from "../Images/auto/robot/robot-cop.png";
import militaryRobotImage from "../Images/auto/robot/military-robot.png";
import robotArnoldImage from "../Images/auto/robot/robot-cyborg.png";

export const Stages = [
    {
        upgradeName: "Drone", stages: [
    {stage: 1, name: "Scrap Drone",    price: 500, damage: 15, image: scrapDroneImage},
    {stage: 2, name: "Tiny Drone",     price: 800, damage: 25, image: tinyDroneImage},
    {stage: 3, name: "Large Drone",    price: 1400, damage: 35, image: largeDroneImage},
    {stage: 4, name: "Military Drone", price: 2500, damage: 45, image: militaryDroneImage},
    {stage: 5, name: "Battle Drone",   price: 4000, damage: 55, image: battleDroneImage},
    ]},
    {
        upgradeName: "Turret", stages: [
    {stage: 1, name: "Small Turret",   price: 600, damage: 15, image: smallTurretImage},
    {stage: 2, name: "Large Turret",   price: 900, damage: 25, image: largeTurretImage},
    {stage: 3, name: "Laser Turret",   price: 1500, damage: 35, image: laserTurretImage},
    {stage: 4, name: "Missile Turret", price: 2600, damage: 45, image: missileTurretImage},
    {stage: 5, name: "Plasma Turret",  price: 5000, damage: 55, image: plasmaTurretImage},
    ]},
    {
        upgradeName: "Robot", stages: [
    {stage: 1, name: "Robot arm",   price: 700, damage: 15, image: robotArmImage},
    {stage: 2, name: "Robot Friend",   price: 1000, damage: 25, image: robotFriendImage},
    {stage: 3, name: "Robot Cop",      price: 1600, damage: 35, image: robotCopImage},
    {stage: 4, name: "Military Robot", price: 2700, damage: 45, image: militaryRobotImage},
    {stage: 5, name: "Robot Arnold",   price: 6000, damage: 55, image: robotArnoldImage},
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
