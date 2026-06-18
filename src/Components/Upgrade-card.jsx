const UpgradeCard = ({ title, image, progress, level, onUpgrade }) => {
  return (
    <div className="upgrade-item">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p>Level: {level}</p>
      <button onClick={onUpgrade}>Upgrade</button>
    </div>
  );
};

export default UpgradeCard;
