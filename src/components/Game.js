import React, { useState, useEffect } from 'react';

const Game = () => {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  // Função para gerar uma nova sequência aleatória de teclas
  const generateSequence = () => {
    const keys = ['A', 'B', 'C', 'D'];
    const newSequence = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * keys.length);
      newSequence.push(keys[randomIndex]);
    }
    setSequence(newSequence);
  };

  // Função para iniciar o jogo
  const startGame = () => {
    generateSequence();
    setScore(0);
    setTimer(10);
    setGameOver(false);
  };

  // Função para processar a entrada do jogador
  const handleKeyPress = (event) => {
    const { key } = event;
    if (!gameOver) {
      setUserInput((prevInput) => prevInput + key);
      if (key === sequence[userInput.length]) {
        if (userInput.length === sequence.length - 1) {
          setScore(score + 1);
          setUserInput('');
          generateSequence();
        }
      } else {
        endGame();
      }
    }
  };

  // Função para terminar o jogo
  const endGame = () => {
    setGameOver(true);
    setUserInput('');
  };

  // Contagem regressiva do temporizador
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          clearInterval(interval);
          endGame();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, gameOver]);

  // Adicionando evento de teclado para capturar entrada do jogador
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameOver]);

  return (
    <div>
      <h1>Tempo restante: {timer}</h1>
      {gameOver ? (
        <div>
          <h2>Fim de Jogo!</h2>
          <p>Sua pontuação final: {score}</p>
          <button onClick={startGame}>Iniciar Novamente</button>
        </div>
      ) : (
        <div>
          <h2>Sequência: {sequence.join(', ')}</h2>
          <input type="text" value={userInput} readOnly />
        </div>
      )}
    </div>
  );
};

export default Game;
