import { StateValue } from "../state";
import { createNodeFunction } from "../utils";
import { FlexNode } from "./Flex";

export class VStackNode<S extends StateValue = StateValue> extends FlexNode<S> {
  constructor(state?: S) {
    super(state);
  }
}

// @ts-ignore
export const VStack = createNodeFunction<typeof VStack, VStack>(VStack);
