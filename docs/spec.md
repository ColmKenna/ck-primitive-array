# Component Specification: CkPrimitiveArray

## Overview

The `CkPrimitiveArray` is a web component that displays a greeting message with customizable name and color. It serves as a foundational example for the component library.

## Custom Element Registration

**Tag Name**: `ck-primitive-array`  
**Class**: `CkPrimitiveArray`  
**Extends**: `HTMLElement`

### Registration Requirements

1. **Definition**: Component must be registered with `customElements.define()`
2. **Uniqueness**: Registration only occurs if tag is not already defined
3. **Retrievability**: `customElements.get('ck-primitive-array')` returns the class constructor

## Component API

### Attributes

| Attribute | Type   | Default | Description                |
|-----------|--------|---------|----------------------------|
| `name`    | string | "World" | Name to display in greeting |
| `color`   | string | "#333"  | Text color for the message  |
| `items`   | JSON   | `[]`    | JSON array of primitive values to display as items |

### Properties

#### `name: string`
- **Getter**: Returns the `name` attribute value or "World" if not set
- **Setter**: Sets the `name` attribute

#### `color: string`
- **Getter**: Returns the `color` attribute value or "#333" if not set
- **Setter**: Sets the `color` attribute

#### `items: string[]`
- **Getter**: Parses the `items` attribute JSON and returns array of strings. Returns empty array if attribute is missing or invalid
- **Setter**: Serializes array to JSON and sets the `items` attribute

### Items Attribute Parsing Rules

The `items` attribute accepts a JSON array and applies the following parsing logic:

1. **Primitives Only**: Only `string`, `number`, and `boolean` values are accepted
2. **Type Coercion**: Numbers and booleans are converted to strings
   - `1` → `"1"`
   - `true` → `"true"`
   - `false` → `"false"`
3. **Filtered Values**: The following types are ignored:
   - Objects: `{"x": 1}` → filtered out
   - Arrays: `[1, 2]` → filtered out
   - Null: `null` → filtered out
   - Undefined: `undefined` → filtered out
4. **Error Handling**:
   - Invalid JSON logs error to console
   - Previous valid state is preserved on parse error
   - No items rendered if no previous state exists

### Lifecycle Callbacks

#### `constructor()`
- Creates shadow root with mode 'open'
- Adopts constructable stylesheet if supported

#### `connectedCallback()`
- Invoked when element is inserted into DOM
- Triggers initial render

#### `attributeChangedCallback(name, oldValue, newValue)`
- Observes: `name`, `color`, `items`
- Triggers re-render when observed attributes change
- For `items`, preserves previous state if new value is invalid JSON

## Rendering

### Shadow DOM Structure

```html
<div class="ck-primitive-array">
  <h1 class="ck-primitive-array__message">Hello, ${name}!</h1>
  <div class="ck-primitive-array__controls">
    <button type="button" class="add-item">Add</button>
  </div>
  <div class="ck-primitive-array__list" role="list" aria-label="items">
    <p class="ck-primitive-array__placeholder">No items</p>
    <!-- Items rendered here when items attribute is set -->
    <div class="ck-primitive-array__item" role="listitem">${item}</div>
  </div>
  <p class="ck-primitive-array__subtitle">Welcome to our Web Component Library</p>
</div>
```

### Styling

- Uses Constructable Stylesheets when supported
- Falls back to `<style>` tag injection for unsupported browsers
- Per-instance color applied via CSS custom property `--ck-primitive-array-color`
- Inline style on message element for testability

## Browser Support

- Modern browsers supporting:
  - Custom Elements v1
  - Shadow DOM
  - ES modules
  - Constructable Stylesheets (with fallback)

<!-- With items attribute -->
<ck-primitive-array items='["apple", "banana", "cherry"]'></ck-primitive-array>
<ck-primitive-array items='[1, 2, 3]'></ck-primitive-array>
<ck-primitive-array items='[true, false]'></ck-primitive-array>

## Usage Examples
element.items = ['item1', 'item2', 'item3'];

### HTML Declaration
```html
<ck-primitive-array></ck-primitive-array>
<ck-primitive-array name="Developer"></ck-primitive-array>
<ck-primitive-array name="User" color="#0066cc"></ck-primitive-array>
```

### JavaScript Creation
```javascript
const element = document.createElement('ck-primitive-array');
element.name = 'Dynamic User';
element.color = '#ff6600';
document.body.appendChild(element);
```
element.setAttribute('items', '["a", "b", "c"]');

// Using property setter
element.items = ['x', 'y', 'z'];

### Programmatic Attribute Setting
```javascript
const element = document.querySelector('ck-primitive-array');
element.setAttribute('name', 'Updated Name');
element.setAttribute('color', 'blue');
```

## Test Coverage

9. ✅ Custom element definition verification (1.1.1)
10. ✅ HTML creation verification (1.1.2)
11. ✅ JS creation verification (1.1.3)
12. ✅ List container with ARIA roles
13. ✅ Add button visibility
14. ✅ Placeholder display
15. ✅ Valid JSON array of strings renders items (1.3.1)
16. ✅ Numbers are coerced to strings (1.3.2)
17. ✅ Booleans are coerced to strings (1.3.3)
18. ✅ Non-primitive objects are ignored (1.3.4)
19. ✅ Nested arrays are ignored (1.3.5)
20. ✅ Null values are ignored (1.3.6)
21. ✅ Invalid JSON logs error (1.3.7)
22. ✅ Invalid JSON preserves previous state (1.3.8)

**Total**: 23 tests passing
5. ✅ Render content in shadow DOM
6. ✅ Attribute change updates
7. ✅ Observed attributes list
8. ✅ Color attribute handling

### New Test Cases (Completed 2026-01-28)

9. ✅ Custom element definition verification (1.1.1)
10. ✅ HTML creation verification (1.1.2)
11. ✅ JS creation verification (1.1.3)
