# html.js

A lightweight JavaScript framework for rendering both server-side and client-side HTML.

## Installation

You can install the package via npm:

```sh
npm install @carbineco/htmljs
```

## Import

Import html.js into your project

```js
import App from "htmljs";
```

## Usage

### Elements

html.js includes a library of all 161 valid HTML elements, including SVG elements. You can import any of these elements from the included `elements` file.

```js
import { Div, H1, Img, P } from "htmljs/elements";

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

Properties of an element in html.js are the same as an Element in JavaScript, with a few exceptions listed below.

```js
const standard = document.createElement("div");
element.id = "foo";
element.tagName = "div";
element.textContent = "Hello World";
element.tabindex = -1;

const htmls = new Div({
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

html.js also includes a number of specialized elements to simplify the process:

- `Layout` extends `Html` - automatically adds the App object. Imported separately from the `layout.html.js` file.
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

To client-side render, import the Htmljs object and call the `create` method. `create` takes in three parameters:

- the object to render
- the data to data-bind (optional)
- callback to render the element to the DOM

```js
import App from "htmljs";

App.create(new H1("Hello World"), (element) =>
  document.body.appendChild(element)
);
```

#### Server-side Render

To server-side render, use html.js as your view engine

```js
app.set("view engine", "html.js");
```

And then you can write your views using html.js with the extension of html.js. Html.js templates export a default function with a parameter of `data`, which contains the data being sent from the server.

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
import { layout } from "./layout.html.js";

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

To data-bind, pass an anonymous function to an element's property. The anonymous function accepts three parameters:

- The data being bound
- The library of html.js elements

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

To bind data to an element, pass the data as the second argument in the `create` method.

```js
import App from "htmljs";

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

App.create(element, data, (el) => document.body.appendChild(el));
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

#### Updating the data

To update the data, you simply run the `update` method and pass in the new data. Data is identified by its `_id` key. This is to make updating data received from MongoDb requests simple. The updated data object does not have to be complete to update - it will only update the key/values that are present.

```js
const newData = {
  _id: "testData",
  children: [1, 2, 3, 4],
};
```

```html
<div class="test-element">
  <p>This is a test of data-binding</p>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
  </ul>
</div>
```

#### Data-binding from the server

You can send data-bound elements from the server. In your template files, define an export called `boundData` to define the data, and then bind in your html.js as you normally would.

```js

import { layout } from "./layout.html.js";

export const boundData = {
  _id: "testData",
  elementClass: "test-element",
  elementText: "This is a test of data-binding",
  children: ["one", "two", "three"],
};

export default (data) => {
  return layout(data, {
    id: "welcome",
    child: new Div({
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
  });
};
```

The element will arrive client-side with the data already rendered and the bindings in place as long as you are using the `Layout` element.
