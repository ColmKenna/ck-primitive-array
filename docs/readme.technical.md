# CkPrimitiveArray - Technical Documentation

## Architecture

### Component Class Hierarchy

```
HTMLElement (Native)
    └── CkPrimitiveArray (Custom)
```

### File Structure

```
src/components/ck-primitive-array/
├── ck-primitive-array.ts        # Main component implementation
└── ck-primitive-array.styles.ts # Stylesheet definitions
```

## Implementation Details

### Custom Element Registration

```typescript
if (!customElements.get('ck-primitive-array')) {
  customElements.define('ck-primitive-array', CkPrimitiveArray);
}
```

**Design Decision**: Guard prevents duplicate registration errors when module is imported multiple times.

### Shadow DOM

```typescript
constructor() {
  super();
  this.shadow = this.attachShadow({ mode: 'open' });
  // ... stylesheet adoption
}
```

**Mode**: `'open'` - Allows external JavaScript to access shadow root via `element.shadowRoot`

**Why Shadow DOM?**
- Style encapsulation
- DOM structure isolation
- Prevents naming conflicts

### Styling Strategy

#### Constructable Stylesheets (Primary)

```typescript
if (ckPrimitiveArraySheet && adopted !== undefined) {
  this.shadow.adoptedStyleSheets = [...adopted, ckPrimitiveArraySheet];
}
```

**Benefits**:
- Single stylesheet instance shared across all component instances
- Better memory efficiency
- Faster style updates

#### Fallback Strategy

```typescript
if (!ckPrimitiveArraySheet) {
  if (!this.shadow.querySelector('style[data-ck-primitive-array-fallback]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ck-primitive-array-fallback', '');
    style.textContent = ckPrimitiveArrayCSS;
    this.shadow.appendChild(style);
  }
}
```

**Fallback for**: Browsers without Constructable Stylesheet support  
**Optimization**: Only inject once per shadow root using data attribute marker

#### CSS Custom Properties

```typescript
this.style.setProperty('--ck-primitive-array-color', this.color);
```

**Purpose**: Per-instance customization without duplicating stylesheets

### Lifecycle Management

#### Construction Phase
1. Call `super()` to initialize HTMLElement
2. Attach shadow root
3. Adopt stylesheets (if supported)

#### Connection Phase
```typescript
connectedCallback() {
  this.render();
}
```

Invoked when:
- Element inserted into document
- Element moved to new location in document

**Note**: Does not trigger on attribute changes - those use `attributeChangedCallback`

#### Attribute Observation

```typescript
static get observedAttributes() {
  return ['name', 'color', 'items', 'readonly', 'disabled'];
}

attributeChangedCallback(name: string, oldValue: string, newValue: string) {
  if (oldValue !== newValue) {
    this.render();
  }
}
```

**Optimization**: Only re-render if value actually changed

### Property Accessors

#### Name Property
```typescript
get name() {
  return this.getAttribute('name') || 'World';
}

set name(value: string) {
  this.setAttribute('name', value);
}
```

**Pattern**: Properties reflect to attributes  
**Trigger**: Setting property calls `setAttribute`, which triggers `attributeChangedCallback`

### Rendering

```typescript
private render() {
  // 1. Handle fallback styles
  // 2. Set CSS custom property
  // 3. Update shadow DOM innerHTML
  // 4. Apply inline style for testability
}
```

#### Rendering Steps

1. **Fallback Style Injection**: If constructable stylesheets unavailable
2. **CSS Variable Update**: Set `--ck-primitive-array-color` on host element
3. **DOM Update**: Use template literal to generate HTML
4. **Testability Hack**: Apply inline color style for Jest assertions

**⚠️ Security Note**: Current implementation uses template literals in `innerHTML`. Safe for current use case (controlled attributes) but could be XSS vector if accepting arbitrary user input.

### Template Structure

```html
<div class="ck-primitive-array">
  <h1 class="ck-primitive-array__message">Hello, ${this.name}!</h1>
  <div class="ck-primitive-array__controls">
    <button type="button" class="add-item">Add</button>
  </div>
  <div class="ck-primitive-array__list" role="list" aria-label="items">
    <p class="ck-primitive-array__placeholder">No items</p>
    <div class="ck-primitive-array__item" role="listitem">
      <input type="text" value="${item.value}" />
      <button type="button" data-action="delete">Delete</button>
      <button type="button" data-action="remove">X</button>
    </div>
  </div>
  <p class="ck-primitive-array__subtitle">Welcome to our Web Component Library</p>
</div>
```

**Naming Convention**: BEM-style class names  
**Dynamic Content**: `name` is dynamic; items render as editable rows based on internal item state

## TypeScript Configuration

### Type Assertions

```typescript
const msg = this.shadow.querySelector('.ck-primitive-array__message') as HTMLElement | null;
```

