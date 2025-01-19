import { useState } from "react";
import { clsx } from "clsx";
import { languages } from "../data/languages";

export default function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState("react");
  const [guessedLetters, setGuessedLetters] = useState([]);
  console.log(guessedLetters);

  const letters = "abcdefghijklmnopqrstuvwxyz";

  function getGuessedLetters(letter) {
    setGuessedLetters((prevVal) =>
      prevVal.includes(letter) ? prevVal : [...prevVal, letter]
    );
  }
  const languageElement = languages.map((el) => {
    return (
      <span
        key={el.name}
        style={{
          color: el.color,
          backgroundColor: el.backgroundColor,
        }}
      >
        {el.name}
      </span>
    );
  });

  const letterElement = currentWord.split("").map((el, index) => {
    return (
      <span key={index}>
        {guessedLetters.includes(el) ? el.toUpperCase() : null}
      </span>
    );
  });

  const keyBordElements = letters.split("").map((letters) => {
    const isGuessed = guessedLetters.includes(letters);
    const isCorrect = isGuessed && currentWord.includes(letters);
    const isWrong = isGuessed && !currentWord.includes(letters);

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    console.log(className);
    return (
      <button
        className={className}
        key={letters}
        onClick={() => getGuessedLetters(letters)}
      >
        {letters.toUpperCase()}
      </button>
    );
  });

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className="game-status">
        <h2>You win!</h2>
        <p>Well done 🎉</p>
      </section>

      <section className="languages">{languageElement}</section>

      <section className="current-word">{letterElement}</section>

      <section className="keyboard">{keyBordElements}</section>
      <div className="new-game">
        <button className="new-game-button">New Game</button>
      </div>
    </main>
  );
}
