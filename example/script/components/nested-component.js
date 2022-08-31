import CreateComponent from "webcomponent";

CreateComponent(({ html }) => {
  return html`
    <p>
      Hello
      <nesting-component who="world"></nesting-component>
    </p>
    <p><a href="https://github.com/imaginamundo/webcomponents/blob/main/example/script/components/nested-component.js">Repository link</a></p>
  `;
}, 'nested-component');