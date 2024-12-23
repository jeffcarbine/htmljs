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
  // where we store the data that is bound to the elements
  data: {},

  // where we store the user info
  user: {},

  // helper function to generate a unique id
  generateUniqueId: () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  },

  // helper function to convert camelCase to hyphenated format
  camelToHyphen: (str) => {
    return str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
  },

  setElementAttribute: (element, key, value, data, bindId, depth) => {
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
        const childElement = this.render(value, data, null, bindId, depth + 1);
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

        const childElement = this.render(child, data, null, bindId, depth + 1);

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
        const childElement = this.render(value, data, null, bindId, depth + 1);
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
  emitBinding: (element, property, bindId, func) => {
    const data = this.data[bindId];
    let value;

    // for server-side binding, the func will be a string so we
    // will need to parse it
    if (typeof func === "string") {
      const newFunc = new Function("data", `return ${func}`)(data);
      value = newFunc(data, e, c);
    } else {
      value = func(data, e, c);
    }

    this.setElementAttribute(element, property, value, data, bindId, 0);
  },

  // where we store the different bindings for the different objects
  bindings: {},

  // where we store server data, if we have any
  serverData: null,

  /**
   * Creates a proxy object that will allow us to listen for changes.
   *
   * @param {Object} obj - The object to create a proxy for.
   * @param {function} callback - The callback function to call on changes.
   * @param {string} [path=""] - The path to the object.
   * @returns {Proxy} The proxy object.
   */
  createProxy: (obj, callback, path = "") => {
    const handler = {
      get: (target, prop, receiver) => {
        const value = Reflect.get(target, prop, receiver);
        // If the value is an object, create a proxy for it
        if (typeof value === "object" && value !== null) {
          return this.createProxy(
            value,
            callback,
            `${path}${path ? "." : ""}${prop}`
          );
        }
        return value;
      },
      set: (target, prop, value, receiver) => {
        const oldValue = target[prop];
        const result = Reflect.set(target, prop, value, receiver);
        if (oldValue !== value) {
          callback(target, `${path}${path ? "." : ""}${prop}`, oldValue, value);
        }
        return result;
      },
    };
    return new Proxy(obj, handler);
  },

  /**
   * Renders the template into HTML.
   *
   * @param {Object} template - The JSON object representing the template.
   * @param {Object} [data=null] - The data to bind to the template.
   * @param {function} callback - The callback function to call after rendering.
   * @param {string} [bindId=null] - The ID to bind the data to.
   * @param {number} [depth=0] - The depth of the rendering.
   * @returns {Proxy|null} The proxy object if data is not null, otherwise null.
   */
  render: (template, data = null, callback, bindId = null, depth = 0) => {
    // this is an object of all the elements that have been bound to
    // a piece of data, organized by the data key - the element itself is the element
    // that is created at the end of this function (and is added to this object if the
    // data parametert is not null) as well as the parameters that are used to bind the
    // data (ie, the attribute, greater than, less than, etc)

    // create a unique id
    if (bindId === null) {
      bindId = data ? data._id : this.generateUniqueId();
    }

    if (this.bindings[bindId] === undefined) {
      this.bindings[bindId] = [];
    }

    let listener;

    // if data is not null, then we need to create a proxy, which will be returned
    // at the end of the function
    if (data !== null) {
      if (isServer) {
        this.serverData = JSON.stringify(data);
      } else {
        // Callback function to handle updates
        const updateBindings = (target, prop, oldValue, newValue) => {
          // Directly use the prop as the key
          const currentBindings = this.bindings[bindId];

          // Check if the prop exists in the current bindings
          if (currentBindings) {
            currentBindings.forEach((binding) => {
              // Get the element from the binding object
              const element = binding.element,
                func = binding.func,
                property = binding.property;

              // Run the setUpBindings function
              this.emitBinding(element, property, bindId, func);
            });
          }
        };

        // Create the proxy
        listener = this.createProxy(data, updateBindings.bind(this));
      }
    }

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
        // add the binding to the bindings object
        if (!isServer) {
          if (this.bindings[bindId] === undefined) {
            this.bindings[bindId] = [];
          }

          this.bindings[bindId].push({
            element,
            func: value,
            property: key,
          });

          const result = value(data);
          value = result;

          if (value !== null) {
            this.setElementAttribute(element, key, value, data, bindId, depth);
          }
        } else {
          // store it all to render server-side
          element.dataset.bindId = bindId;

          // Check if the key is camelCase and convert it to hyphenated format if necessary
          const isCamelCase = (str) => {
            return /[a-z][A-Z]/.test(str);
          };

          element.setAttribute(
            `data-bind-to-${isCamelCase(key) ? this.camelToHyphen(key) : key}`,
            value
          );
        }
      } else {
        if (value !== null) {
          this.setElementAttribute(element, key, value, data, bindId, depth);
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
                const HTMLJS = (await import("${
                  process.env.NODE_ENV === "production"
                    ? process.env.CDN_BASE_URL
                    : ""
                }/dist/premmio/htmljs/html.js")).default;
                window.App = new HTMLJS();
            `;

        // add the server data if we have it
        if (this.serverData) {
          script.textContent += `
              // we need to find all elements on screen with a data-bind-id attribute
              // and then set up the listeners for them
              const elements = document.querySelectorAll("[data-bind-id]");

              elements.forEach((element) => {
                const bindId = element.getAttribute("data-bind-id");
                const data = JSON.parse('${this.serverData}');

                // Remove the attributes from the element
                element.removeAttribute("data-bind-id");

                // Store all bindings in an array
                const bindings = [];

                const hyphenToCamelCase = (str) => {
                  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                };
                
                Array.from(element.attributes).forEach((attr) => {
                  if (attr.name.startsWith("data-bind-to-")) {
                    // Remove the "data-bind-to-" prefix to get the property name
                    let propertyName = attr.name.slice("data-bind-to-".length);
                
                    // If the property name does not contain "data-", convert it to camelCase
                    if (!propertyName.startsWith("data-")) {
                      propertyName = hyphenToCamelCase(propertyName);
                    }
                
                    try {
                      const func = new Function("return " + attr.value)();
                      if (typeof func === "function") {
                        bindings.push({
                          property: propertyName,
                          func,
                        });
                        // Remove the attribute from the element
                        element.removeAttribute(attr.name);
                      }
                    } catch (e) {
                      // Ignore attributes that are not functions
                    }
                  }
                });

                // if a proxy object is not already created for the bindId, then create it
                if (App.data[bindId] === undefined) {
                  // Callback function to handle updates
                  const updateBindings = (target, prop, oldValue, newValue) => {
                    // Directly use the prop as the key
                    const currentBindings = App.bindings[bindId];


                    // Check if the prop exists in the current bindings
                    if (currentBindings) {
                      currentBindings.forEach((binding) => {
                        // Get the element from the binding object
                        const element = binding.element,
                          func = binding.func,
                          property = binding.property;

                        // Run the setUpBindings function
                        App.emitBinding(element, property, bindId, func);
                      });
                    }
                  };

                  App.data[bindId] = App.createProxy(data, updateBindings.bind(App));
                }

                // if the bindings object is not already created for the bindId, then create it
                if (App.bindings[bindId] === undefined) {
                  App.bindings[bindId] = [];
                }

                // Add the element and its bindings to the App.bindings object
                bindings.forEach((binding) => {
                  App.bindings[bindId].push({
                    element,
                    func: binding.func,
                    property: binding.property,
                  });

                  // Run the binding once to initialize the element
                  App.emitBinding(element, binding.property, bindId, binding.func);
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

  /**
   * Creates elements based on the template and data.
   *
   * @param {Object} template - The template object.
   * @param {Array|Object} data - The data to create elements with.
   * @param {function} callback - The callback function to call after creation.
   */
  create: (template, data, callback) => {
    if (Array.isArray(data)) {
      data.forEach((dataItem) => {
        // you can only create if you have data and that data has an _id
        // so check for both of those and throw an error if they are not there
        if (!dataItem._id) {
          throw new Error("You must have data and that data must have an _id");
        }

        let templateCopy = { ...template };
        // if the template is a function, pass the dataItem to it
        if (typeof template === "function") {
          templateCopy = template(dataItem);
        }

        this.data[dataItem._id] = this.render(templateCopy, dataItem, callback);
      });
    } else {
      // you can only create if you have data and that data has an _id
      // so check for both of those and throw an error if they are not there
      if (!data || !data._id) {
        throw new Error("You must have data and that data must have an _id");
      }

      this.data[data._id] = this.render(template, data, callback);
    }
  },

  /**
   * Updates the data and re-renders the template.
   *
   * @param {Object} data - The data to update.
   * @param {function} callback - The callback function to call after updating.
   */
  update: (data, callback) => {
    // First check if the data has an _id
    if (!data._id) {
      throw new Error("You must have data and that data must have an _id");
    }

    // Get the listener
    const listener = this.data[data._id];

    // First check to see if the listener exists
    if (!listener) {
      if (!callback) {
        throw new Error("The listener does not exist");
      } else {
        callback(data);
      }
    } else {
      // Recursive function to update nested objects
      const updateObject = (target, source) => {
        for (let key in source) {
          if (source.hasOwnProperty(key)) {
            if (Array.isArray(source[key])) {
              // Directly assign the array, including empty arrays
              target[key] = source[key];
            } else if (
              typeof source[key] === "object" &&
              source[key] !== null
            ) {
              // If the target does not have the key, create an empty object
              if (target[key] === undefined || target[key] === null) {
                target[key] = {};
              }
              // Recursively update nested objects
              updateObject(target[key], source[key]);
            } else {
              // Update the target with the source value
              target[key] = source[key];
            }
          }
        }
      };

      // Update the listener with the values provided in the data object
      updateObject(listener, data);
    }
  },

  /**
   * Gets the data from the data object.
   * @param {string} id the id of the data you want to get
   * @returns
   */
  get: (id) => {
    return this.data[id];
  },

  clearChildren: (element) => {
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

  destroy: (id) => {
    // remove the listener from the data object
    delete this.data[id];

    // remove the binding from the bindings object
    delete this.bindings[id];

    // we also need to loop through the data object and remove any references to this data in any other data objects, checking child objects and ararys as well
    const removeDataReferences = (data, id) => {
      for (let key in data) {
        if (data[key] === id) {
          delete data[key];
        } else if (typeof data[key] === "object") {
          removeDataReferences(data[key], id);
        } else if (Array.isArray(data[key])) {
          data[key].forEach((item) => {
            if (data === id) {
              data[key].splice(data[key].indexOf(id), 1);
            } else {
              removeDataReferences(item, id);
            }
          });
        }
      }
    };

    // loop through the data object and remove any references to this data
    for (let key in this.data) {
      removeDataReferences(this.data[key], id);
    }
  },
};
