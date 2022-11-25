// import { html } from 'https://unpkg.com/uhtml';

/**
 * # OnMount store and function
 * 1. When the component is executed we store the mount function inside the variable mountFunction;
 * 2. When the component start its webcomponent we get the function inside the variable and attach to the class component;
 * 3. Reset the mountFunction variable back to null;
 * 4. Repeat for each time a component is mounted.
 */
let mountFunction = null;
export function onMount(fn) {
  mountFunction = fn;
}

/**
 * # Template literal html function
 * 1. On each value, verify if it is a function and execute trying to get its value;
 * 2. Return a string fulfilled with all the data and all the data necessary to run it again.
 */
export function html(strings, ...values) {
  const parsedValues = values.map((value) => {
    if (value instanceof Function) return value();
    return value;
  });

  const template = String.raw({ raw: strings }, ...parsedValues);

  return { template, templateLiteral: { strings, values } };
}

export default function Component(
  componentName,
  componentFunction,
) {
  // Create a webcomponent
  customElements.define(
    componentName,
    class extends HTMLElement {
      /**
       * # Store for the component
       * 1. Set: store the the state key and value, render the component again;
       * 2. Get: find the key already stored, if not found, returns undefined.
       */
      state = {
        set: (key, value) => {
          this.state[key] = value;
          this.updateStateIdAttribute();
        },
        get(key) {
          return () => this[key];
        },
      };

      // mountFunction stored locally
      onMount = null;
      // String from template literal
      template = "";
      // Values to generate the string from html
      templateLiteral = {};

      // Function to update the HTML
      refresh = () => {
        const { template } = html(
          this.templateLiteral.strings,
          ...this.templateLiteral.values,
        );
        this.shadowRoot.innerHTML = template;
        this.onMount?.(this);
      };

      constructor() {
        super();

        /**
         * Component function
         */
        const { template, templateLiteral } = componentFunction(this);
        this.template = template;
        this.templateLiteral = templateLiteral;
        this.onMount = mountFunction;

        // Reset mountFunction to null
        mountFunction = null;
      }

      // Update state attribute to update the component
      updateStateIdAttribute() {
        const id = Number(this.attributes.state?.value || 0);
        this.setAttribute("state", id + 1);
      }

      // Update component on changing attribute state on webcomponent
      attributeChangedCallback() {
        this.refresh();
      }

      // Only call the function attributeChangeCallback when state attribute is changed
      static get observedAttributes() {
        return ["state"];
      }

      // When the component start
      connectedCallback() {
        // If it is not server side rendered (if does not already have a shadowRoot)
        if (!this.shadowRoot) {
          const parsedTemplate = stringToHtml(this.template);
          this.attachShadow({ mode: "open" }).replaceChildren(
            ...parsedTemplate.childNodes,
          );
        }
        /**
         * If there is an onMount function, execute
         * Usually this is the place where the document.addEventListeners are storaged
         * For the future: try to avoid this pattern
         */
        this.onMount?.(this);
      }
    },
  );
}

const domParser = new DOMParser();
function stringToHtml(string) {
  const document = domParser.parseFromString(string, "text/html");
  return document.body;
}