**Reason**: TypeScript doesn't know query result is HTMLElement, needs assertion for style access

### Shadow Root Types

```typescript
this.shadow as unknown as ShadowRoot & {
  adoptedStyleSheets?: CSSStyleSheet[];
}
```

**Reason**: `adoptedStyleSheets` is relatively new API, may not be in all TypeScript lib definitions

## Testing Strategy

### Environment
- **Framework**: Jest
- **DOM**: jsdom (Node.js DOM implementation)
- **Registration**: `beforeAll` hook defines custom element once

### Test Categories

1. **Instance Creation**: Verify component can be instantiated
2. **DOM Structure**: Verify shadow DOM presence
3. **Default Values**: Verify attribute defaults
4. **Property/Attribute Sync**: Verify two-way binding
5. **Rendering**: Verify content appears in shadow DOM
6. **Reactivity**: Verify attribute changes trigger updates
7. **Lifecycle**: Verify observed attributes list

### Test Patterns

```typescript
beforeEach(() => {
  element = new CkPrimitiveArray();
  document.body.appendChild(element);
});

afterEach(() => {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
});
```

**Pattern**: Fresh instance per test, clean up after each test

## Build & Distribution

### Rollup Configuration

**Output Formats**:
- UMD: `dist/ck-primitive-array/ck-primitive-array.js`
- ES Module: `dist/ck-primitive-array/ck-primitive-array.esm.js`
- Minified: `dist/ck-primitive-array/ck-primitive-array.min.js`

### TypeScript Compilation

- Source: TypeScript (`.ts`)
- Output: JavaScript with `.d.ts` type definitions
- Target: ES modules for modern browsers

## Performance Considerations

### Constructable Stylesheets
- **Memory**: One stylesheet instance shared across all components
- **Performance**: No style parsing per instance

### Shadow DOM
- **Pro**: Style recalculation scoped to shadow root
- **Con**: Slight memory overhead per instance

### Rendering
- **Current**: Full re-render on attribute change
- **Optimization Opportunity**: Could use selective DOM updates

## Security

### Current State
- ✅ No `eval()` usage
- ✅ No unsafe URL handling
- ⚠️ Uses `innerHTML` with template literals
- ⚠️ Currently safe (controlled input) but not XSS-proof

### Recommendations
- For arbitrary user input: Use DOM APIs instead of `innerHTML`
- Sanitize any dynamic content from untrusted sources

## Browser Compatibility

### Required APIs
- ✅ Custom Elements v1 (2016+)
- ✅ Shadow DOM v1 (2016+)
- ✅ ES Modules (2017+)
- ⚠️ Constructable Stylesheets (2019+, with fallback)

### Polyfills
Not currently included. For older browser support, add:
- `@webcomponents/webcomponentsjs`

### Add Button & Change Event

The `addItem(value?: string)` method is **public** and:
1. Accepts an optional `value` parameter (defaults to `''` when omitted)
2. Pushes a new `{ id, value, deleted: false }` item to internal state
3. Appends only the new row to the DOM (no full re-render)
4. Focuses the newly created input element
5. Dispatches a `change` CustomEvent with `detail.items` containing the updated items array

The Add button's click handler calls `addItem()` with no argument.

The Add button is disabled when the `readonly` or `disabled` boolean attribute is present on the host element. This state is updated on every render via `this.addButton.disabled`.

### Keyboard Event Handling

#### Enter Key in Item Inputs

Each item input has a `keydown` event listener attached in `createItemRow()`:

```typescript
input.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (!this.hasAttribute('readonly')) {
      this.addItem();
      this.addButton?.focus();
    }
  }
});
```

**Implementation Details**:
1. **Event Type**: `keydown` (fires before default browser behavior)
2. **Key Detection**: Uses `e.key === 'Enter'` (modern KeyboardEvent API)
3. **Readonly Check**: Respects `readonly` attribute by checking `hasAttribute()`
4. **Action**: Calls existing `addItem()` method (reuses logic, dispatches change event)
5. **Focus Management**: Moves focus to Add button using `focus()` method

**Lifecycle**:
- Listener attached when input is created in `createItemRow()`
- Listener removed automatically when input is removed from DOM
- No explicit cleanup needed (browser handles garbage collection)

**Design Decisions**:
- ✅ Inline handler (simple, no need for bound method storage)
- ✅ Leverages existing `addItem()` logic (DRY principle)
- ✅ Respects readonly state (consistent with button behavior)
- ✅ Provides keyboard accessibility (complements mouse interaction)

## Future Enhancements

### Potential Features
- Event dispatching for name changes
- Slot support for custom content
- More customizable styling options
- Animation/transition support

### Code Quality
- Replace `innerHTML` with DOM APIs for XSS protection
- Add JSDoc comments
- Increase test coverage for edge cases
- Add performance benchmarks
