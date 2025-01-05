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
 * Class representing a custom element with data bindings.
 */
export default {
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

  createDataProxy() {
    const self = this; // Capture the `this` context

    return new Proxy(
      {},
      {
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

  data: null,

  bindings: {},

  init() {
    this.data = this.createDataProxy();
  },

  // helper function to generate a unique id
  generateUniqueId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  },

  // helper function to convert camelCase to hyphenated format
  camelToHyphen(str) {
    return str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
  },

  setElementAttribute(element, key, value, listenerId, depth) {
    const listener = this.data[listenerId];

    if (
      key !== "children" &&
      key !== "prepend" &&
      key !== "append" &&
      key !== "child" &&
      key !== "tagName" &&
      key !== "textContent" &&
      key !== "innerHTML" &&
      key !== "if" &&
      key !== "style"
    ) {
      // clear out the attribute before we set it
      element.removeAttribute(key);

      // Check if the key contains any uppercase letters
      const hasUpperCase = /[A-Z]/.test(key);

      if (hasUpperCase) {
        element.setAttributeNS(null, key, value);
      } else {
        element.setAttribute(key, value);
      }
    } else if (key === "style") {
      let style = "";
      // for styles, we can accept either a string or an object
      if (typeof value === "string") {
        style = value;
      } else if (typeof value === "object") {
        for (let key in value) {
          // if the key already has a hyphen, then just use it, otherwise de-camlize it
          const property = key.includes("-") ? key : this.camelToHyphen(key);

          style = style + property + ":" + value[key] + ";";
        }
      }

      element.setAttribute("style", style);
    } else if (key === "innerHTML") {
      // clear out the innerHTML before we set it
      element.innerHTML = "";

      if (element[key] !== undefined && key === "innerHTML") {
        element[key] += value; // Append the new value to the existing HTML
      } else {
        element[key] = value; // Set the value directly
      }
    } else if (key === "prepend") {
      // check if this is an object, otherwise we
      // just need to add it as textContent
      if (typeof value !== "object") {
        element.prepend(document.createTextNode(value));
      } else {
        const childElement = this.render(
          value,
          data,
          null,
          listenerId,
          depth + 1
        );
        if (childElement !== null) {
          element.prepend(childElement);
        }
      }
    } else if (key === "children" || key === "child") {
      let children = key === "children" ? value : [value];

      // we need to clear out the element's children before we add new ones
      if (element.children.length > 0 || value === null) {
        this.clearChildren(element);

        // if the value is null, then we are just clearing out the children
        if (value === null) {
          return;
        }
      }

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        const childElement = this.render(
          child,
          listener,
          null,
          listenerId,
          depth + 1
        );

        if (childElement !== null) {
          element.appendChild(childElement);
        }
      }
    } else if (key === "textContent") {
      // clear out the textContent before we set it
      element.textContent = "";

      element.appendChild(document.createTextNode(value));
    } else if (key === "append") {
      // check if this is an object, otherwise we
      // just need to add it as textContent
      if (typeof value !== "object") {
        element.appendChild(document.createTextNode(value));
      } else {
        const childElement = this.render(
          value,
          data,
          null,
          listenerId,
          depth + 1
        );
        if (childElement !== null) {
          element.appendChild(childElement);
        }
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
   * @param {Object} [data=null] - The data to bind to the template.
   * @param {function} callback - The callback function to call after rendering.
   * @param {string} [listenerId=null] - The ID to bind the data to.
   * @param {number} [depth=0] - The depth of the rendering.
   * @returns {Proxy|null} The proxy object if data is not null, otherwise null.
   */
  render(template, callback, depth = 0) {
    if (template === null || template === undefined) {
      return null;
    }

    // start by creating the element
    let element;

    // check to see if the template has an "if" property, and check if it is true
    // or not - if not true, they we just don't render anything
    if (Object.keys(template).includes("if")) {
      // then check it if is false
      if (!template.if) {
        return null;
      }
    }

    // if this is just a string and not actually an object,
    // the we just need to return the text
    if (typeof template === "string") {
      element = document.createTextNode(template);
      return element;
    }

    // set the tagName
    let tagName = template.tagName !== undefined ? template.tagName : "div";

    const namespaces = {
      svg: "http://www.w3.org/2000/svg",
      math: "http://www.w3.org/1998/Math/MathML",
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/",
      // Default namespace for XHTML
      default: "http://www.w3.org/1999/xhtml",
    };

    const getNamespace = (tagName) => {
      if (tagName in namespaces) {
        return namespaces[tagName];
      }
      // Default to XHTML namespace
      return namespaces.default;
    };

    element = document.createElementNS(getNamespace(tagName), tagName);

    /**
     * Checks if a string represents a stringified function.
     *
     * @param {string} str - The string to check.
     * @returns {boolean} True if the string represents a function, false otherwise.
     */
    function isStringifiedFunction(str) {
      if (typeof str !== "string") {
        return false;
      }
      // Regular expression to check for function declaration or arrow function
      const functionPattern = /^\s*(function\s*\(|\(\s*[^\)]*\)\s*=>)/;
      return functionPattern.test(str);
    }

    /**
     * Converts a stringified function to a format that the Function constructor can understand.
     *
     * @param {string} str - The stringified function.
     * @returns {Function} The parsed function.
     */
    function parseStringifiedFunction(str) {
      if (isStringifiedFunction(str)) {
        // Wrap the arrow function in parentheses and return it
        return new Function(`return (${str})`)();
      }
      throw new Error("Invalid stringified function");
    }

    // go through every key/value pair that is
    // an html property
    for (var key in template) {
      let value = template[key];

      if (isStringifiedFunction(value)) {
        // convert it back to a function
        value = parseStringifiedFunction(value);
      }

      // check to see if the value is a function or a stringified function

      if (typeof value === "function") {
        // find the value of the parameter passed to the function
        const functStr = value.toString();
        const paramsStr = functStr.slice(
          functStr.indexOf("(") + 1,
          functStr.indexOf(")")
        );
        const paramsArray = paramsStr.split(",").map((param) => param.trim());
        const listenerId = paramsArray.length > 0 ? paramsArray[0] : null;

        // add the binding to the bindings object
        if (!isServer) {
          // create the bindings array if it doesn't exist
          if (!this.bindings[listenerId]) {
            this.bindings[listenerId] = [];
          }

          this.bindings[listenerId].push({
            element,
            func: value,
            property: key,
          });
        } else {
          // store it all to render server-side
          element.dataset.listenerId = listenerId;

          // Check if the key is camelCase and convert it to hyphenated format if necessary
          const isCamelCase = (str) => {
            return /[a-z][A-Z]/.test(str);
          };

          element.setAttribute(
            `data-bind-to-${isCamelCase(key) ? this.camelToHyphen(key) : key}`,
            value
          );
        }

        const result = value(this.data[listenerId], e, c);
        value = result;

        if (value !== null) {
          this.setElementAttribute(element, key, value, listenerId, depth);
        }
      } else {
        if (value !== null) {
          this.setElementAttribute(element, key, value, null, depth);
        }
      }
    }

    // if we have a callback, then we need to call it
    if (callback) {
      callback(element, data);
    }

    // if this is the root element, then we need to return the element differently
    // if we are on server or not
    if (isServer && depth === 0) {
      // if we are sending a full html document, then we need to append a copy of
      // this file as an inline tag before any other script tags at the end of the body
      if (element.tagName === "HTML") {
        // Create an inline script tag that dynamically imports the module
        const script = document.createElement("script");
        script.textContent = `
          const App = (await import("${
            process.env.NODE_ENV === "production"
              ? process.env.CDN_BASE_URL
              : ""
          }/dist/premmio/htmljs/html.js")).default;
          App.init();
          window.App = App;
        `;

        // pass the data along to the server, if there is any to pass along
        if (Object.keys(this.data).length > 0) {
          script.textContent += `
            const parsedData = JSON.parse('${JSON.stringify(this.data)}');
            Object.keys(parsedData).forEach(key => {
              App.data[key] = parsedData[key];
            });

            // we need to find all elements on screen with a data-listener-id attribute
            // and then set up the listeners for them
            const elements = document.querySelectorAll("[data-listener-id]");

            elements.forEach((element) => {
              const listenerId = element.getAttribute("data-listener-id");

              // create the bindings array if it doesn't exist
              if (!App.bindings[listenerId]) {
                App.bindings[listenerId] = [];
              }

              const hyphenToCamelCase = (str) => {
                return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              };
              
              Array.from(element.attributes).forEach((attr) => {
                if (attr.name.startsWith("data-bind-to-")) {
                  // Remove the "data-bind-to-" prefix to get the property name
                  let property = attr.name.slice("data-bind-to-".length);
              
                  // If the property name does not contain "data-", convert it to camelCase
                  if (!property.startsWith("data-")) {
                    property = hyphenToCamelCase(property);
                  }
              
                  try {
                    const func = new Function("return " + attr.value)();
                    if (typeof func === "function") {
                      App.bindings[listenerId].push({
                        element,
                        property,
                        func,
                      });
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

        // Append the script tag to the end of the body but before any other script tags that may be there
        const body = element.querySelector("body");
        const scripts = body.querySelectorAll("script");

        if (scripts.length > 0) {
          body.insertBefore(script, scripts[0]);
        } else {
          body.appendChild(script);
        }
      }

      // add the !DOCTYPE tag to the beginning of the document and return the string
      return `<!DOCTYPE html>${element.outerHTML}`;
    } else {
      // if we passed in data and are the surface, then we need to return the listener
      if (depth === 0) {
        // if no data and no callback, return element
        if (!data && !callback) {
          return element;
        } else {
          return listener;
        }
      } else {
        // otherwise, we need to return the element we just created
        return element;
      }
    }
  },

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
