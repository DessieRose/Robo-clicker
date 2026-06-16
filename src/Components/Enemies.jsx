import React from 'react';

const Enemies = ({ id, onClick }) => {
  return (
    <div className="enemies" onClick={onClick}>
      <img
        alt="robot_enemy"
        src={`https://robohash.org/${id}?size=350x350`}
      />
    </div>
  );
};

export default Enemies;