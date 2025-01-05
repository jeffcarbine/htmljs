// Import all the elements
import * as e from "./elements.html.js";

// check to see if ./components/components.js exists
import c from "../../components/components.js";

// Standard Library Imports
let document, fs;

const isServer = typeof window === "undefined";

if (isServer) {
  Promise.all([import("jsdom"), import("fs")])
    .then(([jsdom, fsModule]) => {
      const { JSDOM } = jsdom;
      const { window } = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
      document = window.document;
      fs = fsModule;
    })
    .catch((err) => {
      console.error("Failed to load modules:", err);
    });
} else {
  document = window.document;
}

export function Bind(callback) {
  callback();
}

/**
 * The main html.js object.
 */
export default {
  /**
   * Recursively merges properties of the source object into the target object.
   *
   * @param {Object} target - The target object to merge properties into.
   * @param {Object} source - The source object to merge properties from.
   * @returns {Object} The merged target object.
   */
  deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === "object") {
        if (!target[key] || typeof target[key] !== "object") {
          target[key] = {};
        }
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  },

  /**
   * Creates a Proxy for the data object to handle get and set operations.
   *
   * @returns {Proxy} The Proxy object for the data.
   */
  createDataProxy() {
    const self = this; // Capture the `this` context

    return new Proxy(
      {},
      {
        /**
         * Handles getting a value from the Proxy.
         *
         * @param {Object} target - The target object.
         * @param {string} listenerId - The key to get the value for.
         * @returns {*} The value of the specified key, or null if it does not exist.
         */
        get(target, listenerId) {
          // Split the listenerId into an array of keys
          const keys = listenerId.split(".");
          let current = target;

          // Traverse the target object to get the value
          for (let i = 0; i < keys.length; i++) {
            if (current[keys[i]] === undefined) {
              return null; // Return null if any part of the path does not exist
            }
            current = current[keys[i]]; // Move to the next level in the object hierarchy
          }

          return current; // Return the final value
        },

        /**
         * Handles setting a value in the Proxy.
         *
         * @param {Object} target - The target object.
         * @param {string} listenerId - The key to set the value for.
         * @param {*} value - The value to set.
         * @param {Proxy} receiver - The Proxy object.
         * @returns {boolean} True if the value was set successfully, false otherwise.
         */
        set(target, listenerId, value, receiver) {
          // create a copy of the listener
          let listener = { ...self.data[listenerId] };

          // merge the new value into the listener, only overwriting the values that are being updated
          listener = self.deepMerge(listener, value);

          // Use Reflect.set to perform the assignment and get the result
          const result = Reflect.set(target, listenerId, listener, receiver);

          // Get the bindings for this listenerId
          const bindings = self.bindings[listenerId]; // Use the captured `this` context

          // If there are bindings, loop through them and emit the binding
          if (bindings) {
            bindings.forEach((binding) => {
              self.emitBinding(listenerId, binding); // Use the captured `this` context
            });
          }

          // Return the result of the Reflect.set operation
          return result;
        },
      }
    );
  },

  /**
   * The data object for the template engine.
   */
  data: null,

  /**
   * The bindings object for the template engine.
   */
  bindings: {},

  /**
   * Initializes the template engine.
   * @returns {void}
   */
  init() {
    this.data = this.createDataProxy();
  },

  /**
   * Generates a unique ID.
   * @returns {string} The unique ID.
   */
  generateUniqueId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  },

  /**
   * Converts a camelCase string to a hyphenated string.
   * @param {string} str - The camelCase string to convert.
   * @returns {string} The hyphenated string.
   */
  camelToHyphen(str) {
    return str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
  },

  /**
   * Sets an attribute on an element.
   * @param {Element} element - The element to set the attribute on.
   * @param {string} key - The key of the attribute.
   * @param {string} value - The value of the attribute.
   * @param {string} listenerId - The ID of the listener.
   * @param {number} depth - The depth of the rendering.
   * @returns {void}
   */
  setElementAttribute(element, key, value, listenerId, depth) {
    const listener = this.data[listenerId];

    const nonAttributes = [
      "children",
      "prepend",
      "append",
      "child",
      "tagName",
      "textContent",
      "innerHTML",
      "if",
      "style",
    ];

    if (!nonAttributes.includes(key)) {
      this.setAttribute(element, key, value);
    } else if (key === "style") {
      this.setStyle(element, value);
    } else if (key === "innerHTML") {
      this.setInnerHTML(element, value);
    } else if (key === "prepend") {
      this.prependChild(element, value, listenerId, depth);
    } else if (key === "children" || key === "child") {
      this.setChildren(element, key, value, listener, listenerId, depth);
    } else if (key === "textContent") {
      this.setTextContent(element, value);
    } else if (key === "append") {
      this.appendChild(element, value, listenerId, depth);
    }
  },

  /**
   * Sets an attribute on an element.
   * @param {Element} element - The element to set the attribute on.
   * @param {string} key - The key of the attribute.
   * @param {string} value - The value of the attribute.
   * @returns {void}
   */
  setAttribute(element, key, value) {
    element.removeAttribute(key);
    const hasUpperCase = /[A-Z]/.test(key);
    if (hasUpperCase) {
      element.setAttributeNS(null, key, value);
    } else {
      element.setAttribute(key, value);
    }
  },

  /**
   * Sets the style of an element.
   * @param {Element} element - The element to set the style on.
   * @param {string|Object} value - The style to set.
   * @returns {void}
   */
  setStyle(element, value) {
    let style = "";
    if (typeof value === "string") {
      style = value;
    } else if (typeof value === "object") {
      for (let key in value) {
        const property = key.includes("-") ? key : this.camelToHyphen(key);
        style += `${property}:${value[key]};`;
      }
    }
    element.setAttribute("style", style);
  },

  /**
   * Sets the innerHTML of an element.
   * @param {Element} element - The element to set the inner HTML on.
   * @param {string} value - The inner HTML to set.
   * @returns {void}
   */
  setInnerHTML(element, value) {
    element.innerHTML = "";
    element.innerHTML = value;
  },

  /**
   * Prepends a child to an element.
   * @param {Element} element - The element to prepend the child to.
   * @param {string|Object} value - The value to prepend.
   * @param {number} depth - The depth of the rendering.
   * @returns {void}
   */
  prependChild(element, value, depth) {
    if (typeof value !== "object") {
      element.prepend(document.createTextNode(value));
    } else {
      const childElement = this.render(value, null, depth + 1);
      if (childElement !== null) {
        element.prepend(childElement);
      }
    }
  },

  /**
   * Sets the children of an element.
   * @param {Element} element - The element to set the children on.
   * @param {string} key - The key of the children.
   * @param {Array} value - The value of the children.
   * @param {number} depth - The depth of the rendering.
   */
  setChildren(element, key, value, depth) {
    const children = key === "children" ? value : [value];
    if (element.children.length > 0 || value === null) {
      this.clearChildren(element);
      if (value === null) return;
    }
    children.forEach((child) => {
      const childElement = this.render(child, null, depth + 1);
      if (childElement !== null) {
        element.appendChild(childElement);
      }
    });
  },

  /**
   * Sets the text content of an element.
   * @param {Element} element - The element to set the text content on.
   * @param {string} value - The value of the text content.
   * @returns {void}
   */
  setTextContent(element, value) {
    element.textContent = "";
    element.appendChild(document.createTextNode(value));
  },

  /**
   * Appends a child
   * @param {Element} element - The element to append the child to.
   * @param {string|Object} value - The value to append.
   * @param {number} depth - The depth of the rendering.
   * @returns {void}
   */
  appendChild(element, value, depth) {
    if (typeof value !== "object") {
      element.appendChild(document.createTextNode(value));
    } else {
      const childElement = this.render(value, null, depth + 1);
      if (childElement !== null) {
        element.appendChild(childElement);
      }
    }
  },

  /**
   * Reviews the binding and emits the value.
   * @param {string} binding the binding to review
   * @param {Object} data the data object the value is coming from
   */
  emitBinding(listenerId, binding) {
    const { element, func, property } = binding;

    let value;

    // for server-side binding, the func will be a string so we
    // will need to parse it
    if (typeof func === "string") {
      const newFunc = new Function("data", `return ${func}`)(this.data);
      value = newFunc(this.data[listenerId], e, c);
    } else {
      value = func(this.data[listenerId], e, c);
    }

    this.setElementAttribute(element, property, value, listenerId, 0);
  },

  /**
   * Renders the template into HTML.
   *
   * @param {Object} template - The JSON object representing the template.
   * @param {function|string} [callbackOrQuery] - The callback function to call after rendering or a query for an element to append the new element to.
   * @param {number} [depth=0] - The depth of the rendering.
   * @returns {String|Element|null} The HTML string of the element, an Element object, or null if there is a callbackOrQuery parameter
   */
  render(template, callbackOrQuery, depth = 0) {
    if (!template) {
      return null;
    }

    // Check if the template has an "if" property and if it's false, return null
    if (template.if === false) {
      return null;
    }

    // If the template is a string, return a text node
    if (typeof template === "string") {
      return document.createTextNode(template);
    }

    // Create the element
    const tagName = template.tagName || "div";
    const element = document.createElementNS(
      this.getNamespace(tagName),
      tagName
    );

    // Process each key/value pair in the template
    Object.keys(template).forEach((key) => {
      let value = template[key];

      if (this.isStringifiedFunction(value)) {
        value = this.parseStringifiedFunction(value);
      }

      if (typeof value === "function") {
        this.processFunctionValue(element, key, value, depth);
      } else if (value !== null) {
        this.setElementAttribute(element, key, value, null, depth);
      }
    });

    // Handle server-side rendering
    if (isServer && depth === 0) {
      return this.handleServerSideRendering(element);
    } else {
      if (callbackOrQuery) {
        if (typeof callbackOrQuery === "function") {
          callbackOrQuery(element);
        } else {
          document.querySelector(callbackOrQuery).appendChild(element);
        }
      } else {
        return element;
      }
    }
  },

  /**
   * Gets the namespace for the specified tag name.
   * @param {string} tagName - The tag name to get the namespace for.
   * @returns {string} The namespace for the specified tag name.
   */
  getNamespace(tagName) {
    const namespaces = {
      svg: "http://www.w3.org/2000/svg",
      math: "http://www.w3.org/1998/Math/MathML",
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/",
      default: "http://www.w3.org/1999/xhtml",
    };
    return namespaces[tagName] || namespaces.default;
  },

  /**
   * Checks if the specified string is a stringified function.
   * @param {string} str - The string to check.
   * @returns {boolean} True if the string is a stringified function, false otherwise.
   */
  isStringifiedFunction(str) {
    if (typeof str !== "string") {
      return false;
    }
    const functionPattern = /^\s*(function\s*\(|\(\s*[^\)]*\)\s*=>)/;
    return functionPattern.test(str);
  },

  /**
   * Parses a stringified function into a function.
   * @param {string} str - The stringified function to parse.
   * @returns {Function} The parsed function.
   */
  parseStringifiedFunction(str) {
    if (this.isStringifiedFunction(str)) {
      return new Function(`return (${str})`)();
    }
    throw new Error("Invalid stringified function");
  },

  /**
   * Processes a function value in the template.
   * @param {Element} element - The element to process the function value for.
   * @param {string} key - The key of the function value.
   * @param {Function} value - The function value to process.
   * @param {number} depth - The depth of the rendering.
   * @returns {void}
   */
  processFunctionValue(element, key, value, depth) {
    const functStr = value.toString();
    const paramsStr = functStr.slice(
      functStr.indexOf("(") + 1,
      functStr.indexOf(")")
    );
    const paramsArray = paramsStr.split(",").map((param) => param.trim());
    const listenerId = paramsArray.length > 0 ? paramsArray[0] : null;

    if (!isServer) {
      if (!this.bindings[listenerId]) {
        this.bindings[listenerId] = [];
      }
      this.bindings[listenerId].push({ element, func: value, property: key });
    } else {
      element.dataset.listenerId = listenerId;
      const isCamelCase = (str) => /[a-z][A-Z]/.test(str);
      element.setAttribute(
        `data-bind-to-${isCamelCase(key) ? this.camelToHyphen(key) : key}`,
        value
      );
    }

    const result = value(this.data[listenerId], e, c);
    if (result !== null) {
      this.setElementAttribute(element, key, result, listenerId, depth);
    }
  },

  /**
   * Handles server-side rendering of the template.
   * @param {Element} element - The element to render.
   * @returns {string} The rendered HTML
   */
  handleServerSideRendering(element) {
    if (element.tagName === "HTML") {
      const script = document.createElement("script");
      script.textContent = `
        const App = (await import("${
          process.env.NODE_ENV === "production" ? process.env.CDN_BASE_URL : ""
        }/dist/premmio/htmljs/html.js")).default;
        App.init();
        window.App = App;
      `;

      if (Object.keys(this.data).length > 0) {
        script.textContent += `
          const parsedData = JSON.parse('${JSON.stringify(this.data)}');
          Object.keys(parsedData).forEach(key => {
            App.data[key] = parsedData[key];
          });
  
          const elements = document.querySelectorAll("[data-listener-id]");
          elements.forEach((element) => {
            const listenerId = element.getAttribute("data-listener-id");
            if (!App.bindings[listenerId]) {
              App.bindings[listenerId] = [];
            }
            const hyphenToCamelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            Array.from(element.attributes).forEach((attr) => {
              if (attr.name.startsWith("data-bind-to-")) {
                let property = attr.name.slice("data-bind-to-".length);
                if (!property.startsWith("data-")) {
                  property = hyphenToCamelCase(property);
                }
                try {
                  const func = new Function("return " + attr.value)();
                  if (typeof func === "function") {
                    App.bindings[listenerId].push({ element, property, func });
                  }
                } catch (e) {
                  // Ignore attributes that are not functions
                }
              }
            });
          });
        `;
      }

      script.setAttribute("type", "module");
      script.setAttribute("defer", true);

      const body = element.querySelector("body");
      const scripts = body.querySelectorAll("script");
      if (scripts.length > 0) {
        body.insertBefore(script, scripts[0]);
      } else {
        body.appendChild(script);
      }
    }

    return `<!DOCTYPE html>${element.outerHTML}`;
  },

  /**
   * Clears the children of an element.
   * @param {Element} element - The element to clear the children of.
   * @returns {void}
   */
  clearChildren(element) {
    // we need to check this.bindings for any reference to any of the children that are being removed
    // and remove their bindings
    // get all the children
    const children = element.childNodes,
      bindings = this.bindings;

    // the bindings contain a reference to the element in their element property,
    // so we just need to match that element to the element that is being removed
    Array.from(children).forEach((child) => {
      for (let key in bindings) {
        bindings[key] = bindings[key].filter((bind) => bind.element !== child);
      }

      // then delete the child
      element.removeChild(child);
    });
  },
};
