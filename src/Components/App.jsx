import { useState } from "react";
import { languages } from "../data/languages";

export default function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState("react");

  const letters = "abcdefghijklmnopqrstuvwxyz";

  const languageElement = languages.map((el) => {
    return (
      <span
        key={el.name}
        style={{
          color: el.color,
          backgroundColor: el.backgroundColor,
          borderRadius: "3px",
          padding: "4.5px",
        }}
      >
        {el.name}
      </span>
    );
  });

  //the .split will give an array of all the letters in the word
  const letterElement = currentWord.split("").map((el, index) => {
    return <span key={index}>{el.toUpperCase()}</span>;
  });

  const keyBordElements = letters
    .split("")
    .map((letters) => <button key={letters}>{letters.toUpperCase()}</button>);

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

      <section className="letters">{keyBordElements}</section>
      <div className="new-game">
        <button className="new-game-button">New Game</button>
      </div>
    </main>
  );
}
