import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WordGuessGame() {
  const [wordLength, setWordLength] = useState(5);
  const [computerWord, setComputerWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [matchingLetters, setMatchingLetters] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showGuessMessage, setShowGuessMessage] = useState(false);

  const startNewGame = () => {
    // Make an API request to generate a random word with the specified length
    if (wordLength > 0) {
      axios
        .get('https://random-word-api.herokuapp.com/word', {
          params: {
            length: wordLength
          }
        })
        .then((response) => {
          setComputerWord(response.data[0]);
          setMatchingLetters(0);
          setGameOver(false);
          setShowGuessMessage(true);
          console.log(response.data[0]);
          // Hide the "Guess the word" message after 5 seconds
          setTimeout(() => {
            setShowGuessMessage(false);
          }, 5000);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleGuess = () => {
    // Compare the user's guess with the computer's word
    const matchingLettersCount = calculateMatchingLetters(userGuess, computerWord);
    setMatchingLetters(matchingLettersCount);

    if (userGuess === computerWord) {
      setGameOver(true);
    }
  };

  const calculateMatchingLetters = (guess, target) => {
    let matching = 0;
    for (let i = 0; i < target.length; i++) {
      if (i < guess.length && guess.charAt(i) === target.charAt(i)) {
        matching++;
      }
    }
    return matching;
  };

  useEffect(() => {
    // Hide the "Guess the word" message if it is shown after 5 seconds
    if (showGuessMessage) {
      const timer = setTimeout(() => {
        setShowGuessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showGuessMessage]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Word Guessing Game</h1>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="wordLength">Enter word length:</label>
            <input
              type="number"
              id="wordLength"
              className="form-control"
              value={wordLength}
              onChange={(e) => setWordLength(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={startNewGame}>
            Start New Game
          </button>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="userGuess">Enter your guess:</label>
            <input
              type="text"
              id="userGuess"
              className="form-control"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleGuess}>
            Guess
          </button>
          {showGuessMessage && (
            <div className="text-center mt-3">
              <h2>Guess the word</h2>
            </div>
          )}
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6 text-center">
          {gameOver && <h2>Congratulations! You guessed the word.</h2>}
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6 text-center">
          <p>Matching Letters: {matchingLetters}</p>
        </div>
      </div>
    </div>
  );
}

export default WordGuessGame;
