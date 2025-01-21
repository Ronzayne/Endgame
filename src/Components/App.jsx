import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { languages } from "../data/languages";

export default function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState("react");
  const [guessedLetters, setGuessedLetters] = useState([]);

  const letters = "abcdefghijklmnopqrstuvwxyz";

  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  // console.log(isGameWon);
  const isGameLost = wrongGuessCount >= languages.length - 1;

  const isGameOver = isGameWon || isGameLost;
  console.log(isGameOver);
  function getGuessedLetters(letter) {
    setGuessedLetters((prevVal) =>
      prevVal.includes(letter) ? prevVal : [...prevVal, letter]
    );
  }

  console.log(wrongGuessCount);
  const languageElement = languages.map((el, index) => {
    const isLangLost = index < wrongGuessCount;
    const className = clsx(isLangLost && "lost");
    return (
      <span
        className={className}
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
    isWrong ? wrongGuessCount + 1 : null;
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

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
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
      <section className={gameStatusClass}>
        {isGameOver ? (
          isGameWon ? (
            <>
              <h2>You win!</h2>
              <p>Well done🎉</p>
            </>
          ) : (
            <>
              <h2>Game Over!</h2>
              <p>You lose! Get ready to start learning Assembly 😭</p>
            </>
          )
        ) : null}
      </section>

      <section className="languages">{languageElement}</section>

      <section className="current-word">{letterElement}</section>

      <section className="keyboard">{keyBordElements}</section>
      <div className="new-game">
        {isGameOver ? (
          <button className="new-game-button">New Game</button>
        ) : null}
      </div>
    </main>
  );
}
