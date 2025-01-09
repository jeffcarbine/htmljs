# quayjs
quay: /kē/ a concrete, stone, or metal platform lying alongside or projecting into water for loading and unloading ships.

A lightweight JavaScript framework for rendering both server-side and client-side, and tethering elements to data structures.

## Installation

You can install the package via npm:

```sh
npm install quayjs
```

## Import

Import quayjs into your project

```js
import Quay from "quayjs";
```

## Usage

### Elements

quayjs includes a library of all 161 valid HTML elements, including SVG elements. You can import any of these elements from the included `elements` file.

```js
import { Div, H1, Img, P } from "quayjs/elements";

const element = new Div({
  class: "card",
  children: [
    new H1("Hello World"),
    new Img("image.webp"),
    new P("This is an example card"),
  ],
});
```

### Properties

Properties of an element in quayjs are the same as an Element in JavaScript, with a few exceptions listed below.

```js
const element1 = document.createElement("div");
element.id = "foo";
element.tagName = "div";
element.textContent = "Hello World";
element.tabindex = -1;

const element2 = new Div({
  id: "foo",
  textContent: "Hello World",
  tabindex: -1,
});

// both create <div id="foo" tabindex="-1">Hello World</div>
```

#### Property Exceptions

There are a few exceptions to this rule:

- `children` accepts an array of objects to render as the element's children
- `child` accepts a single object to render as the element's sole child
- `class` in lieu of className, for simplicity - however `className` does still work
- `if` conditionally renders an element

```js
const showElement = false;

const element = new Div({
  children: [
    new Div({
      child: new P({
        textContent: "This always shows",
      }),
    }),
    new Div({
      if: showElement,
      child: new P({
        class: "conditional",
        textContent: "This only renders if showElement is true",
      }),
    }),
  ],
});
```

#### Specialized Elements

quayjs also includes a number of specialized elements to simplify the process:

- `Layout` extends `Html` - automatically adds the App object. Imported separately from the `layout.quayjs` file.
- `Stylesheet` extends `Link` - adds `rel="stylesheet"` automatically
- `PreLoadStyle` extends `Link` - adds `rel`, `as`, and `onload` to pre-load stylesheets
- `Module` extends `Script` - adds `type="module`
- `HiddenInput`, `TextInput`, `SearchInput`, `TelInput`, `UrlInput`, `EmailInput`, `PasswordInput`, `DateInput`, `MonthInput`, `WeekInput`, `TimeInput`, `DateTimeLocalInput`, `NumberInput`, `RangeInput`, `ColorInput`, `CheckboxInput`, `RadioInput`, `ResetInput` all extend `Input` and add their appropriate `type`
- `LazyImg` extends `Img` and adds `loading="lazy"`

#### Property Shorthands

You can shorthand properties in an element by passing a single value into it, in the even that element only needs a certain single value

- Arrays will shorthand `children`
- Objects will shorthand `child`
- Strings will generally shorthand `textContent`
- Functions will shorthand data binds (more on that later)

```js
const element = new Div([
  new Div(new P("This always shows")),
  new Div({
    if: showElement,
    child: new P({
      class: "conditional",
      textContent: "This only renders if showElement is true",
    }),
  }),
]);
```

Some elments have unique shorthands:

- Img: string shorthand creates the `src` attribute
- Select: array shorthand wraps each child in an Option(), unless already wrapped
- Ul & Ol: array shorthand wraps each child in a Li(), unless already wrapped
- Dl: array shorthand wraps each child in a Dt(), unless already wrapped
- Thead: array shorthand wraps each child in a Th() unless already wrapped, and wraps the children in a Tr(), unless already wrapped
- Tbody: array shorthand wraps first child in a Th() and subsequent children in a Td() unless already wrapped, and wraps the children in a Tr(), unless already wrapped

### Rendering

#### Client-side Render

To client-side render, import the quayjs object and call the `create` method. `create` takes in three parameters:

- the object to render
- the data to data-bind (optional)
- callback to render the element to the DOM

```js
import Quay from "quayjs";

// set an element to a variable
const heading = Quay.render(new H1("Hello World"));

// render an element as a child of another
Quay.render(new H1("Hello World"), "body");

// run a callback with an element
Quay.render(new H1("Hello World"), (element) =>
  document.body.appendChild(element)
);
```

#### Server-side Render

To server-side render, use quayjs as your view engine

```js
import app from "express";
import { QuayEngine } from "quayjs";

QuayEngine(app);

app.get("index.html" ...)
```

And then you can write your views using quayjs with the extension of quayjs. quayjs templates export a default function with a parameter of `data`, which contains the data being sent from the server.

```js
export default (data) => {
  return new Layout([
    new Head([new Title(data.title), new Stylesheet("styles/site.css")]),
    new Body([
      new Main([
        new Section({
          id: "welcome",
          children: [
            new H1(`Welcome to ${data.pageName}`),
            new P(data.pageWelcomeText),
          ],
        }),
      ]),
    ]),
  ]);
};
```

You can easily create a layout template to be shared across your views:

```js
export const layout = (data, content) => {
  return new Html([
    new Head([new Title(data.title), new Stylesheet("styles/site.css")]),
    new Body([new Main(content || {})]),
  ]);
};
```

```js
import { layout } from "./layout.quayjs";

export default (data) => {
  return layout(data, {
    id: "welcome",
    children: [
      new H1(`Welcome to ${data.pageName}`),
      new P(data.pageWelcomeText),
    ],
  });
};
```

### Data Binding

To data-bind, pass an anonymous function to an element's property. The anonymous function accepts two parameters:

- The data being bound
- The library of quayjs elements

```js
const data = {
  _id: "testData",
  elementClass: "test-element",
  elementText: "This is a test of data-binding",
  children: ["one", "two", "three"],
};

const element = new Div({
  class: (data) => data.elementClass,
  children: [
    new P((data) => data.elementText),
    new Ul({
      children: (data, e) => {
        const children = [];

        data.children.forEach((child) => {
          children.push(new e.Li(child));
        });

        return children;
      },
    }),
  ],
});
```

```html
<div class="test-element">
  <p>This is a test of data-binding</p>
  <ul>
    <li>one</li>
    <li>two</li>
    <li>three</li>
  </ul>
</div>
```

#### Binding the data
