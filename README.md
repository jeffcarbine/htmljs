# quay.js
quay: /kē/ a concrete, stone, or metal platform lying alongside or projecting into water for loading and unloading ships.

A lightweight JavaScript framework for rendering both server-side and client-side, and tethering elements to data structures.

## Installation

You can install the package via npm:

```sh
npm install quay.js
```

## Import

Import quay.js into your project

```js
import Quay from "quay.js";
```

## Usage

### Elements

quay.js includes a library of all 161 valid HTML elements, including SVG elements. You can import any of these elements from the included `elements` file.

```js
import { Div, H1, Img, P } from "quay.js/elements";

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

Properties of an element in quay.js are the same as an Element in JavaScript, with a few exceptions listed below.

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

quay.js also includes a number of specialized elements to simplify the process:

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

To client-side render, import the quay.js object and call the `create` method. `create` takes in three parameters:

- the object to render
- the data to data-bind (optional)
- callback to render the element to the DOM

```js
import Quay from "quay.js";

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

To server-side render, pass your express app to the `QuayEngine` function.

```js
import app from "express";
import { QuayEngine } from "quay.js";

QuayEngine(app);

app.get("index.html" ...)
```

And then you can write your views using quay.js. quay.js templates export a default function with a parameter of `data`, which contains the data being sent from the server.

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
import { layout } from "./layout.js";

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

Data can be attached to the Quay object by simply assigning to the `Quay.data` object.

The key that is used to attach to the `Quay.data` object is referred to as the **hook**;

```js
const data = {
  elementClass: "test-element",
  elementText: "This is a test of data-binding",
  children: ["one", "two", "three"],
};

// "testData" is the hook
Quay.data.testData = data;
```

Once data is hooked, the object will be stored on the `Quay.data` object, and can be read as such.

```js
console.log(Quay.data.testData.elementClass);
// "test-elemebnt";
```

To update the data, you pass an object to your hook. Quay will automatically merge the object with the stored data, so only the keys that are passed will be updated.

```js
const update = {
  elementClass: "new-class";
};

Quay.data.testData = update;

console.log(Quay.data);
// {
//   elementClass: "new-class",
//   elementText: "This is a test of data-binding",
//   children: ["one", "two", "three"]
// }
```

The path to the specific data you want is called the **tether**. A tether is important for narrow-scope data binding so that elements only re-render if the specific chunk of data they care about has changed.

```js
const data = {
  person: {
    identity: { // the tether would be "identity"
      first_name: "John", // the tether would be "identity.first_name
      last_name: "Doe", // the thether would be "identity.last_name
    },
    email: "johndoe@website.com", // the tether would be "identity.email"
  }
};
```

The combination of the __hook__ and the __tether__ is called a **binding**. When data binding to an element, you need to pass along the specific binding you are attaching to.

```js
const element = new Div({
  binding: "person.identity",
})
```

Then, with the binding passed, you can pass an anonymous function to any property to read the data

```js
const element = new Div({
  binding: "person.identity",
  children: [
    new Span((identity) => identity.first_name),
    new Span((identity) => identity.last_name),
  ]
});

// <div>
//   <span>John</span>
//   <span>Doe</span>
// </div>  
```

To access the Elements within a binding function, you can pass an optional second parameter.

```js
const element = new Div({
  binding: "person.identity",
  children: [
    new Span({
      child: (identity, e) => e.Strong(identity.first_name)
    }),
    new Span((identity) => identity.last_name),
  ]
});

// <div>
//   <span>
//    <strong>John</strong> 
//   </span>
//   <span>Doe</span>
// </div>  
```

To access any custom Components you have created, you can pass the component into the `components` of the element you are binding to, then call the optional third parameter.

```js
class LastNameContainer extends Span {
  constructor(params) {
    super(params);

    this.class += " lastNameContainer";
  }
}

const data = {
  elementClass: "test-element",
  elementText: "This is a test of data-binding",
  children: ["one", "two", "three"],
};

const element = new Div({
  binding: "person.identity",
  children: [
    new Span({
      child: (identity, e) => e.Strong(identity.first_name)
    }),
    new Span((identity, e, c) => new LastNameContainer(identity.last_name)),
  ]
});

// <div>
//   <span>
//    <strong>John</strong> 
//   </span>
//   <span>
//     <span class="lastNameContainer">
//       Doe
//     </span>
//   </span>
// </div>  
```
