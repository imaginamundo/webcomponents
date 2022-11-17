import Component, { html } from "webcomponent";

Component("nested-component", () => {
  return html`
    <p>
      Hello nested
      <nesting-component who="world"></nesting-component>!
    </p>
    <p><a href="https://github.com/imaginamundo/webcomponents/blob/main/example/script/components/nested-component.js">Repository link</a></p>
  `;
});
