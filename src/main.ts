import { Element } from "./lib/Element";
import { render } from "./lib/renderer";
import { state } from "./lib/state";
import "./style.css";

const myState = state({ counter: 0 });

const app = Element("div")
  .append(() =>
    Element("h1", myState).append(() => `Count: ${myState.counter}`)
  )
  .append(
    Element("div")
      .append(
        Element("button")
          .append(() => "+")
          .listen("click", () => myState.counter++)
          .styles({ backgroundColor: "green" })
      )
      .append(
        Element("button")
          .append(() => "-")
          .listen("click", () => {
            if (myState.counter > 0) {
              myState.counter--;
            }
          })
          .styles({ backgroundColor: "red" })
      )
  );

render(document.getElementById("app")!, app);
