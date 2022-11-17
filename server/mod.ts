type TemplateKey =
  | string
  | number
  | null
  | undefined
  | (() => string | number | null | undefined);

export function html(
  strings: TemplateStringsArray,
  ...keys: TemplateKey[]
): { template: string; strings: TemplateStringsArray; keys: TemplateKey[] } {
  const template = String.raw(
    { raw: strings },
    keys.map((key) => {
      if (key instanceof Function) return key();
      return key;
    }),
  );

  return { template, strings, keys };
}

export function CreateComponent(
  componentName,
  componentFunction,
) {
  customElements.define(
    componentName,
    class extends HTMLElement {
      state = {
        set: (key: string, value: string | number | null | undefined) => {
          this.state[key] = value;
          this.updateStateIdAttribute();
        },
        get(key: string) {
          return () => this[key];
        },
      };

      constructor() {
        super();

        const { template, strings, keys } = componentFunction(this);
        this.template = template;
        this.strings = strings;
        this.keys = keys;
      }

      // Template literal data
      template: string;
      strings: TemplateStringsArray;
      keys: (Function | string | number | null | undefined)[];

      init: () => void;

      updateStateIdAttribute() {
        const id = Number(this.attributes.state?.value) || 0;
        this.setAttribute("state", id + 1);
      }

      attributeChangedCallback() {
        // this.refresh();
      }

      static get observedAttributes() {
        return ["state"];
      }

      connectedCallback() {
        const template = document
          .createRange()
          .createContextualFragment(this.template);

        this.attachShadow({ mode: "open" })
          .appendChild(
            template.cloneNode(true),
          );

        this.init?.(this);
      }
    },
  );
}
