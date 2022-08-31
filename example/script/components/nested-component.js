import CreateComponent from "webcomponent";

CreateComponent(({ html }) => {
  return html`
    <p>
      Hello
      <nesting-component who="world"></nesting-component>
    </p>
    
  `;
}, 'nested-component');