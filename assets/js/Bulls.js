import React, { useState, useEffect } from 'react'
import 'milligram';
import { uniqDigits } from './util';
import { ch_join, ch_push_guess, ch_push_reset } from './socket'

export function Bulls() {
  // Rely on the server for state, but also keep track of current input
  const [guess, setGuess] = useState("");
  const [state, setState] = useState();

  // Join the server
  useEffect(() => {
    ch_join(setState);
  });

  // Reset state to empty, and generate a new secret number
  function resetGame() {
    ch_push_reset();
    setState(undefined);
    setGuess("");
  }

  // Update the input field text, keeping only unique digits
  function updateGuess(ev) {
    setGuess(uniqDigits(ev.target.value).substring(0, state["secret_len"]));
  }

  // Make a guess if enter is pressed, and backspace when backspace is pressed
  function keypress(ev) {
    if (ev.key == "Enter" && guess.length === state["secret_len"]) {
      makeGuess();
    }
    if (ev.key == "Backspace" && guess.length > 0) {
      setGuess(guess.substring(0, guess.length));
    }
  }

  // Add the new guess to the guesses state, then reset the current guess 
  function makeGuess() {
    setGuess("");
    ch_push_guess(guess);
  }

  // Render all NUM_GUESSES rows and guesses/results
  function guessGrid() {
    let guessRows = [];
    const guesses = state["guesses"];
    const results = state["results"];
    const numGuesses = guesses.length;

    for (let i = 1; i <= state["num_guesses"]; i++) {
      guessRows.push(
        <div className="row" key={i}>
          <div className="column align-right">
            <strong>{i}</strong>
          </div>
          <div className="column">
            {numGuesses < i ? "" : guesses[i - 1]}
          </div>
          <div className="column">
            {numGuesses < i ? "" : results[i - 1]}
          </div>
        </div>
      );
    }

    return guessRows;
  }

  // Render the game status message (empty until game is over)
  function statusMessage() {
    if (state["won"]) {
      return <h1>You Win!</h1>;
    }
    if (state["lost"]) {
      return (
        <h1>You Lose.</h1>
      );
    }
    return <p>&nbsp;</p>;
  }

  // Wait for the connection to the server to be established, then render the game
  // We wait because the server dictates how many guesses there are, and how long the secret number is.
  return (
    <div className="bulls-and-cows">
      {
        state ?
          <div className="container">
            <div className="row">
              <div className="column align-right">
                <h3>Input:</h3>
              </div>
              <div className="column">
                <input type="text"
                  value={guess}
                  onChange={updateGuess}
                  onKeyDown={keypress}
                  disabled={state["won"] || state["lost"]} />
              </div>
              <div className="column align-left">
                <button disabled={state["secret_len"] && guess.length !== state["secret_len"]} onClick={() => makeGuess()}>Guess</button>
              </div>
            </div>
            <div className="row">
              <div className="column"></div>
              <div className="column">
                <strong>Guess</strong>
              </div>
              <div className="column">
                <strong>Result</strong>
              </div>
            </div>
            {guessGrid()}
            {statusMessage()}
            <button className="button-outline" disabled={state["guesses"].length === 0} onClick={() => resetGame()}>Reset</button>
          </div>
          : <p>Loading...</p>
      }
    </div>
  );
}