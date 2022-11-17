import Component, { html, onMount } from "webcomponent";

Component("multiple-update", ({ state, refresh }) => {
  state.name = "Jose";
  state.age = 18;

  onMount(({ shadowRoot }) => {
    const button = shadowRoot.querySelector("button");
    button.addEventListener("click", () => {
      state.name = "Maria";
      state.age = 20;
      refresh();
    });
  });

  return html`
    <ul>
      <li>${state.get("name")}</li>
      <li>${state.get("age")}</li>
    </ul>
    <button>Change</button>
    <p><a href="https://github.com/imaginamundo/webcomponents/blob/main/example/script/components/multiple-update.js">Repository link</a></p>
  `;
});
