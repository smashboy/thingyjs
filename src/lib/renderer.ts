import {
  ChildLoop,
  ElementNode,
  IS_CHILD_LOOP_KEY,
  InternalChild,
} from "./Element";
import { STATE_BIND_KEY, StateValue } from "./state";

export class Renderer {
  private element!: HTMLElement;
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

    return element;
  }

  private updateHTMLElement() {
    const newElement = this.createHTMLElement();

    this.patchTree(this.element, newElement);
  }

  // private updateReactiveNodes() {
  //   transfer(this.newReactiveNodes, this.prevReactiveNodes);
  // }

  private patchTree(prev: Element | ChildNode, updated: Element | ChildNode) {
    const prevCloneWithoutChildren = prev.cloneNode(false);
    const newCloneWithoutChildren = updated.cloneNode(false);

    if (!prevCloneWithoutChildren.isEqualNode(newCloneWithoutChildren)) {
      prev.replaceWith(newCloneWithoutChildren);
    }

    if (prev.childNodes.length > updated.childNodes.length) {
      for (
        let index = updated.childNodes.length - 1;
        index < prev.childNodes.length;
        index++
      ) {
        prev.childNodes[index]?.remove();
      }
    }

    for (let index = 0; index < updated.childNodes.length; index++) {
      const newChild = updated.childNodes[index];
      const prevChild = prev.childNodes[index];

      if (prevChild) {
        this.patchTree(prevChild, newChild);
        continue;
      }

      prev.appendChild(newChild);
    }
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
    for (const key in this.nodeData.style) {
      if (Object.prototype.hasOwnProperty.call(this.nodeData.style, key)) {
        const property = this.nodeData.style[key];
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
    return this.element;
  }
}

export default function render(root: HTMLElement, app: ElementNode) {
  if (!root) {
    throw new Error("Please provide a valid entry for your application");
  }

  root.appendChild(app._getRenderer()._initRender());
}
