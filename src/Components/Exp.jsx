import React from "react";

const Exp = ({ exp }) => {

    return (
       <div className="container">
         <div className="exp_bar">
            <div className="exp_fill" style={{ background: `conic-gradient(from 225deg, #BEDF75 ${(exp / 100) * 75}%, #E4E4E4 ${(exp / 100) * 75}%, #E4E4E4 75%, transparent 75%)` }}>

            </div>
         </div>
        </div>
    );
};

export default Exp;