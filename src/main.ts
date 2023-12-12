import { Element } from "./lib/Element";
import render from "./lib/renderer";
import { state } from "./lib/state";
import "./style.css";

const myState = state({ counter: 0 });

const app = Element("div")
  .child(Element("h1", myState).child(() => `Count: ${myState.counter}`))
  .child(
    Element("h1", myState).child(() => `Another count: ${myState.counter * 2}`)
  )
  .child(
    Element("div")
      .child(
        Element("button")
          .child("+")
          .listen("click", () => myState.counter++)
          .styles({ backgroundColor: "green" })
      )
      .child(
        Element("button")
          .child("-")
          .listen("click", () => {
            if (myState.counter > 0) {
              myState.counter--;
            }
          })
          .styles({ backgroundColor: "red" })
      )
  )
  .child(
    Element("ul", myState).forEachChild(
      Array.from({ length: 10000 }).fill("Item") as string[],
      (item, index) => Element("li").child(`${item}: ${index + 1}`)
    )
  );

render(document.getElementById("app")!, app);
