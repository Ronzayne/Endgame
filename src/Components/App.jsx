import { useState } from "react";
import { clsx } from "clsx";
import { languages } from "../data/languages";
import { getFarewellText, getRandomWord } from "../data/utils";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
export default function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  function newGame() {
    setCurrentWord(getRandomWord);
    setGuessedLetters([]);
  }
  const letters = "abcdefghijklmnopqrstuvwxyz";

  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;

  const isGameOver = isGameWon || isGameLost;
  // console.log(isGameOver);
  const isLastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    isLastGuessedLetter && !currentWord.includes(isLastGuessedLetter);
  console.log(isLastGuessIncorrect);

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

  const letterElement = currentWord.split("").map((letter, index) => {
    const shouldRevealLetters = isGameLost || guessedLetters.includes(letter);
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letters"
    );
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetters ? letter.toUpperCase() : null}
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
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letters)}
        aria-label={`Letter ${letters}`}
        onClick={() => getGuessedLetters(letters)}
      >
        {letters.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });

  const { width, height } = useWindowSize();
  return (
    <main>
      {isGameWon ? (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={1000}
        />
      ) : null}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
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
        ) : !isGameOver ? (
          isLastGuessIncorrect ? (
            <p className="farewell-message">
              {getFarewellText(languages[wrongGuessCount - 1].name)}
            </p>
          ) : null
        ) : null}
      </section>

      <section className="languages">{languageElement}</section>

      <section className="current-word">{letterElement}</section>

      {/* Visually hidden aria-live region for status updates */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(isLastGuessedLetter)
            ? `Correct! The letter ${isLastGuessedLetter} is in the word`
            : `Sorry, The letter ${isLastGuessedLetter} is not in the word`}
          You have {languages.length - 1} attempts left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>

      <section className="keyboard">{keyBordElements}</section>
      <div className="new-game">
        {isGameOver ? (
          <button onClick={newGame} className="new-game-button">
            New Game
          </button>
        ) : null}
      </div>
    </main>
  );
}
