import { Renderer } from "./renderer";
import { IS_STATE_KEY, StateValue } from "./state";

export type ElementNodePropery<T> = (() => T) | T;

export type ChildLoop<T> = {
  array: ElementNodePropery<T[]>;
  callback: (value: T, index: number) => Child;
};

export type Child =
  | ElementNode
  | ChildLoop<any>
  | string
  | number
  | boolean
  | null
  | undefined;
export type Children = Child[];

export type InternalChild = ElementNodePropery<Child>;
export type InternalChildren = InternalChild[];

export type ElementListener<K extends keyof HTMLElementEventMap> = {
  callback: (event: HTMLElementEventMap[K]) => void;
  options?: boolean | AddEventListenerOptions;
};

export type ElementNodeStyles = ElementNodePropery<
  Partial<CSSStyleDeclaration>
>;
export type ElementNodeListeners = Record<string, ElementListener<any>>;

export type ElementNodeAttributes = Record<string, string>;

let globalNodeId = 0;

export const IS_CHILD_LOOP_KEY = Symbol("_isChildLoop");

export type ElementNodeData = ReturnType<ElementNode["_getNode"]>;

export class ElementNode<
  N extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap,
  S extends StateValue = StateValue
> {
  private readonly nodeId: number;

  private readonly tag: N;
  private readonly _children: InternalChildren = [];

  private style: ElementNodeStyles = {};
  private readonly listeners: ElementNodeListeners = {};
  private readonly attributes: ElementNodeAttributes = {};

  private readonly renderer: Renderer;

  constructor(tag: N, state?: S) {
    if (state && !state[IS_STATE_KEY]) {
      throw new Error("Please provide a valid state");
    }

    this.tag = tag;

    this.nodeId = globalNodeId;

    this.renderer = new Renderer(this, state);

    globalNodeId++;
  }

  listen<
    K extends keyof HTMLElementEventMap,
    EL extends ElementListener<K> = ElementListener<K>
  >(event: K, callback: EL["callback"], options?: EL["options"]) {
    this.listeners[event] = { callback, options };

    return this;
  }

  attribute(key: string, value: string) {
    this.attributes[key] = value;

    return this;
  }

  styles(styles: ElementNodeStyles) {
    if (typeof styles === "function") {
      this.style = styles;
      return this;
    }

    this.style = {};

    for (const key in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, key)) {
        const property = styles[key];
        this.style[key] = property!;
      }
    }

    return this;
  }

  child(child: InternalChild) {
    this._children.push(child);
    return this;
  }

  forEachChild<T>(
    array: ElementNodePropery<T[]>,
    callback: (value: T, index: number) => Child
  ) {
    const childLoop: ChildLoop<T> = {
      array,
      callback,
    };

    Object.defineProperty(childLoop, IS_CHILD_LOOP_KEY, {
      configurable: false,
      writable: false,
      enumerable: false,
      value: true,
    });

    this._children.push(childLoop);

    return this;
  }

  _getNode() {
    const { tag, nodeId, style, attributes, listeners } = this;

    return {
      tag,
      nodeId,
      style,
      attributes,
      listeners,
      children: this._children,
    };
  }

  _getRenderer() {
    return this.renderer;
  }
}

export function Element<
  N extends keyof HTMLElementTagNameMap,
  S extends StateValue
>(tag: N, state?: S) {
  return new ElementNode(tag, state);
}
