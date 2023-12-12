import {
  ChildLoop,
  ElementNode,
  IS_CHILD_LOOP_KEY,
  InternalChild,
} from "./Element";
import { STATE_BIND_KEY, StateValue } from "./state";

export class Renderer {
  private element!: HTMLElement;
  private nodeRef: ElementNode<any, any>;
  private readonly stateRef: StateValue | void = void 0;

  // private readonly prevReactiveNodes: Children = [];
  // private readonly newReactiveNodes: Children = [];

  constructor(node: ElementNode<any, any>, state?: StateValue) {
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

    this.appendAttributes(element);
    this.appendStyles(element);
    this.initListeners(element);
    this.appendChildren(element);

    // this.updateReactiveNodes();

    return element;
  }

  private updateHTMLElement() {
    const newElement = this.createHTMLElement();

    // TODO: deep diff
    if (this.element.isEqualNode(newElement)) return;

    this.element.replaceWith(newElement);
    this.element = newElement;

    // this.updateReactiveNodes();
  }

  // private updateReactiveNodes() {
  //   transfer(this.newReactiveNodes, this.prevReactiveNodes);
  // }

  get nodeData() {
    return this.nodeRef._getNode();
  }

  private initListeners(element: HTMLElement) {
    for (const key in this.nodeData.listeners) {
      if (Object.prototype.hasOwnProperty.call(this.nodeData.listeners, key)) {
        const listener = this.nodeData.listeners[key];
        element.addEventListener(key, listener.callback, listener.options);
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

export default function render(root: HTMLElement, app: ElementNode<any, any>) {
  if (!root) {
    throw new Error("Please provide a valid entry for your application");
  }

  root.appendChild(app._getRenderer()._initRender());
}
