import CreateComponent from "webcomponent";

CreateComponent(({ state, functions, html }) => {
  state.type = '';

  functions.init = ({ shadowRoot }) => {
    const input = shadowRoot.querySelector('input');
    input.addEventListener('input', (e) => {
      state.set('type', e.target.value);
    });
    input.focus();
  };

  return html`
    <p>Type something:</p>
    <p><input type="text" value="${ state.get('type') }"/></p>
    <p><b>Your text:</b> ${ state.get('type') }</p>
    <p>Uh-oh, seems like form needs a lot of work haha. The way the component is re-rendered is overwriting its content :(</p>
    <p><a href="https://github.com/imaginamundo/webcomponents/blob/main/example/script/components/type-something.js">Repository link</a></p>
  `;
}, 'type-something');
