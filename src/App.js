import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import "./App.css";

const generateSequence = (length) => {
  const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let sequence = "";
  for (let i = 0; i < length; i++) {
    sequence += keys.charAt(Math.floor(Math.random() * keys.length));
  }
  return sequence;
};

const renderSequence = (sequence, currentLetterIndex, typedLetters) => {
  return sequence.split("").map((letter, index) => (
    <span
      key={index}
      className={`sequence-letter ${
        index === currentLetterIndex
          ? "highlight"
          : typedLetters.includes(index)
          ? "typed"
          : ""
      }`}
    >
      {letter}
    </span>
  ));
};

const GameScreen = ({ onStart }) => (
  <div className="card-home">
    <div className="dados-home">
      <h1>MINI GAME</h1>
      <div className="svg-container">
        <img src={process.env.PUBLIC_URL + "/cda.png"} alt="Logo" />
      </div>
      <button onClick={onStart}>Iniciar</button>
    </div>
  </div>
);

const GameOverScreen = ({ score, onRestart, onQuit }) => (
  <div className="game-over-screen">
    <h2>Tente Novamente!</h2>
    <p>Pontuação: {score}</p>
    <div className="game-over-buttons">
      <button onClick={onRestart}>Jogar Novamente</button>
      <button onClick={onQuit}>Sair</button>
    </div>
  </div>
);

const App = () => {
  const [sequence, setSequence] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [typedLetters, setTypedLetters] = useState([]);

  const correctSound = useMemo(() => {
    const audio = new Audio(process.env.PUBLIC_URL + "/correct.mp3");
    audio.onerror = () => console.error("Error loading correct.mp3");
    return audio;
  }, []);

  const incorrectSound = useMemo(() => {
    const audio = new Audio(process.env.PUBLIC_URL + "/incorrect.mp3");
    audio.onerror = () => console.error("Error loading incorrect.mp3");
    return audio;
  }, []);

  useEffect(() => {
    if (gameStarted) {
      setSequence(generateSequence(5));
      setTimeLeft(30);
      setGameOver(false);
      setCurrentLetterIndex(0);
      setTypedLetters([]);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const newChar = event.key.toUpperCase();
      if (!gameOver && gameStarted && /^[A-Z]$/.test(newChar)) {
        if (newChar === sequence[currentLetterIndex]) {
          setCurrentLetterIndex((prevIndex) => prevIndex + 1);
          setTypedLetters((prevTypedLetters) => [...prevTypedLetters, currentLetterIndex]);
          correctSound.play();
          if (currentLetterIndex === sequence.length - 1) {
            setScore((prevScore) => prevScore + 1);
            setCurrentLetterIndex(0);
            setSequence(generateSequence(5));
            setTypedLetters([]);
          }
        } else {
          setGameOver(true);
          incorrectSound.play();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    sequence,
    currentLetterIndex,
    gameOver,
    gameStarted,
    correctSound,
    incorrectSound,
  ]);

  useEffect(() => {
    let timer;
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, timeLeft]);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleRestart = () => {
    setScore(0);
    setTimeLeft(30);
    setSequence(generateSequence(5));
    setGameOver(false);
    setCurrentLetterIndex(0);
    setTypedLetters([]);
    setGameStarted(true);
  };

  const handleQuit = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setTypedLetters([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        {!gameStarted && !gameOver && <GameScreen onStart={handleStartGame} />}
        {gameStarted && !gameOver && (
          <div className="card">
            <h1>MINI GAME</h1>
            
            <div className="game-info">
              <p>Pontuação: {score}</p>
              
            </div>
            <div className="game-play">
              <p>{renderSequence(sequence, currentLetterIndex, typedLetters)}</p>
            </div>
            <div className="time-bar-container">
              <div
                className="time-bar"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
            <button className="restart-button" onClick={handleRestart}>
                <FontAwesomeIcon icon={faRedo} />
              </button>
          </div>
        )}
        {gameOver && (
          <GameOverScreen
            score={score}
            onRestart={handleRestart}
            onQuit={handleQuit}
          />
        )}
      </header>
    </div>
  );
};

export default App;
