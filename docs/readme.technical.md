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

#### Disconnection Phase

On disconnect, the component:
- Removes event listeners attached to host and shadow root
- Removes the rendered container from the shadow root to avoid duplicate UI on reconnect
- Clears cached element references and hidden input state

#### Attribute Observation

```typescript
static get observedAttributes() {
  return [
    'name',
    'color',
    'items',
    'readonly',
    'disabled',
    'deleted-name',
    'required',
    'min',
    'max',
    'minlength',
    'maxlength',
    'pattern',
    'allow-duplicates',
  ];
}

attributeChangedCallback(name: string, oldValue: string, newValue: string) {
  if (oldValue !== newValue) {
    this.render();
  }
}
```

**Optimization**: Only re-render if value actually changed

#### Items Attribute Parsing

- Parses `items` as a JSON array of primitives (string/number/boolean)
- Invalid JSON or non-array JSON logs an error and resets to empty state
- JSON `null` or empty string yields an empty state without errors
- Updating `items` replaces all existing items and dispatches a `change` event after render

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
  // 3. Create DOM structure once (on first render)
  // 4. Update message, state classes, and controls
  // 5. Render items + sync hidden inputs + validate constraints
}
```

#### Rendering Steps

1. **Fallback Style Injection**: If constructable stylesheets unavailable
2. **CSS Variable Update**: Set `--ck-primitive-array-color` on host element
3. **DOM Initialization**: Create the container, controls, and list once per instance
4. **State Updates**: Toggle disabled/readonly classes and update add button state
5. **Item Rendering**: Render rows using DOM APIs and attach event handlers

### Template Structure

```html
<div class="ck-primitive-array">
  <h1 class="ck-primitive-array__message">Hello, ${this.name}!</h1>
  <div class="ck-primitive-array__controls">
    <button type="button" class="add-item" aria-label="Add item">Add</button>
  </div>
  <div class="ck-primitive-array__list" role="list" aria-label="Items" part="list">
    <p class="ck-primitive-array__placeholder">No items</p>
    <div class="ck-primitive-array__item" role="listitem" part="row">
      <input type="text" value="${item.value}" aria-label="Item 1: ${item.value}" part="input" />
      <button type="button" data-action="delete" aria-label="Delete Item 1: ${item.value}" part="delete-button">Delete</button>
      <button type="button" data-action="remove" aria-label="Remove Item 1: ${item.value}" part="remove-button">X</button>
    </div>
  </div>
  <div class="ck-primitive-array__live" aria-live="polite" aria-atomic="true" role="status"></div>
  <p class="ck-primitive-array__subtitle">Welcome to our Web Component Library</p>
</div>
```

**Naming Convention**: BEM-style class names  
**Dynamic Content**: `name` is dynamic; items render as editable rows based on internal item state

### CSS Parts

`::part` hooks:

- `list`, `row`, `deleted`, `input`, `delete-button`, `remove-button`
- Deleted rows use `part="row deleted"`

### State Attributes (Readonly + Disabled)

- **Readonly**: Sets `input.readOnly = true`, disables Add/Delete/Remove buttons, applies `.is-readonly` class
- **Disabled**: Sets `input.disabled = true`, disables Add/Delete/Remove buttons, applies `.is-disabled` class
- **Dynamic**: Toggling attributes re-renders rows and updates control states immediately

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

The Add button is disabled when `readonly`, `disabled`, or `max` constraints apply. The component also mirrors this state via `aria-disabled`.

### Keyboard Event Handling

#### Enter Key in Item Inputs

Each item input has a `keydown` event listener attached in `createItemRow()`:

```typescript
input.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (e.ctrlKey || e.metaKey) {
      const form = this.closest('form');
      if (form) {
        this.commitInputValue(itemState, input, itemRow, true);
        form.requestSubmit();
      }
      return;
    }

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
3. **Shortcut Priority**: Ctrl/Cmd+Enter submits the nearest form before normal Enter behavior
4. **Value Commit**: Uses `commitInputValue()` to sync state and hidden inputs before submit
5. **Readonly Check**: Respects `readonly` for normal Enter only (submission still allowed)
6. **Action**: Calls existing `addItem()` method (reuses logic, dispatches change event)
7. **Focus Management**: Moves focus to Add button using `focus()` method

