import React from "react";

const Progress = ({ progress }) => {
    const getColor = () => {
        if (progress < 40){
            return "#ff0000";
        } else if (progress < 70){
            return "#ffa500";
        } else {
            return "#2ecc71";
        }
    }

    return (
        <div className="container">
            <div className="progress-bar">
                <div className="progress_lable">{progress}%</div>
                    <div className="progress-bar_fill" style={{width: `${progress}%`, backgroundColor: getColor()}}></div>
            </div>
        </div>
    );
};

export default Progress;