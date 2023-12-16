import { StateValue } from "../state";
import { createNodeFunction } from "../utils";
import { ElementNode } from "./Element";

export class FormNode<S extends StateValue = StateValue> extends ElementNode<
  "form",
  S
> {
  constructor(onSubmit: (event: SubmitEvent) => void, state?: S) {
    super("form", state);

    this.listen("submit", (event: SubmitEvent) => {
      event.preventDefault();
      onSubmit(event);
    });
  }
}

export const Form = createNodeFunction<typeof FormNode, FormNode>(
  // @ts-ignore
  FormNode
);
