import React from 'react';
import startPageImg from '../Images/start-page/startpage.png';
import './StartScreen.css';

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <img src={startPageImg} alt="Robo Clicker" className="start-screen__image" />
      <button className="start-screen__button" onClick={onStart}>
        START GAME
      </button>
    </div>
  );
}
