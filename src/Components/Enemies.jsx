import React, { useMemo } from 'react';

const ROBOTS_PER_TIER = 5;
const LEVELS_PER_TIER = 10;

const robotContext = require.context('../Images/robots', false, /robot_\d+\.webp$/);
const robotImages = robotContext
    .keys()
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))
    .map(robotContext);

const maxTier = Math.floor((robotImages.length - 1) / ROBOTS_PER_TIER);

const getRobotsForLevel = (level) => {
    const tier = Math.min(Math.floor((level - 1) / LEVELS_PER_TIER), maxTier);
    const start = tier * ROBOTS_PER_TIER;
    return robotImages.slice(start, start + ROBOTS_PER_TIER);
};

const Enemies = ({ id, level, onClick }) => {
    const robotImage = useMemo(() => {
        const options = getRobotsForLevel(level);
        return options[Math.floor(Math.random() * options.length)];
    }, [id, level]);

    return (
        <div className="enemies" onClick={onClick}>
            <img alt="robot_enemy" src={robotImage} />
        </div>
    );
};

export default Enemies;
