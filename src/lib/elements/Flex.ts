import * as CSS from "csstype";
import { StateValue } from "../state";
import { ElementNode, NodeReactivePropery } from "./Element";
import { createNodeFunction } from "../utils";

export class FlexNode<S extends StateValue = StateValue> extends ElementNode<
  "div",
  S
> {
  constructor(state?: S) {
    super("div", state);

    this.styles({
      display: "flex",
    });
  }

  justify(prop: NodeReactivePropery<CSS.Property.JustifyContent>) {
    return this;
  }

  align(prop: NodeReactivePropery<CSS.Property.AlignItems>) {
    return this;
  }

  direction(prop: NodeReactivePropery<CSS.Property.FlexDirection>) {
    return this;
  }

  wrap(prop: NodeReactivePropery<CSS.Property.FlexWrap>) {}

  gap(prop: NodeReactivePropery<CSS.Property.Gap>) {}
}

// @ts-ignore
export const Flex = createNodeFunction<typeof FlexNode, FlexNode>(FlexNode);
