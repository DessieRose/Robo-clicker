import React from 'react';
import Enemies from './Components/Enemies';
import Exp from './Components/Exp';
import Progress from './Components/Progress';

import './App.css';

function App() {
  return (
    <div className="container">
    <div className='exp_empty'></div>
    <Exp />
    <div className="levelNum">
      <h2>65</h2>
    </div>
    <div className="level">
      <h3>LEVEL</h3>
    </div>
    <div className="money">
      <p>$0.0k</p>
    </div>
      <div className="clicks">
        <p>50 clicks/s</p>
      </div>
    <div>
      <Enemies />
      <Progress />
    </div>
  </div>
  
  );
}

export default App;
