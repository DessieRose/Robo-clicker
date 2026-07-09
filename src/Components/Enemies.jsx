import React, { useMemo } from 'react';
import robot1 from '../Images/robots/robot_1.webp';
import robot2 from '../Images/robots/robot_2.webp';
import robot3 from '../Images/robots/robot_3.webp';
import robot4 from '../Images/robots/robot_4.webp';
import robot5 from '../Images/robots/robot_5.webp';

const robotImages = [robot1, robot2, robot3, robot4, robot5];

const Enemies = ({ id, onClick }) => {
    const robotImage = useMemo(
        () => robotImages[Math.floor(Math.random() * robotImages.length)],
        [id]
    );

    return (
        <div className="enemies" onClick={onClick}>
            <img alt="robot_enemy" src={robotImage} />
        </div>
    );
};

export default Enemies;
