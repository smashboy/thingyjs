import { StateValue } from "../state";
import { ElementNode, NodeReactivePropery } from "./Element";
import { createNodeFunction } from "../utils";

export class TitleNode<
  S extends StateValue = StateValue,
  L = 1 | 2 | 3 | 4 | 5 | 6
> extends ElementNode<"h1", S> {
  constructor(text: NodeReactivePropery<string>, level: L = 1, state?: S) {
    // @ts-ignore
    super(`h${level}`, state);

    this.child(text);
  }
}

// @ts-ignore
export const Title = createNodeFunction<typeof TitleNode, TitleNode>(TitleNode);
