import CreateComponent from "webcomponent";

CreateComponent(({ attributes, html }) => {
  const who = attributes.who.value;

  return html`
    <b>${ who }</b>
  `;
}, 'nesting-component');