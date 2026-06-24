import React from 'react';
import startPageImg from '../Images/start-page/startpage.png';
import logo from '../Images/start-page/logo.png';
import './StartScreen.css';

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <img src={logo} alt="Robo Clicker Logo" className="start-screen__logo" />
      <img src={startPageImg} alt="Robo Clicker" className="start-screen__image" />
      <button className="start-screen__button" onClick={onStart}>
        START GAME
      </button>
    </div>
  );
}
