import React from 'react';

const getColorForLevel = (level) => {
    if (level <= 10)  return 'grey';
    if (level <= 20) return 'yellow';
    if (level <= 30) return 'blue';
    if (level <= 40) return 'green';
    if (level <= 50) return 'purple';
    if (level <= 60) return 'purple';
    if (level <= 70) return 'orange';
    if (level <= 80) return 'pink';
    if (level <= 90) return 'yellow';
    return 'black';
};

const Enemies = ({ id, onClick, level }) => {
    const color = getColorForLevel(level);

    return (
        <div className="enemies" onClick={onClick}>
            <img
                alt="robot_enemy"
                src={`https://robohash.org/${id}?color=${color}`}
            />
        </div>
    );
};

export default Enemies;
