import Component, { html, onMount } from "webcomponent";

Component("counter-clicker", ({ state, attributes }) => {
  state.counter = parseInt(attributes.start.value);

  onMount(({ shadowRoot }) => {
    const increase = shadowRoot.getElementById("increase");
    const decrease = shadowRoot.getElementById("decrease");

    increase.addEventListener("click", () => {
      state.set("counter", state.counter + 1);
    });
    decrease.addEventListener("click", () => {
      state.set("counter", state.counter - 1);
    });
  });

  return html`
    <p>Counter: <span>${state.get("counter")}</span></p>
    <p><button id="decrease">Decrease -</button> <button id="increase">Increase +</button></p>
    <p><a href="https://github.com/imaginamundo/webcomponents/blob/main/example/script/components/counter-clicker.js">Repository link</a></p>
  `;
});
