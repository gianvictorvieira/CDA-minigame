import React, { useState, useEffect, useMemo } from "react";
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
      <div className="svg-container">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 59 56">
          <path fill="currentColor" d="m0 7.667 1.82-1.81V1.81L3.64 0H59l-1.82 1.81v4.046l-1.82 1.81h-13.6l-3.64 3.62V44.19L36.3 46h-7.71l1.82-1.81V11.287l3.64-3.62z"></path>
          <path fill="currentColor" d="m41.66 10-1.83 1.81v42.38L38 56h7.754l1.83-1.81V31.195L49.414 33v21.19L47.585 56h7.754l1.831-1.81V11.81L59 10H41.661m7.755 15.336-1.831-1.813v-5.857h1.83zM3.66 10l-1.83 1.81v42.38L0 56h7.754l1.83-1.81V33.009l1.83-1.81v22.99L9.585 56h7.754l1.831-1.81V11.81L21 10zm5.924 7.667h1.83v5.862l-1.83 1.81z"></path>
          <path fill="currentColor" d="M38 48.333v5.857L36.185 56H19l1.814-1.81V11.81L22.63 10h7.685L28.5 11.81v32.903l-3.63 3.62z"></path>
        </svg>
      </div>
      <h1>Mini Game</h1>
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

  const correctSound = useMemo(() => new Audio("/correct.mp3"), []);
  const incorrectSound = useMemo(() => new Audio("/incorrect.mp3"), []);

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
            <h1>Mini Game</h1>
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
