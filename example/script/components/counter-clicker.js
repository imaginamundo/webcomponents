import Component, { html, onMount } from "webcomponent";

Component("counter-clicker", ({ state, attributes }) => {
  state.counter = parseInt(attributes.start.value);

  onMount(({ shadowRoot }) => {
    const buttonIncrease = shadowRoot.getElementById("increase");
    const buttonDecrease = shadowRoot.getElementById("decrease");

    buttonIncrease.addEventListener("click", () => {
      state.set("counter", state.counter + 1);
    });
    buttonDecrease.addEventListener("click", () => {
      state.set("counter", state.counter - 1);
    });
  });

  return html`
    <p>Counter: ${state.get("counter")}</p>
    <p><button id="decrease">Decrease -</button> <button id="increase">Increase +</button></p>
    <p><a href="https://github.com/imaginamundo/webcomponents/blob/main/example/script/components/counter-clicker.js">Repository link</a></p>
  `;
});