**Lifecycle**:
- Listener attached when input is created in `createItemRow()`
- Listener removed automatically when input is removed from DOM
- No explicit cleanup needed (browser handles garbage collection)

#### Tab Navigation and Button Activation

The shadow root listens for keydown events to manage focus order and button activation:

```typescript
this.shadow.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    // Move focus to next/previous focusable control
  }

  if (event.target instanceof HTMLButtonElement &&
      (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    event.target.click();
  }
});
```

**Behavior**:
- Tab/Shift+Tab move between Add → Input → Delete → Remove → next row
- Tab exits after the last control to the next focusable element in the document
- Enter/Space activate focused buttons
- Escape on inputs moves focus to the Add button

**Design Decisions**:
- ✅ Inline handler (simple, no need for bound method storage)
- ✅ Ctrl/Cmd+Enter uses standard `requestSubmit()` for validation
- ✅ Commits focused input value before submission
- ✅ Respects readonly for add while still allowing submission
- ✅ Provides keyboard accessibility (complements mouse interaction)

## Inline Edit Implementation (Phase 2.1)

### Overview

Each item input supports real-time inline editing with change events, form integration, accessibility, and validation.

### Implementation Details

#### Input Event Listener

Located in `createItemRow()` method:

```typescript
input.addEventListener('input', () => {
  this.commitInputValue(itemState, input, itemRow, true);
});
```

**Execution Order (via `commitInputValue`)**:
1. **State Update**: `itemState.value` updated first (source of truth)
2. **ARIA Update**: Labels refreshed via `updateAriaLabels()` using index + value
3. **Hidden Input Sync**: Form integration (if `name` attribute set)
4. **Validation**: Error message + `aria-invalid` handling
5. **Event Dispatch**: Notify parent component/application

**Performance Note**: Dispatches change event on EVERY keystroke. For performance-critical applications, consider debouncing.

### Feature Components

#### Hidden Input Creation

Lines 258-266:
```typescript
let hiddenInput: HTMLInputElement | null = null;
const formName = this.getAttribute('name');
if (formName) {
  hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = `${formName}[]`;  // Array notation
  hiddenInput.value = itemState.value;
}
```

**Design Decisions**:
- ✅ Conditional creation (only when `name` attribute present)
- ✅ Array notation `[]` for multiple values
- ✅ Closure reference for sync in input listener

#### ARIA Accessibility

ARIA labels are derived from index + value:

```typescript
const label = this.formatItemLabel(index, value); // "Item 1: apple"
input.setAttribute('aria-label', label);
deleteButton.setAttribute('aria-label', `Delete ${label}`);
removeButton.setAttribute('aria-label', `Remove ${label}`);
```

**Accessibility Benefits**:
- Screen readers announce item context with position ("Item 1: apple")
- Labels update on edit and re-index on removal
- Buttons carry descriptive labels for delete/restore/remove actions

#### Soft-Delete Support

Lines 253-256:
```typescript
if (itemState.deleted) {
  input.disabled = true;
}
```

**Design Decisions**:
- ✅ Uses `disabled` (not `readonly`) for full prevention
- ✅ Browser-default visual styling (grayed out)
- ✅ Prevents keyboard/mouse interaction
- ✅ Excludes from form submission

#### Validation

Lines 279-286:
```typescript
if (input.value === '') {
  input.setAttribute('aria-invalid', 'true');
  itemRow.classList.add('has-error');
} else {
  input.removeAttribute('aria-invalid');
  itemRow.classList.remove('has-error');
}
```

**Dual Indicators**:
1. **Semantic**: `aria-invalid="true"` (for AT)
2. **Visual**: `.has-error` class (for CSS styling)

**Validation Rules**:
- Only validates empty string
- No min/max length enforcement
- No character restrictions
- Extensible via CSS

### Testing Strategy

**Test Coverage**: 8 tests (2.1.1-2.1.8)
- State updates (1 test)
- Change events (2 tests)
- Hidden inputs (1 test)
- Soft-delete (1 test)
- Identity preservation (1 test)
- ARIA labels (1 test)
- Validation (1 test)

**Test Patterns**:
```typescript
// Dispatch input event to trigger listener
input.value = 'new value';
input.dispatchEvent(new window.Event('input', { bubbles: true }));

// Verify state, event, and side effects
expect(el.items[0].value).toBe('new value');
expect(changeHandler).toHaveBeenCalledTimes(1);
```

