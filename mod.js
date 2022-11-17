let mountFunction = null;

export function onMount(fn) {
  mountFunction = fn;
}

export function html(strings, ...values) {
  const parsedValues = values.map((value) => {
    if (value instanceof Function) return value();
    return value;
  });
  const trimmedStrings = strings.map((string) => string.trim());
  const template = String.raw({ raw: trimmedStrings }, ...parsedValues);

  return { template, templateLiteral: { strings, values } };
}

export default function Component(
  componentName,
  componentFunction,
) {
  customElements.define(
    componentName,
    class extends HTMLElement {
      state = {
        set: (key, value) => {
          this.state[key] = value;
          this.updateStateIdAttribute();
        },
        get(key) {
          return () => this[key];
        },
      };

      onMount = null;
      template = "";
      templateLiteral = {};

      refresh = () => {
        const { template } = html(
          this.templateLiteral.strings,
          ...this.templateLiteral.values,
        );
        this.shadowRoot.innerHTML = template;
        if (this.onMount) this.onMount(this);
      };

      constructor() {
        super();

        const { template, templateLiteral } = componentFunction(this);
        this.template = template;
        this.templateLiteral = templateLiteral;

        this.onMount = mountFunction;
        mountFunction = null;
      }

      updateStateIdAttribute() {
        const id = Number(this.attributes.state?.value || 0);
        this.setAttribute("state", id + 1);
      }

      attributeChangedCallback() {
        this.refresh();
      }

      static get observedAttributes() {
        return ["state"];
      }

      connectedCallback() {
        const template = document
          .createRange()
          .createContextualFragment(this.template);

        this
          .attachShadow({ mode: "open" })
          .appendChild(
            template.cloneNode(true),
          );

        if (this.onMount) this.onMount(this);
      }
    },
  );
}
