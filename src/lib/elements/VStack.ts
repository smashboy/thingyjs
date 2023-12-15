import { StateValue } from "../state";
import { createNodeFunction } from "../utils";
import { FlexNode } from "./Flex";

export class VStackNode<S extends StateValue = StateValue> extends FlexNode<S> {
  constructor(state?: S) {
    super(state);

    this.direction("column");
    this.justify("center");
    this.align("stretch");
  }
}

export const VStack = createNodeFunction<typeof VStackNode, VStackNode>(
  // @ts-ignore
  VStackNode
);
