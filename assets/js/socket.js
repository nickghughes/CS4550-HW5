// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import { Socket } from "phoenix"

let socket = new Socket("/socket", { params: { token: "" } })
socket.connect()

let channel = socket.channel("game:1", {});

let state, callback;

function state_update(st) {
  console.log(`New state: ${JSON.stringify(st)}`);
  state = st;
  if (callback) {
    callback(st);
  }
}

export function ch_join(cb) {
  callback = cb;
  callback(state);
}

export function ch_push_guess(guess) {
  channel.push("guess", { "guess": guess })
    .receive("ok", state_update)
    .receive("error", resp => { console.log("Unable to push", resp) });
}

export function ch_push_reset() {
  channel.push("reset", {})
    .receive("ok", state_update)
    .receive("error", resp => { console.log("Unable to push", resp) });
}

channel.join()
  .receive("ok", state_update)
  .receive("error", resp => { console.log("Unable to join", resp) });

export default socket;
