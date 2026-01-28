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

### Properties

#### `name: string`
- **Getter**: Returns the `name` attribute value or "World" if not set
- **Setter**: Sets the `name` attribute

#### `color: string`
- **Getter**: Returns the `color` attribute value or "#333" if not set
- **Setter**: Sets the `color` attribute

### Lifecycle Callbacks

#### `constructor()`
- Creates shadow root with mode 'open'
- Adopts constructable stylesheet if supported

#### `connectedCallback()`
- Invoked when element is inserted into DOM
- Triggers initial render

#### `attributeChangedCallback(name, oldValue, newValue)`
- Observes: `name`, `color`
- Triggers re-render when observed attributes change

## Rendering

### Shadow DOM Structure

```html
<div class="ck-primitive-array">
  <h1 class="ck-primitive-array__message">Hello, ${name}!</h1>
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

## Usage Examples

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

### Programmatic Attribute Setting
```javascript
const element = document.querySelector('ck-primitive-array');
element.setAttribute('name', 'Updated Name');
element.setAttribute('color', 'blue');
```

## Test Coverage

### Current Test Cases

1. ✅ Instance creation
2. ✅ Shadow DOM presence
3. ✅ Default name value
4. ✅ Name attribute get/set
5. ✅ Render content in shadow DOM
6. ✅ Attribute change updates
7. ✅ Observed attributes list
8. ✅ Color attribute handling

### New Test Cases (Completed 2026-01-28)

9. ✅ Custom element definition verification (1.1.1)
10. ✅ HTML creation verification (1.1.2)
11. ✅ JS creation verification (1.1.3)
