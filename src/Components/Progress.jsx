import React from "react";

const Progress = ({ progress, level }) => {
    const maxHp = Math.pow(level * 1.2, 2) * 100;
    const currentHp = Math.max(0, Math.round((progress / 100) * maxHp));

    const getColor = () => {
        if (progress < 40){
            return "var(--dark-pale-red)";
        } else if (progress < 70){
            return "var(--dark-pale-orange)";
        } else {
            return "var(--dark-pale-green)";
        }
    }

    return (
        <div className="container">
            <div className="progress-bar">
                <div className="progress_lable">{currentHp} / {Math.round(maxHp)}</div>
                    <div className="progress-bar_fill" style={{width: `${progress}%`, backgroundColor: getColor()}}></div>
            </div>
        </div>
    );
};

export default Progress;