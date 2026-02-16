import React, { useState } from "react";

const Progress = () => {
    const [progress, setProgress] = useState(100);
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
                <div className="progress-bar_fill" style={{width: `${progress}%`, backgroundColor: getColor()}}>progress bar</div>
                    <div className="progress_lable">{progress}%</div>
            </div>
        </div>
    );
};
    
export default Progress;