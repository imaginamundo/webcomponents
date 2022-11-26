type TemplateStringsValues =
  | string
  | number
  | null
  | undefined
  | (() => string | number | null | undefined | void);

interface HTMLReturn {
  template: string;
  templateLiteral: {
    strings: TemplateStringsArray;
    values: TemplateStringsValues[];
  };
}

interface ComponentFunctionProps extends HTMLElement {
  state: {
    set: (key: string, value: any) => void;
    get: (key: string) => TemplateStringsValues;
  };
}

let mountFunction: ((HTMLElement: HTMLElement) => void) | null = null;

export function onMount(fn: (HTMLElement: HTMLElement) => void): void {
  mountFunction = fn;
}

export function html(
  strings: TemplateStringsArray,
  ...values: TemplateStringsValues[]
): HTMLReturn {
  const parsedValues = values.map((value) => {
    if (value instanceof Function) return value();
    return value;
  });
  const template = String.raw({ raw: strings }, ...parsedValues);

  return { template, templateLiteral: { strings, values } };
}

export default function Component(
  componentName: string,
  componentFunction: (
    { state, attributes }: ComponentFunctionProps,
  ) => HTMLReturn,
): void {
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

      onMount: ((props: ComponentFunctionProps) => void) | null = null;
      template = "";
      templateLiteral: {
        strings: TemplateStringsArray;
        values: TemplateStringsValues[];
      } = {};

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
        if (!this.shadowRoot) {
          const template = document
            .createRange()
            .createContextualFragment(this.template);

          this
            .attachShadow({ mode: "open" })
            .appendChild(
              template.cloneNode(true),
            );
        }

        this.onMount?.(this);
      }
    },
  );
}
