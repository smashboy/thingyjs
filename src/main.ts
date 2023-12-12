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
    Element("span", myState)
      .styles(() => ({
        width: "100px",
        height: "100px",
        backgroundColor: myState.counter % 2 === 0 ? "green" : "red",
        margin: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }))
      .child(() => `${myState.counter}`)
  )
  // .child(
  //   Element("ul", myState).forEachChild(
  //     () => Array.from({ length: myState.counter }).fill("Item") as string[],
  //     (item, index) => Element("li").child(`${item}: ${index + 1}`)
  //   )
  // )
  .child(
    Element("ul", myState).forEachChild(
      () => Array.from({ length: myState.counter }).fill("Item") as string[],
      (item, index) =>
        Element("li")
          .styles({ backgroundColor: index % 2 === 0 ? "green" : "red" })
          .child(`${item}: ${index + 1}`)
    )
  );

render(document.getElementById("app")!, app);
