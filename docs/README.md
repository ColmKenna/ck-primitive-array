# CkPrimitiveArray Documentation

## User Guide

### What is CkPrimitiveArray?

`CkPrimitiveArray` is a simple, reusable web component that displays a personalized greeting message. It demonstrates best practices for building web components using native browser APIs without frameworks.

### Quick Start

#### 1. Installation

```bash
npm install @colmkenna/ck-primitive-array
```

#### 2. Basic Usage

Import and use in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module">
      import '@colmkenna/ck-primitive-array';
    </script>
</head>
<body>
    <!-- Default greeting: "Hello, World!" -->
    <ck-primitive-array></ck-primitive-array>
    
    <!-- Custom name: "Hello, Alice!" -->
    <ck-primitive-array name="Alice"></ck-primitive-array>
    
    <!-- Custom name and color -->
    <ck-primitive-array name="Bob" color="#0066cc"></ck-primitive-array>
</body>
</html>
```

### Configuration

#### Attributes

##### `name`
- **Type**: String
- **Default**: "World"
- **Description**: The name to display in the greeting

```html
<ck-primitive-array name="Developer"></ck-primitive-array>
```

##### `color`
- **Type**: String (CSS color value)
- **Default**: "#333"
- **Description**: Text color for the greeting message

```html
<ck-primitive-array name="User" color="blue"></ck-primitive-array>
<ck-primitive-array name="Admin" color="#ff6600"></ck-primitive-array>
<ck-primitive-array name="Guest" color="rgb(255, 0, 0)"></ck-primitive-array>
```

##### `items`
- **Type**: JSON array string
- **Default**: `[]` (empty)
- **Description**: Array of primitive values to display as editable rows

**Supported Types**: Strings, numbers, and booleans. Objects, arrays, and null values are filtered out.

```html
<!-- Strings -->
<ck-primitive-array items='["apple", "banana", "cherry"]'></ck-primitive-array>

<!-- Numbers (coerced to strings) -->
<ck-primitive-array items='[1, 2, 3, 4, 5]'></ck-primitive-array>

<!-- Booleans (coerced to strings) -->
<ck-primitive-array items='[true, false]'></ck-primitive-array>

<!-- Mixed primitives (objects/arrays/null filtered out) -->
<ck-primitive-array items='["text", 42, true, null, "more"]'></ck-primitive-array>
<!-- Renders: "text", "42", "true", "more" -->
```

**Error Handling**: Invalid JSON logs an error to console and preserves the previous valid state.

##### `readonly`
- **Type**: Boolean attribute
- **Description**: When present, disables the Add button

```html
<ck-primitive-array readonly items='["locked"]'></ck-primitive-array>
```

##### `disabled`
- **Type**: Boolean attribute
- **Description**: When present, disables the Add button

```html
<ck-primitive-array disabled items='["locked"]'></ck-primitive-array>
```

### Add Button

Clicking the Add button appends a new empty row to the list. The new input automatically receives focus.

A `change` event is dispatched after each add, with `event.detail.items` containing the updated items array.

```javascript
const el = document.querySelector('ck-primitive-array');
el.addEventListener('change', (e) => {
  console.log('Items changed:', e.detail.items);
});
```

#### Programmatic Add with Value

You can call `addItem()` directly with an optional value:

```javascript
const el = document.querySelector('ck-primitive-array');

// Add empty item (same as clicking the Add button)
el.addItem();

// Add item with a pre-filled value
el.addItem('Buy milk');
```

### Keyboard Shortcuts

#### Enter Key

When focused on an item input field, pressing **Enter** adds a new empty item below:

```
User types in input → Presses Enter → New item added → Focus moves to Add button
```

**Behavior**:
- ✅ Adds a new empty item to the list
- ✅ Preserves the current input's value
- ✅ Moves focus to the Add button
- ✅ Dispatches a `change` event
- ❌ Does nothing if `readonly` attribute is present

**Example**:
```html
<ck-primitive-array items='["apple"]'></ck-primitive-array>

<!-- User flow:
1. User focuses the "apple" input
2. User types "banana" (value updates to "banana")
3. User presses Enter
4. New empty input appears below
5. Focus moves to Add button
6. Original input still shows "banana"
-->
```

### Inline Editing

Each item in the list can be edited directly by typing in its input field.

#### Real-Time Updates

Changes update immediately on every keystroke:
```javascript
const el = document.querySelector('ck-primitive-array');

