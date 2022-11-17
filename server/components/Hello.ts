import { CreateComponent, html } from "../deps.ts";

CreateComponent("hello-world", () => {
  return html`<h1>Hello, world!</h1>`;
});
