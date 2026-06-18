const UpgradeCard = ({ title, image, progress, level, onUpgrade }) => {
  return (
    <div className="upgrade-item">
      <img src={image} alt={title} />

      <div className="upgrade-info">
        <h3>{title}</h3>
        <div className="upgrade-progress-bar">
            <div className="upgrade-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p>Level: {level}</p>
      </div>

      <div className="upgrade-button" onClick={onUpgrade}>Upgrade</div>
    </div>
  );
};

export default UpgradeCard;
