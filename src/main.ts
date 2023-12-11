import { Element } from "./lib/Element";
import { render } from "./lib/renderer";
import { state } from "./lib/state";
import "./style.css";

const myState = state({ counter: 0 });

const app = Element("div")
  .appendChild(
    Element("h1", myState).appendChild(() => `Count: ${myState.counter}`)
  )
  .appendChild(
    Element("h1", myState).appendChild(
      () => `Another count: ${myState.counter * 2}`
    )
  )
  .appendChild(
    Element("div")
      .appendChild(
        Element("button")
          .appendChild("+")
          .listen("click", () => myState.counter++)
          .styles({ backgroundColor: "green" })
      )
      .appendChild(
        Element("button")
          .appendChild("-")
          .listen("click", () => {
            if (myState.counter > 0) {
              myState.counter--;
            }
          })
          .styles({ backgroundColor: "red" })
      )
  );

// TODO: rework .appendChild(E()) to .children((append) => ...)

render(document.getElementById("app")!, app);
