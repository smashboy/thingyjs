import * as CSS from "csstype";
import { StateValue } from "../state";
import { ElementNode, NodeReactivePropery } from "./Element";
import { createNodeFunction } from "../utils";

export class TextNode<S extends StateValue = StateValue> extends ElementNode<
  "div",
  S
> {
  constructor(text: NodeReactivePropery<string>, state?: S) {
    super("div", state);

    this.child(text);
  }

  size(size: NodeReactivePropery<CSS.Property.FontSize>) {
    if (typeof size === "function") {
      this.styles(() => ({
        fontSize: size(),
      }));
    } else {
      this.styles({
        fontSize: size,
      });
    }

    return this;
  }

  weight(weight: CSS.Property.FontWeight) {
    this.styles({ fontWeight: weight });

    return this;
  }

  italic() {
    return this;
  }

  truncate() {
    return this;
  }
}

// @ts-ignore
export const Text = createNodeFunction<typeof TextNode, TextNode>(TextNode);
