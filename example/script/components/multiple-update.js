import CreateComponent from "webcomponent";

CreateComponent(({ state, functions, html, refresh }) => {
  state.name = 'Jose';
  state.age  = 18; 

  functions.init = ({ shadowRoot }) => {
    const button = shadowRoot.querySelector('button');
    button.addEventListener('click', () => {
      state.name = 'Maria';
      state.age = 20;
      refresh();
    });
  };

  return html`
    <ul>
      <li>${ state.get('name') }</li>
      <li>${ state.get('age') }</li>
    </ul>
    <button>Change</button>
  `;
}, 'multiple-update');
