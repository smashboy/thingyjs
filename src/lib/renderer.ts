import { ElementNode, ElementNodeData } from "./Element";

const HTML_ELEMENT_NODE_ID_ATTRIBUTE_KEY = "data-thingyjsid";

const nodesIdsList = new Set<number>();
const newNodesIdsList = new Set<number>();

let appRootHTML: HTMLElement;
let appRoot: ElementNode<any, any>;

export function render(root: HTMLElement, app: ElementNode<any, any>) {
  if (!root) {
    throw new Error("Please provide a valid entry for your application");
  }

  appRootHTML = root;
  appRoot = app;

  root.appendChild(createHTMLElement(app));
}

function createHTMLElement(node: ElementNode<any, any>) {
  const data = node._getNode();

  const element = document.createElement(data.tag);

  appendAttributes(element, data);
  appendStyles(element, data);

  createNodeIdAttribute(element, data);

  initListeners(element, data);
  appendChildren(element, data);

  return element;
}

export function updateDOM(nodeIds2Update: Set<number>) {
  newNodesIdsList.clear();

  const nodes2Update = getElementNodesMapFromSet(nodeIds2Update, appRoot);

  for (const nodeId of nodeIds2Update) {
    const element = getHTMLElementByNodeId(nodeId);
    const node = nodes2Update.get(nodeId);

    if (!node || !element) continue;

    updateHTMLElement(element as HTMLElement, node);
  }
}

function updateHTMLElement(
  prevElement: HTMLElement,
  node: ElementNode<any, any>
) {
  prevElement.replaceWith(createHTMLElement(node));
}

function removeHTMLElement() {}

function appendChildren(parent: HTMLElement, node: ElementNodeData) {
  for (let child of node.children) {
    child = typeof child === "function" ? child() : child;

    if (child === null || child === undefined) continue;

    if (child instanceof ElementNode) {
      parent.appendChild(createHTMLElement(child));
      continue;
    }

    parent.appendChild(document.createTextNode(`${child}`));
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

function appendStyles(element: HTMLElement, node: ElementNodeData) {
  for (const key in node.style) {
    if (Object.prototype.hasOwnProperty.call(node.style, key)) {
      const property = node.style[key];
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

function clearListeners(element: HTMLElement, node: ElementNodeData) {
  for (const key in node.listeners) {
    if (Object.prototype.hasOwnProperty.call(node.listeners, key)) {
      const listener = node.listeners[key];
      element.removeEventListener(key, listener.callback, listener.options);
    }
  }
}

function createNodeIdAttribute(element: HTMLElement, node: ElementNodeData) {
  nodesIdsList.add(node.nodeId);

  element.setAttribute(
    HTML_ELEMENT_NODE_ID_ATTRIBUTE_KEY,
    node.nodeId.toString()
  );
}

function getElementNodesMapFromSet(
  nodeIds: Set<number>,
  node: ElementNode<any, any>
) {
  const nodes = new Map<number, ElementNode<any, any>>();

  const data = node._getNode();

  if (nodeIds.has(data.nodeId)) {
    nodes.set(data.nodeId, node);
  }

  for (let child of data.children) {
    child = typeof child === "function" ? child() : child;

    if (child instanceof ElementNode) {
      const childNodes = getElementNodesMapFromSet(nodeIds, child);

      for (const [id, node] of childNodes.entries()) {
        nodes.set(id, node);
      }
    }
  }

  return nodes;
}

function getHTMLElementByNodeId(nodeId: number) {
  return appRootHTML.querySelector(
    `[${HTML_ELEMENT_NODE_ID_ATTRIBUTE_KEY}="${nodeId}"]`
  );
}
