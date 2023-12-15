import { Box } from "./lib/elements/Box";
import { Button } from "./lib/elements/Button";
import { HStack } from "./lib/elements/HStack";
import { Title } from "./lib/elements/Title";
import { VStack } from "./lib/elements/VStack";
import render from "./lib/renderer";
import { state } from "./lib/state";
import "./style.css";
import { App } from "./todoapp";

const myState = state({ counter: 0 });

const app = VStack()
  .child(Title(() => `Count: ${myState.counter}`, 1, myState))
  .child(Title(() => `Another count: ${myState.counter * 2}`, 1, myState))
  .child(Box(myState).child(() => (myState.counter % 2 === 0 ? "Test" : null)))
  .child(
    HStack()
      .child(
        Button("+", () => (myState.counter += 1000)).styles({
          backgroundColor: "green",
        })
      )
      .child(
        Button("-", () => {
          if (myState.counter > 0) {
            myState.counter -= 1000;
          }
        }).styles({ backgroundColor: "red" })
      )
  )
  .child(
    Box(myState)
      .styles(() => ({
        width: "100px",
        height: "100px",
        backgroundColor:
          Number(myState.counter.toString().split("")[0]) % 2 === 0
            ? "green"
            : "red",
        margin: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }))
      .child(() => `${myState.counter}`)
  );

render(document.getElementById("app")!, App());