### Memory Management

**Lifecycle**:
- Input listener created in `createItemRow()`
- Listener removed automatically when input removed from DOM
- Hidden input closure reference garbage collected with listener
- No explicit cleanup needed

**No Memory Leaks**:
- ✅ No event listeners on component instance
- ✅ No global state references
- ✅ Closure variables cleaned up with DOM

## Validation System (Phase 4)

### Overview

The validation system provides both item-level and list-level constraint checking with comprehensive error messaging and accessibility support. Validation is always performed on input events and state changes, preventing invalid data entry.

### Item-Level Validation

#### validateItemValue() Method

Located in the component class:

```typescript
private validateItemValue(value: string, itemState): string | null {
  // 1. Empty/whitespace check
  if (value.trim() === '') {
    return 'This field is required.';
  }

  // 2. Minimum length check
  const minLength = this.getAttribute('minlength');
  if (minLength) {
    const min = parseInt(minLength, 10);
    if (value.length < min) {
      return `Must be at least ${min} characters.`;
    }
  }

  // 3. Maximum length check
  const maxLength = this.getAttribute('maxlength');
  if (maxLength) {
    const max = parseInt(maxLength, 10);
    if (value.length > max) {
      return `Must be no more than ${max} characters.`;
    }
  }

  // 4. Pattern validation
  const patternAttr = this.getAttribute('pattern');
  if (patternAttr) {
    try {
      const regex = new RegExp(`^${patternAttr}$`);
      if (!regex.test(value)) {
        return 'Invalid format.';
      }
    } catch (e) {
      console.error('Invalid regex pattern:', patternAttr);
    }
  }

  // 5. Duplicate detection
  const allowDuplicates = this.hasAttribute('allow-duplicates');
  if (!allowDuplicates) {
    const isDuplicate = this.items.some(item => 
      item.id !== itemState.id && 
      item.value.toLowerCase() === value.toLowerCase() && 
      !item.deleted
    );
    if (isDuplicate) {
      return 'This value already exists.';
    }
  }

  return null;
}
```

**Validation Order**:
1. **Empty/Whitespace**: Always checked first
2. **Length Constraints**: Minlength, then maxlength
3. **Pattern**: Regex validation (anchored to full value with `^...$`)
4. **Duplicates**: Only checked if not allowing duplicates

**Attributes Checked**:
- `minlength`: Minimum character count
- `maxlength`: Maximum character count
- `pattern`: Regex pattern (automatically anchored)
- `allow-duplicates`: Boolean toggle for duplicate rejection

**Return Value**:
- Returns error message string if validation fails
- Returns `null` if all checks pass

#### commitInputValue() Integration

The `commitInputValue()` method always calls `validateItemValue()` on every input event (including paste):

