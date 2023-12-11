import { IS_STATE_KEY, STATE_BIND_KEY, StateValue } from "./state";

export type ElementNodePropery<T> = (() => T) | T;

export type Child =
  | ElementNode<any, any>
  | string
  | number
  | boolean
  | null
  | undefined;
export type Children = Child[];

type InternalChild = ElementNodePropery<Child>;
type InternalChildren = InternalChild[];

export type ElementListener<K extends keyof HTMLElementEventMap> = {
  callback: (event: HTMLElementEventMap[K]) => void;
  options?: boolean | AddEventListenerOptions;
};

export type ElementNodeStyles = Partial<CSSStyleDeclaration>;
export type ElementNodeListeners = Record<string, ElementListener<any>>;

export type ElementNodeAttributes = Record<string, string>;

let globalNodeId = 0;

export type ElementNodeData = ReturnType<ElementNode<any, any>["_getNode"]>;

export class ElementNode<
  N extends keyof HTMLElementTagNameMap,
  S extends StateValue
> {
  private readonly nodeId: number;
  private renderCount: number;

  private readonly tag: N;
  private readonly _children: InternalChildren = [];

  private readonly style: ElementNodeStyles = {};
  private readonly listeners: ElementNodeListeners = {};
  private readonly attributes: ElementNodeAttributes = {};

  private readonly state: S | void = void 0;
  private onStateUpdateExtenralCallback: (() => void) | void = void 0;

  constructor(tag: N, state?: S) {
    if (state && !state[IS_STATE_KEY]) {
      throw new Error("Please provide a valid state");
    }

    this.tag = tag;
    this.state = state;

    this.nodeId = globalNodeId;
    this.renderCount = 0;

    globalNodeId++;

    this.onStateUpdate = this.onStateUpdate.bind(this);

    this.initStateListener();
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
    for (const key in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, key)) {
        const property = styles[key];
        this.style[key] = property!;
      }
    }
    return this;
  }

  append(child: InternalChild) {
    this._children.push(child);
    return this;
  }

  private initStateListener() {
    if (this.state) {
      this.state[STATE_BIND_KEY](this.nodeId, this.onStateUpdate);
    }
  }

  private onStateUpdate() {
    if (this.onStateUpdateExtenralCallback) {
      this.renderCount++;
      this.onStateUpdateExtenralCallback();
    }
  }

  _getNodeAttributeId() {
    return `${this.nodeId}:${this.renderCount}`;
  }

  _init(onStateUpdateExtenralCallback: () => void) {
    this.onStateUpdateExtenralCallback = onStateUpdateExtenralCallback;

    return this._getNode();
  }

  _getNode() {
    const { tag, nodeId, renderCount, style, attributes, listeners } = this;

    return {
      tag,
      nodeId,
      renderCount,
      nodeAttributeId: this._getNodeAttributeId(),
      style,
      attributes,
      listeners,
      children: this._children,
    };
  }
}

export function Element<
  N extends keyof HTMLElementTagNameMap,
  S extends StateValue
>(tag: N, state?: S) {
  return new ElementNode(tag, state);
}
