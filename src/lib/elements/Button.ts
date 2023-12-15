import { StateValue } from "../state";
import { createNodeFunction } from "../utils";
import { ElementNode } from "./Element";
import { TextNode } from "./Text";

export class ButtonNode<S extends StateValue = StateValue> extends ElementNode<
  "button",
  S
> {
  constructor(
    label: TextNode,
    onClick?: (event: HTMLElementEventMap["click"]) => void,
    state?: S
  ) {
    super("button", state);

    this.child(label);

    if (onClick) {
      this.listen("click", onClick);
    }
  }
}

export const Button = createNodeFunction<typeof ButtonNode, ButtonNode>(
  // @ts-ignore
  ButtonNode
);
