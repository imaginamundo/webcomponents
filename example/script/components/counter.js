import CreateComponent from "@webcomponent";

CreateComponent(({ state, attributes, functions, html }) => {
  state.counter = parseInt(attributes.start.value);

  functions.init = ({ shadowRoot, state }) => {
    const increase = shadowRoot.getElementById('increase');
    const decrease = shadowRoot.getElementById('decrease');
    
    increase.addEventListener('click', () => {
      state.set('counter', state.counter + 1);
    });
    decrease.addEventListener('click', () => {
      state.set('counter', state.counter - 1);
    });
  };

  return html`
    <p>Counter: <span>${ state.get('counter') }</span></p>
    <p><button id="decrease">Decrease -</button> <button id="increase">Increase +</button></p>
  `;
}, 'web-component');

