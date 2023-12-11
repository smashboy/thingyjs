import { ElementNode, ElementNodeData } from "./Element";

const HTML_ELEMENT_NODE_ID_ATTRIBUTE_KEY = "data-thingyjsid";

const nodesIdsList = new Set<string>();
const newNodesIdsList = new Set<string>();

let appRootHTML: HTMLElement;
let appRoot: ElementNode<any, any>;

export function render(root: HTMLElement, app: ElementNode<any, any>) {
  if (!root) {
    throw new Error("Please provide a valid entry for your application");
  }

  appRootHTML = root;
  appRoot = appRoot;

  root.appendChild(createHTMLElement(app));
}

function createHTMLElement(node: ElementNode<any, any>) {
  const data = node._init(updateDOM);

  const element = document.createElement(data.tag);

  appendAttributes(element, data);
  appendStyles(element, data);

  createNodeIdAttribute(element, data);

  initListeners(element, data);
  appendChildren(element, data);

  return element;
}

function updateDOM() {
  newNodesIdsList.clear();
}

function updateHTMLElement() {}

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
  nodesIdsList.add(node.nodeAttributeId);

  element.setAttribute(
    HTML_ELEMENT_NODE_ID_ATTRIBUTE_KEY,
    node.nodeAttributeId
  );
}
