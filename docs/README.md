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

### JavaScript API

You can also manipulate the component programmatically:

```javascript
// Get reference to element
const greeting = document.querySelector('ck-primitive-array');

// Update properties
greeting.name = 'New Name';
greeting.color = '#00ff00';

// Or use attributes
greeting.setAttribute('name', 'Another Name');
greeting.setAttribute('color', 'purple');
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
