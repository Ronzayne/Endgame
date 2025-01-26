import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { languages } from "../data/languages";
import { getFarewellText, getRandomWord } from "../data/utils";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

export default function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [time, setTime] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  function startTimer() {
    setIsRunning(true);
  }

  function resetTimer() {
    setTime(60);
    setIsRunning(false);
  }

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
  const isGameLost = wrongGuessCount >= languages.length - 1 || time <= 0;

  const isGameOver = isGameWon || isGameLost;

  useEffect(() => {
    let timerInterval;
    if (isGameOver) return;
    if (isRunning && time > 0) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning, time, isGameOver]);

  useEffect(() => {
    if (time <= 0) {
      setIsRunning(false);
    }
  }, [time]);

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
        onClick={() => {
          getGuessedLetters(letters);
          startTimer();
        }}
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

  const farewellMessage = useMemo(() => {
    if (isLastGuessIncorrect) {
      return getFarewellText(languages[wrongGuessCount - 1]?.name);
    }
    return null;
  }, [isLastGuessIncorrect, wrongGuessCount]);

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
          isLastGuessIncorrect && farewellMessage ? (
            <p className="farewell-message">{farewellMessage}</p>
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
        <p className="guess-class">Remaining: {8 - wrongGuessCount}</p>
        {isGameOver ? (
          <button
            onClick={() => {
              newGame();
              resetTimer();
            }}
            className="new-game-button"
          >
            New Game
          </button>
        ) : null}

        <p className="timer">Timer: {time}s</p>
      </div>
    </main>
  );
}