```typescript
const error = this.validateItemValue(value, itemState);
if (error) {
  // Create/update error display
  const errorId = `ckpa-error-${itemState.id}`;
  const errorDiv = itemRow.querySelector(`#${errorId}`) || 
                   document.createElement('div');
  errorDiv.setAttribute('data-error', '');
  errorDiv.id = errorId;
  errorDiv.className = 'ck-primitive-array__error has-error';
  errorDiv.textContent = error;
  itemRow.appendChild(errorDiv);

  // Set accessibility attributes
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', errorId);
  input.classList.add('has-error');
  itemRow.classList.add('has-error');
} else {
  // Clear validation errors
  const errorDiv = itemRow.querySelector('[data-error]');
  if (errorDiv) errorDiv.remove();
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  input.classList.remove('has-error');
  itemRow.classList.remove('has-error');
}
```

**Error Display**:
- `[data-error]` div with error message text and stable id
- `aria-invalid="true"` on invalid inputs
- `aria-describedby` links input to its error element
- `.has-error` class on input, item row, and error element
- Error is rendered inside the row below the input controls

### List-Level Validation

#### validateListConstraints() Method

Validates list-level constraints after state changes:

```typescript
private validateListConstraints(): void {
  const activeItems = this.items.filter(item => !item.deleted);
  
  // 1. Required constraint
  const isRequired = this.hasAttribute('required');
  if (isRequired && activeItems.length === 0) {
    this.showListError('[data-required-error]', 'At least one item is required.');
  } else {
    this.hideListError('[data-required-error]');
  }

  // 2. Minimum count constraint
  const minAttr = this.getAttribute('min');
  if (minAttr) {
    const min = parseInt(minAttr, 10);
    if (activeItems.length < min) {
      this.showListError('[data-min-error]', 
        `Must have at least ${min} items.`);
    } else {
      this.hideListError('[data-min-error]');
    }
  }

  // 3. Maximum count constraint
  const maxAttr = this.getAttribute('max');
  if (maxAttr) {
    const max = parseInt(maxAttr, 10);
    if (activeItems.length > max) {
      this.showListError('[data-max-error]', 
        `Cannot have more than ${max} items.`);
    } else {
      this.hideListError('[data-max-error]');
    }
    
    // Disable add button at max
    if (this.addButton) {
      this.addButton.disabled = activeItems.length >= max;
    }
  }
}
```

**Constraints Checked**:
- `required`: At least one active item
- `min`: Minimum number of active items
- `max`: Maximum number of active items (disables add button)

**When Called**:
- `addItem()` - after adding new item
- Delete button handler - after soft delete toggle
- Remove button handler - after hard remove
- `attributeChangedCallback()` - when attributes change

### Form Validation Integration

#### checkValidity() Method

```typescript
public checkValidity(): boolean {
  // 1. Check required constraint
  if (this.hasAttribute('required')) {
    const activeItems = this.items.filter(item => !item.deleted);
    if (activeItems.length === 0) return false;
  }

  // 2. Check min constraint
  const minAttr = this.getAttribute('min');
  if (minAttr) {
    const min = parseInt(minAttr, 10);
    const activeItems = this.items.filter(item => !item.deleted);
    if (activeItems.length < min) return false;
  }

  // 3. Check max constraint
  const maxAttr = this.getAttribute('max');
  if (maxAttr) {
    const max = parseInt(maxAttr, 10);
    const activeItems = this.items.filter(item => !item.deleted);
    if (activeItems.length > max) return false;
  }

  // 4. Check individual item validation
  for (const itemState of this.items) {
    if (!itemState.deleted) {
      const error = this.validateItemValue(itemState.value, itemState);
      if (error) return false;
    }
  }

  return true;
}
```

**Purpose**: Called by parent form before submission to verify all constraints

#### attachFormValidation() Method

```typescript
private attachFormValidation(): void {
  const form = this.closest('form');
  if (!form) return;

  // Prevent duplicate listener attachment
  const key = '__ckpaValidationAttached';
  if ((form as any)[key]) return;
  (form as any)[key] = true;

  form.addEventListener('submit', (e: SubmitEvent) => {
    if (!this.checkValidity()) {
      e.preventDefault();
    }
  });
}
```

**Design**:
- Uses flag on form object to prevent duplicate listeners
- Called from `connectedCallback()`
- Only attaches if component is inside a form

### Accessibility Support

#### ARIA Attributes

```typescript
// aria-invalid on items
input.setAttribute('aria-invalid', 'true');

// aria-label with dynamic index + value
input.setAttribute('aria-label', `Item 1: ${input.value}`);
```

**Screen Reader Announcements**:
- Invalid state announced via `aria-invalid`
- Error message available in DOM
- Item context via index-aware aria-labels
- Live region announces add/delete/restore/remove and validation errors

### Error Message Styling

Applications can style validation errors:

```css
/* Item with error */
.ck-primitive-array__item.has-error input {
  border-color: #d32f2f;
  background-color: #ffebee;
}

/* Error message display */
.ck-primitive-array__item [data-error] {
  display: block;
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* List-level error messages */
[data-required-error],
[data-min-error],
[data-max-error] {
  color: #d32f2f;
  margin: 0.5rem 0;
}
```

### Test Coverage

Validation system has 26 tests covering:
- Empty and whitespace rejection (5 tests)
- Duplicate detection (6 tests)
- Length constraints (6 tests)
- Pattern validation (6 tests)
- Required attribute (6 tests)
- Min/max item count (6 tests)

All tests verify:
- ✅ Error messages display
- ✅ aria-invalid attributes set
- ✅ CSS classes applied
- ✅ Form submission prevented
- ✅ Error clearing on valid input
- ✅ Dynamic constraint behavior

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
