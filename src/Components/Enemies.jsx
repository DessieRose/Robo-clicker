import React, { useMemo } from 'react';

const Enemies = ({ id, onClick }) => {
  // If no id is passed, generate a random one
  const randomId = useMemo(() => id || Math.floor(Math.random() * 1000000), [id]);

  return (
    <div className="enemies" onClick={onClick}>
      <img
        alt="robot_enemy"
        src={`https://robohash.org/${randomId}?size=350x350`}
      />
    </div>
  );
};

export default Enemies;