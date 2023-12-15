import { Button } from "./lib/elements/Button";
import { Element } from "./lib/elements/Element";
import render from "./lib/renderer";
import { state } from "./lib/state";
import "./style.css";
import { App } from "./todoapp";

const myState = state({ counter: 0 });

const app = Element("div")
  .child(Element("h1", myState).child(() => `Count: ${myState.counter}`))
  .child(
    Element("h1", myState).child(() => `Another count: ${myState.counter * 2}`)
  )
  .child(
    Element("div", myState).child(() =>
      myState.counter % 2 === 0 ? "Test" : null
    )
  )
  .child(
    Element("div")
      .child(
        Button(() => (myState.counter += 1000))
          .child("+")
          .styles({ backgroundColor: "green" })
      )
      .child(
        Button(() => {
          if (myState.counter > 0) {
            myState.counter -= 1000;
          }
        })
          .child("-")
          .styles({ backgroundColor: "red" })
      )
  )
  .child(
    Element("span", myState)
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
  )
  .child(
    Element("ul", myState)
      // .forEachChild(
      //   () => Array.from({ length: myState.counter }).fill("Item") as string[],
      //   (item, index) =>
      //     Element("li")
      //       .styles({ backgroundColor: index % 2 === 0 ? "green" : "red" })
      //       .child(`${item}: ${index + 1}`)
      // )
      .forEachChild(
        () => Array.from({ length: myState.counter }).fill("Item") as string[],
        (item, index) =>
          Element("li")
            .styles({ backgroundColor: index % 2 === 0 ? "green" : "red" })
            .child(`${item}: ${index + 1}`)
      )
      .child(Element("li", myState).child(() => `Total: ${myState.counter}`))
      .child(
        Element("li", myState).child(
          () => `Yet another total: ${myState.counter}`
        )
      )
  );

render(document.getElementById("app")!, app);