// Listen for changes
el.addEventListener('change', (e) => {
  console.log('Items updated:', e.detail.items);
  // Fires on EVERY keystroke
});
```

#### Form Integration

Set the `name` attribute to enable form submission:
```html
<form>
  <ck-primitive-array name="tags" items='["react","vue"]'></ck-primitive-array>
  <button type="submit">Submit</button>
</form>
```

**Form Data Submitted**:
```
tags[]=react
tags[]=vue
```

Hidden inputs are automatically created and synchronized with visible inputs, enabling standard HTML form submission.

#### Validation

Empty values are automatically flagged:
```css
/* Style validation errors */
.ck-primitive-array__item.has-error input {
  border-color: red;
}
```

**Behavior**:
- Empty inputs get `aria-invalid="true"` attribute
- Parent `.ck-primitive-array__item` gets `.has-error` class
- Screen readers announce invalid state

#### Accessibility

Each input has a descriptive ARIA label that updates with the value:
```html
<!-- User types "apple" -->
<input type="text" aria-label="Item: apple" value="apple" />

<!-- User changes to "orange" -->
<input type="text" aria-label="Item: orange" value="orange" />
```

This provides context for screen reader users navigating between items.

### JavaScript API

You can also manipulate the component programmatically:

```javascript
// Get reference to element
const greeting = document.querySelector('ck-primitive-array');

// Update properties
greeting.name = 'New Name';
greeting.color = '#00ff00';
greeting.items = ['item1', 'item2', 'item3'];

// Or use attributes
greeting.setAttribute('name', 'Another Name');
greeting.setAttribute('color', 'purple');
greeting.setAttribute('items', '["a", "b", "c"]');

// Get current items
const currentItems = greeting.items; // Returns: { id, value, deleted }[]
```

### Examples

#### Example 1: Dynamic Content

```html
<ck-primitive-array id="dynamic-greeting"></ck-primitive-array>

<script>
  const greeting = document.getElementById('dynamic-greeting');
  const names = ['Alice', 'Bob', 'Charlie'];
  let index = 0;
  
  setInterval(() => {
    greeting.name = names[index];
    index = (index + 1) % names.length;
  }, 2000);
</script>
```

#### Example 2: User Input

```html
<input type="text" id="nameInput" placeholder="Enter your name">
<ck-primitive-array id="userGreeting"></ck-primitive-array>

<script>
  const input = document.getElementById('nameInput');
  const greeting = document.getElementById('userGreeting');
  
  input.addEventListener('input', (e) => {
    greeting.name = e.target.value || 'World';
  });
</script>
```

#### Example 3: Items List

```html
<!-- Declarative items -->
<ck-primitive-array 
  name="Shopping List" 
  items='["Milk", "Eggs", "Bread"]'>
</ck-primitive-array>

<!-- Dynamic items -->
<ck-primitive-array id="todo-list"></ck-primitive-array>

<script>
  const todoList = document.getElementById('todo-list');
  todoList.name = 'My Tasks';
  todoList.items = ['Write code', 'Test features', 'Deploy'];
  
  // Add item dynamically
  setTimeout(() => {
    const currentItems = todoList.items;
    const values = currentItems.map(item => item.value);
    todoList.items = [...values, 'Celebrate!'];
  }, 2000);
</script>
```

#### Example 4: Type Coercion

```html
<!-- Numbers become strings -->
<ck-primitive-array 
  name="Fibonacci Sequence" 
  items='[1, 1, 2, 3, 5, 8, 13]'>
</ck-primitive-array>

<!-- Booleans become strings -->
<ck-primitive-array 
  name="Boolean Values" 
  items='[true, false, true]'>
</ck-primitive-array>
```

### Browser Support

The component works in all modern browsers that support:
- Custom Elements v1
- Shadow DOM
- ES Modules

This includes:
- Chrome/Edge 67+
- Firefox 63+
- Safari 10.1+

### Styling

The component uses Shadow DOM, so its internal styles are encapsulated. The component applies the `color` attribute to the message text.

### Accessibility

The component uses semantic HTML (`<h1>` for the greeting, `<p>` for the subtitle) which works well with screen readers.

### Troubleshooting

#### Component not appearing?
- Make sure you've imported the module: `import '@colmkenna/ck-primitive-array';`
- Check browser console for errors
- Verify browser supports Custom Elements

#### Styles not applying?
- The `color` attribute only affects the message text color
- Component uses Shadow DOM, so global styles won't affect internal elements

### Next Steps

- See [readme.technical.md](./readme.technical.md) for implementation details
- See [spec.md](./spec.md) for complete API specification
- Check [examples/demo.html](../examples/demo.html) for live examples
