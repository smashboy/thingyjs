import {
  Child,
  ChildLoop,
  ElementNode,
  ElementNodeData,
  ReactiveChild,
} from "./Element";
import { STATE_BIND_KEY, StateValue } from "./state";
import { unwrap } from "./utils";

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
      this.stateRef[STATE_BIND_KEY](
        this.nodeRef._getNode().nodeId,
        this.onStateUpdate
      );
    }
  }

  private onStateUpdate() {
    this.updateHTMLElement();
  }

  private updateHTMLElement() {
    this.element = patchTree(this.element(), this.nodeRef);
  }

  _getElement() {
    return this.element();
  }

  _initRender() {
    this.element = createHTMLElement(this.nodeRef._getNode());
    return this.element();
  }
}

export default function render(root: HTMLElement, app: ElementNode) {
  if (!root) {
    throw new Error("Please provide a valid entry for your application");
  }

  root.appendChild(app._getRenderer()._initRender());
}

interface CreateHTMLOptions {
  resetListeners?: boolean;
  resetAttributes?: boolean;
  withoutListeners?: boolean;
  withoutChildren?: boolean;
}

function createHTMLElement(node: ElementNodeData, options?: CreateHTMLOptions) {
  const element = document.createElement(node.tag);

  appendNodeData(element, node, options);

  return () => element;
}

function appendNodeData(
  element: HTMLElement,
  node: ElementNodeData,
  options?: CreateHTMLOptions
) {
  const {
    resetListeners = false,
    withoutListeners = false,
    withoutChildren = false,
    resetAttributes = false,
  } = options || {};

  if (resetAttributes) {
    _resetAttributes(element);
  }

  appendAttributes(element, node);
  appendStyles(element, node);

  if (resetListeners) {
    clearListeners(element, node);
  }

  if (!withoutListeners) {
    initListeners(element, node);
  }

  if (!withoutChildren) {
    appendChildren(element, node);
  }
}

function initListeners(element: HTMLElement, node: ElementNodeData) {
  for (const key in node.listeners) {
    if (Object.prototype.hasOwnProperty.call(node.listeners, key)) {
      const listener = node.listeners[key];
      element.addEventListener(key, listener.callback, listener.options);
    }
  }
}

function clearListeners(element: HTMLElement, node: ElementNodeData) {
  for (const key in node.listeners) {
    if (Object.prototype.hasOwnProperty.call(node.listeners, key)) {
      const listener = node.listeners[key];
      element.removeEventListener(key, listener.callback, listener.options);
    }
  }
}

function appendStyles(element: HTMLElement, node: ElementNodeData) {
  const styles = unwrap(node.style);

  for (const key in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, key)) {
      const property = styles[key];
      element.style[key] = property!;
    }
  }
}

function appendAttributes(element: HTMLElement, node: ElementNodeData) {
  for (const key in node.attributes) {
    if (Object.prototype.hasOwnProperty.call(node.attributes, key)) {
      const value = node.attributes[key];
      element.setAttribute(key, value!);
    }
  }
}

function _resetAttributes(element: HTMLElement) {
  for (const attr of element.attributes) {
    element.removeAttribute(attr.name);
  }
}

function appendChild(element: HTMLElement, child: ReactiveChild) {
  if (child === null || child === undefined) return;

  child = unwrap(child);

  // @ts-ignore
  if (ElementNode.isChildLoop(child)) {
    let { array, callback } = child as ChildLoop<any>;

    array = unwrap(array);

    for (let index = 0; index < array.length; index++) {
      const item = array[index];

      appendChild(element, callback(item, index, array));
    }

    return;
  }

  if (ElementNode.is(child)) {
    element.appendChild(child._getRenderer()._initRender());
    return;
  }

  element.appendChild(document.createTextNode(`${child}`));
}

function appendChildren(element: HTMLElement, node: ElementNodeData) {
  for (const key in node.children) {
    if (Object.prototype.hasOwnProperty.call(node.children, key)) {
      appendChild(element, node.children[key]);
    }
  }
}

function patchTree(prev: Element | ChildNode, node: ElementNode | Child) {
  const u = unwrap(node);

  if (!ElementNode.is(u)) {
    const newClone = document.createTextNode(`${node}`);

    if (!prev.isEqualNode(newClone)) {
      prev.replaceWith(newClone);
    }
  }

  if (ElementNode.is(u)) {
    const prevCloneWithoutChildren = prev.cloneNode(false);
    const data = u._getNode();

    const newCloneWithoutChildren = createHTMLElement(data, {
      withoutChildren: true,
      withoutListeners: true,
    })();

    if (!prevCloneWithoutChildren.isEqualNode(newCloneWithoutChildren)) {
      if (prev.nodeName === newCloneWithoutChildren.nodeName) {
        appendNodeData(prev as HTMLElement, data, {
          resetListeners: true,
          resetAttributes: true,
          withoutChildren: true,
        });
      }

      const newClone = createHTMLElement(data)();

      prev.replaceWith(newClone);

      return () => newClone;
    }

    let newChildCount = 0;

    for (let i = 0; i < data.children.length; i++) {
      const child = unwrap(data.children[i]);

      if (ElementNode.isChildLoop(child)) {
        let { array, callback } = child;

        array = unwrap(array);

        for (let j = 0; j < array.length; j++) {
          newChildCount++;
          const child = callback(array[j], j, array);
          const prevHTMLChild = prev.childNodes[i + j];

          if (prevHTMLChild) {
            patchTree(prevHTMLChild, child);
            continue;
          }

          appendChild(prev, child);
        }

        continue;
      }

      newChildCount++;

      const prevHTMLChild = prev.childNodes[newChildCount - 1];

      if (prevHTMLChild) {
        patchTree(prevHTMLChild, child);
        continue;
      }

      appendChild(prev, child);
    }

    if (prev.childNodes.length > newChildCount) {
      const start = prev.childNodes.length;
      for (let index = start; index > newChildCount - 1; index--) {
        prev.childNodes[index]?.remove();
      }
    }
  }

  return () => prev;
}

// if (!prevCloneWithoutChildren.isEqualNode(newCloneWithoutChildren)) {
//   const prevCloneWithChildren = prev.cloneNode(true);

//   for (const node of prevCloneWithChildren.childNodes) {
//     newCloneWithoutChildren.appendChild(node.cloneNode(true));
//   }

//   prev.replaceWith(newCloneWithoutChildren);
//   // @ts-ignore
//   prev = newCloneWithoutChildren;
// }

// if (prev.childNodes.length > updated.childNodes.length) {
//   const start = prev.childNodes.length;
//   const end = updated.childNodes.length;

//   for (let index = start; index > end - 1; index--) {
//     prev.childNodes[index]?.remove();
//   }
// }

// const end = updated.childNodes.length;

// for (let index = 0; index < end; index++) {
//   const nodeChild = ElementNode.is(u) ? n.children[index] : void 0;
//   const newChild = updated.childNodes[index];
//   const prevChild = prev.childNodes[index];

//   if (nodeChild && ElementNode.isChildLoop(nodeChild)) {
//     console.log(unwrap(nodeChild.array)[index]);
//     continue;
//   }

//   if (prevChild) {
//     console.log(nodeChild);
//     this.patchTree(prevChild, newChild, nodeChild);
//     continue;
//   }

//   console.log({ nodeChild, newChild });

//   prev.appendChild(newChild.cloneNode(true));
// }
