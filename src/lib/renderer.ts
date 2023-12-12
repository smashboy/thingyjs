import {
  ChildLoop,
  ElementNode,
  IS_CHILD_LOOP_KEY,
  InternalChild,
} from "./Element";
import { STATE_BIND_KEY, StateValue } from "./state";

export class Renderer {
  private element!: () => HTMLElement;
  private nodeRef: ElementNode;
  private readonly stateRef: StateValue | void = void 0;

  constructor(node: ElementNode, state?: StateValue) {
    this.nodeRef = node;
    this.stateRef = state;

    this.onStateUpdate = this.onStateUpdate.bind(this);

    this.bindState();
  }

  private bindState() {
    if (this.stateRef) {
      this.stateRef[STATE_BIND_KEY](this.nodeData.nodeId, this.onStateUpdate);
    }
  }

  private onStateUpdate() {
    this.updateHTMLElement();
  }

  private createHTMLElement() {
    const element = document.createElement(this.nodeData.tag);

    this.appendNodeData(element);

    return () => element;
  }

  private updateHTMLElement() {
    const newElement = this.createHTMLElement();

    this.element = this.patchTree(this.element(), newElement());
  }

  private patchTree(prev: Element | ChildNode, updated: Element | ChildNode) {
    const prevCloneWithoutChildren = prev.cloneNode(false);
    const newCloneWithoutChildren = updated.cloneNode(false);

    if (!prevCloneWithoutChildren.isEqualNode(newCloneWithoutChildren)) {
      const prevCloneWithChildren = prev.cloneNode(true);

      for (const node of prevCloneWithChildren.childNodes) {
        newCloneWithoutChildren.appendChild(node.cloneNode(true));
      }

      prev.replaceWith(newCloneWithoutChildren);
      // @ts-ignore
      prev = newCloneWithoutChildren;
    }

    if (prev.childNodes.length > updated.childNodes.length) {
      const start = prev.childNodes.length;
      const end = updated.childNodes.length;

      for (let index = start; index > end - 1; index--) {
        prev.childNodes[index]?.remove();
      }
    }

    const end = updated.childNodes.length;

    for (let index = 0; index < end; index++) {
      const newChild = updated.childNodes[index];
      const prevChild = prev.childNodes[index];

      if (prevChild) {
        this.patchTree(prevChild, newChild);
        continue;
      }

      prev.appendChild(newChild.cloneNode(true));
    }

    return () => prev;
  }

  get nodeData() {
    return this.nodeRef._getNode();
  }

  private appendNodeData(
    element: HTMLElement,
    resetListeners: boolean = false
  ) {
    this.appendAttributes(element);
    this.appendStyles(element);

    if (resetListeners) {
      this.clearListeners(element);
    }

    this.initListeners(element);
    this.appendChildren(element);
  }

  private initListeners(element: HTMLElement) {
    for (const key in this.nodeData.listeners) {
      if (Object.prototype.hasOwnProperty.call(this.nodeData.listeners, key)) {
        const listener = this.nodeData.listeners[key];
        element.addEventListener(key, listener.callback, listener.options);
      }
    }
  }

  private clearListeners(element: HTMLElement) {
    for (const key in this.nodeData.listeners) {
      if (Object.prototype.hasOwnProperty.call(this.nodeData.listeners, key)) {
        const listener = this.nodeData.listeners[key];
        element.removeEventListener(key, listener.callback, listener.options);
      }
    }
  }

  private appendStyles(element: HTMLElement) {
    let styles = this.nodeData.style;
    typeof this.nodeData.style === "function";

    if (typeof this.nodeData.style === "function") {
      styles = this.nodeData.style();
    }

    for (const key in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, key)) {
        const property = styles[key];
        element.style[key] = property!;
      }
    }
  }

  private appendAttributes(element: HTMLElement) {
    for (const key in this.nodeData.attributes) {
      if (Object.prototype.hasOwnProperty.call(this.nodeData.attributes, key)) {
        const value = this.nodeData.attributes[key];
        element.setAttribute(key, value!);
      }
    }
  }

  private appendChild(element: HTMLElement, child: InternalChild) {
    if (child === null || child === undefined) return;

    if (typeof child === "function") {
      child = child();
    }

    // @ts-ignore
    if (typeof child === "object" && child[IS_CHILD_LOOP_KEY]) {
      let { array, callback } = child as ChildLoop<any>;

      if (typeof array === "function") {
        array = array();
      }

      for (let index = 0; index < array.length; index++) {
        const item = array[index];

        this.appendChild(element, callback(item, index));
      }

      return;
    }

    if (child instanceof ElementNode) {
      element.appendChild(child._getRenderer()._initRender());
      return;
    }

    element.appendChild(document.createTextNode(`${child}`));
  }

  private appendChildren(element: HTMLElement) {
    for (const key in this.nodeData.children) {
      if (Object.prototype.hasOwnProperty.call(this.nodeData.children, key)) {
        this.appendChild(element, this.nodeData.children[key]);
      }
    }
  }

  _getElement() {
    return this.element;
  }

  _initRender() {
    this.element = this.createHTMLElement();
    return this.element();
  }
}

export default function render(root: HTMLElement, app: ElementNode) {
  if (!root) {
    throw new Error("Please provide a valid entry for your application");
  }

  root.appendChild(app._getRenderer()._initRender());
}
