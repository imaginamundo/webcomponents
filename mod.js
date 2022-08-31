export default function CreateComponent(
  componentFunction,
  componentName
) {
  customElements.define(componentName,
    class extends HTMLElement {
      privateKeys = new Set([ 'set', 'get' ]);
      state = {
        set: (key, value) => {
          if (this.privateKeys.has(key)) {
            throw new Error(`Key ${ key } cannot be used. It is reserved for the create component function`);
          }

          this.state[key] = value;
          this.updateStateIdAttribute();
        },
        get(key) {
          return () => {
            return this[key];
          };
        }
      };
      functions = {};
      template = '';
      templateLiteral = {};
      refresh = () => {
        const { template } = this.html(this.templateLiteral.html, ...this.templateLiteral.keys);
        this.shadowRoot.innerHTML = template;
        this.functions.init(this);
      }
  
      constructor() {
        super();

        const { template, templateLiteral } = componentFunction(this); 
        this.template = template;
        this.templateLiteral = templateLiteral;
      }

      html(html, ...keys) {
        let template = '';
        html.forEach((string, i) => {
          let key = keys[i];
          if (keys[i] instanceof Function) key = keys[i]();
          template += string + (key ?? '');
        });

        return { template, templateLiteral: { html, keys }  };
      }

      updateStateIdAttribute() {
        const id = parseInt(this.attributes.state?.value || 0);
        this.setAttribute('state', id + 1);
      }

      attributeChangedCallback() {
        this.refresh();
      }

      static get observedAttributes() {
        return [ 'state' ];
      }

      connectedCallback() {
        const template = document
          .createRange()
          .createContextualFragment(this.template);
  
        this.attachShadow({ mode: 'open' })
            .appendChild(
              template.cloneNode(true)
            );

        this.functions.init?.(this);
      }
    }
  );
}