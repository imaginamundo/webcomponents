import Component, { html } from "webcomponent";

Component("nesting-component", ({ attributes }) => {
  const who = attributes.who.value;

  return html`<b>${who}</b>`;
});
