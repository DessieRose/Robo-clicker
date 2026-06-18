import React from 'react';

const getColorForLevel = (level) => {
    if (level <= 5)  return 'brown';
    if (level <= 10) return 'grey';
    if (level <= 15) return 'red';
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
