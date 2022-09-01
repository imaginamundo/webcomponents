# webcomponents

A small function to make it easier to create webcomponents with a simple state solution.

# Example

[https://imaginamundo.github.io/webcomponents/example/](https://imaginamundo.github.io/webcomponents/example/)

# How to use it

Create your component using the function CreateComponent:

`./script/my-component.js`:
```javascript
import CreateComponent from "https://imaginamundo.github.io/webcomponents/mod.js";

CreateComponent(({ state, attributes, functions, html }) => {
  // Initialize the state
  state.counter = parseInt(attributes.start.value);

  // functions.init will be triggered at the component render
  functions.init = ({ shadowRoot }) => {
    const button = shadowRoot.querySelector('button');
    
    button.addEventListener('click', () => {
      // Update the state
      state.set('counter', state.counter + 1);
    });
  };

  // Printing the state
  return html`<button>Clicks: ${ state.get('counter') }</button>`;
}, 'my-component');
// Defining your component name.
```

After that, you can use it on your HTML like this:

`./index.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>My first web component</title>
  <script src="./script/mod.js" type="module"></script>
</head>
<body>
  <my-component><my-component/>
</body>
</html>
```

And this should work fine.

Ps.: You need to run it on a server to make it work.

# Stage management

The state object give you 2 functions: `get` & `set`.

# Updating the component

When you want to update your component, just use the `state.set('state-name', 'state value')`. See the example bellow:

```javascript
import CreateComponent from "webcomponent";

CreateComponent(({ state, functions, html }) => {
  // Add a key to the state object does not update the component,
  // but in this case, we don't need. The first render will always
  // look at what is the current state.
  state.type = '';

  functions.init = ({ shadowRoot }) => {
    const input = shadowRoot.querySelector('input');
    input.addEventListener('input', (e) => {
      // Using state.set we force the component to update
      state.set('type', e.target.value);
    });
    input.focus();
  };

  return html`<input type="text" /> ${ state.get('type') }`;
}, 'type-something');
```

We can also force a re-render of the component:

```javascript
import CreateComponent from "webcomponent";

CreateComponent(({ state, functions, html, refresh }) => {
  state.name = 'Jose';
  state.age  = 18; 

  functions.init = ({ shadowRoot }) => {
    const button = shadowRoot.querySelector('button');
    button.addEventListener('click', () => {
      // Update multiple states
      state.name = 'Maria';
      state.age = 20;

      // Force re-render
      refresh();
    });
  };

  return html`
    <ul>
      <li>${ state.get('name') }</li>
      <li>${ state.get('age') }</li>
    </ul>
    <button>Change</button>
  `;
}, 'multiple-update');
```

If you want to update a component from outside, you can do it like this:

```html
<my-component id="my-component"></my-component>
```

```javascript
// Grab the component on some way, on this case is byt its id
const myComponent = document.getElementById('my-component');

// Update the change from outside
myComponent.state.stateName = 'New state value';

// Force its update
myComponent.refresh();
```

# Nesting components

There are no secrets on nesting components, since it uses the default browser API it works just putting the html tag inside the other component. As long as both components are initialized on the page, it will work. See the example bellow.

```javascript
// nested-component.js
import CreateComponent from "webcomponent";

CreateComponent(({ html }) => {
  return html`
    <p>
      Hello
      <!-- Just use the component that were created on the other file -->
      <nesting-component who="world"></nesting-component>
    </p>
    
  `;
}, 'nested-component');

// nesting-component.js
import CreateComponent from "webcomponent";

CreateComponent(({ attributes, html }) => {
  const who = attributes.who.value;

  return html`
    <b>${ who }</b>
  `;
}, 'nesting-component');
```

```html
<!-- Use the parent component and the siblings will also appear -->
<nested-component></nested-component>
```

# For the future

- [ ] Create a way to make the component server side rendered;
- [ ] Find a way to make inputs work correctly;

That's all for now, thanks for reading.