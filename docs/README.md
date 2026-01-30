# CkPrimitiveArray Documentation

## User Guide

### What is CkPrimitiveArray?

`CkPrimitiveArray` is a reusable web component for editing a list of primitive values (strings, numbers, booleans). It provides add/remove controls, soft delete/undo, validation, form participation via hidden inputs, and built-in accessibility. The component also renders a header that uses the `name` and `color` attributes.

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
    <!-- Empty list -->
    <ck-primitive-array></ck-primitive-array>
    
    <!-- Declarative items -->
    <ck-primitive-array items='["apple", "banana"]'></ck-primitive-array>
    
    <!-- Form-friendly list (name also used for header text) -->
    <ck-primitive-array name="tags" items='["alpha", "beta"]'></ck-primitive-array>
    
    <!-- Custom header color -->
    <ck-primitive-array name="tasks" color="#0066cc" items='["Plan", "Build"]'></ck-primitive-array>
</body>
</html>
```

### Configuration

#### Attributes

##### `name`
- **Type**: String
- **Default**: "World"
- **Description**: Used for the header text and as the name for active hidden inputs (`name[]`)

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

**Error Handling**: Invalid JSON (or non-array JSON) logs an error and resets the list to empty. JSON `null` and empty string yield an empty list without logging errors.

##### `readonly`
- **Type**: Boolean attribute
- **Description**: When present, inputs become read-only (still focusable) and Add/Delete/Remove controls are disabled

```html
<ck-primitive-array readonly items='["locked"]'></ck-primitive-array>
```

##### `disabled`
- **Type**: Boolean attribute
- **Description**: When present, inputs and Add/Delete/Remove controls are disabled

```html
<ck-primitive-array disabled items='["locked"]'></ck-primitive-array>
```

##### State Attributes Summary
- **Readonly**: Inputs are read-only (focusable), controls disabled, Enter/addItem are no-ops
- **Disabled**: Inputs are disabled, controls disabled, Enter/addItem are no-ops, form values still submit via hidden inputs
- **Dynamic**: Toggling either attribute updates controls immediately

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

**Note**: `addItem()` is a no-op when `readonly` or `disabled` is present.

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
- ❌ Does nothing if `readonly` or `disabled` attribute is present

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

#### Ctrl/Cmd+Enter Form Submission

When focused on an item input field, pressing **Ctrl+Enter** (Windows/Linux) or **Cmd+Enter** (macOS) submits the closest form:

```
User edits input → Presses Ctrl/Cmd+Enter → Current value saved → Form submits
```

**Behavior**:
- ✅ Submits the nearest `<form>` using `requestSubmit()`
- ✅ Saves the focused input value before submission
- ✅ Works even when `readonly` is present
- ❌ Does nothing when the component is not inside a form

**Example**:
```html
<form>
  <ck-primitive-array name="tags" items='["alpha"]'></ck-primitive-array>
  <button type="submit">Submit</button>
</form>
```

#### Tab Navigation, Button Activation, and Escape

**Keyboard Behaviors**:
- **Tab / Shift+Tab**: Moves between Add → Input → Delete → Remove → next row (Shift+Tab reverses). Tab on the last control exits the component.
- **Enter / Space on buttons**: Activates the focused button (Add, Delete/Undo, Remove).
- **Escape on input**: Moves focus to the Add button.

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

Hidden inputs are automatically created in the light DOM and synchronized with visible inputs, enabling standard HTML form submission.

##### Tracking Deleted Items

Use `deleted-name` to capture soft-deleted items in form submission:

```html
<form>
  <ck-primitive-array 
    name="active" 
    deleted-name="removed" 
    items='["item1","item2"]'>
  </ck-primitive-array>
</form>
```

**Form Data (after soft-deleting item1)**:
```
active[]=item2
removed[]=item1
```

This enables server-side logic to handle deleted items separately.

##### Input Synchronization

Hidden inputs automatically synchronize with component state across all operations:

**Synchronization Triggers**:
- ✅ **Initial Load**: When `items` attribute is set initially
- ✅ **Add**: When new item is added via Add button or `addItem()`
- ✅ **Edit**: When item value is changed via inline editing
- ✅ **Soft Delete**: When item is marked as deleted (transitions to `deleted-name`)
- ✅ **Undo**: When deleted item is restored (transitions back to `name`)
- ✅ **Hard Remove**: When item is permanently removed (input deleted)
- ✅ **Attribute Update**: When `items` attribute is re-parsed

**Attribute Updates**:
- Updating the `items` attribute replaces all existing items (including edits and soft-deletes)
- A `change` event is dispatched after the new items render

**Performance**:
- Hidden inputs are **reused** on edits (no DOM replacement)
- Only creates/removes inputs when necessary
- Efficient Map-based tracking

**Example - Dynamic Updates**:
```javascript
const el = document.querySelector('ck-primitive-array');

// Change items attribute → hidden inputs automatically updated
el.setAttribute('items', '["new1","new2","new3"]');

// Add item → new hidden input created
el.addItem('new4');

// Edit item → hidden input value synchronized
// (user types in visible input → hidden input updates automatically)
```

**Form Submission Always Reflects Current State**:
Hidden inputs ensure that form submissions always include the current component state, regardless of how items were added, edited, or deleted.

#### Validation

The component provides comprehensive validation covering item-level and list-level constraints with full accessibility support.

**Live Validation Timing**:
- Validation runs on every input event (keystroke or paste)
- Errors appear immediately on invalid input
- Errors clear immediately on correction
- Initial items are validated on render, so preloaded invalid values display errors immediately

##### Item-Level Validation

Each item value is validated against multiple constraints:

**1. Empty & Whitespace Rejection**

By default, empty or whitespace-only values are rejected:
```html
<ck-primitive-array name="items" items='[]'></ck-primitive-array>
```
- Empty inputs show validation error
- `aria-invalid="true"` for accessibility
- Parent `.ck-primitive-array__item` gets `.has-error` class

**2. Duplicate Detection**

By default, duplicate values are rejected:
```html
<ck-primitive-array name="items" items='["apple","banana"]'></ck-primitive-array>
<!-- Editing "banana" to "apple" shows error -->
```

Allow duplicates with the `allow-duplicates` attribute:
```html
<ck-primitive-array 
  allow-duplicates 
  name="items" 
  items='["apple","apple"]'>
</ck-primitive-array>
```

**3. Minimum Length Constraint**

Set minimum character length with `minlength`:
```html
<ck-primitive-array 
  minlength="3" 
  name="items" 
  items='["ab"]'>
</ck-primitive-array>
<!-- Values shorter than 3 characters show error -->
```

**4. Maximum Length Constraint**

Set maximum character length with `maxlength`:
```html
<ck-primitive-array 
  maxlength="10" 
  name="items" 
  items='["this is too long"]'>
</ck-primitive-array>
<!-- Values longer than 10 characters show error -->
```

**5. Pattern Matching**

Validate items against a regex pattern with `pattern`:
```html
<!-- Email pattern -->
<ck-primitive-array 
  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}" 
  name="emails">
</ck-primitive-array>

<!-- Hex color pattern (3 or 6 digits) -->
<ck-primitive-array 
  pattern="[0-9a-f]{3}([0-9a-f]{3})?" 
  name="colors">
</ck-primitive-array>
```

##### List-Level Validation

Control the overall list with list-level constraints:

**1. Required Attribute**

Mark the list as required (must have at least one active item):
```html
<ck-primitive-array 
  required 
  name="items" 
  items='[]'>
</ck-primitive-array>
<!-- Shows error if list is empty -->
```

**2. Minimum Item Count**

Require a minimum number of active items with `min`:
```html
<ck-primitive-array 
  min="2" 
  name="items" 
  items='["item1"]'>
</ck-primitive-array>
<!-- Shows error if fewer than 2 active items -->
```

**3. Maximum Item Count**

Limit the maximum number of active items with `max`:
```html
<ck-primitive-array 
  max="5" 
  name="items" 
  items='["item1","item2","item3"]'>
</ck-primitive-array>
<!-- Shows error if more than 5 active items -->
<!-- Add button disables at max count -->
```

##### Combining Constraints

Use multiple validation attributes together:
```html
<ck-primitive-array 
  required
  min="1"
  max="10"
  minlength="2"
  maxlength="50"
  pattern="^[a-z0-9\s]+$"
  allow-duplicates="false"
  name="tags">
</ck-primitive-array>
```

##### Styling Validation Errors

Style validation errors with CSS:
```css
/* Item with error */
.ck-primitive-array__item.has-error input {
  border-color: #d32f2f;
  background-color: #ffebee;
}

/* Error message display */
.ck-primitive-array__item [data-error] {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Error element can also target the explicit class */
.ck-primitive-array__error.has-error {
  color: #d32f2f;
}
```

##### Checking Validity in JavaScript

Use `checkValidity()` before form submission:
```javascript
const element = document.querySelector('ck-primitive-array');

if (!element.checkValidity()) {
  alert('Please fix validation errors');
  return;
}

// All constraints satisfied - safe to submit
```

The component automatically prevents form submission when validation fails. No additional code needed.

#### Accessibility

Each input has a descriptive ARIA label that includes index and value:
```html
<!-- First item "apple" -->
<input type="text" aria-label="Item 1: apple" value="apple" />

<!-- Second item "orange" -->
<input type="text" aria-label="Item 2: orange" value="orange" />
```

Buttons include matching labels (Delete/Restore/Remove) and update on edit or re-index.

When an input is invalid, it is linked to its error message via `aria-describedby`, pointing at the specific error element for that row. The list also sets `aria-required` when `required` is present.

An `aria-live="polite"` region announces add/delete/restore/remove actions and validation errors.

#### Styling with CSS Parts

The component exposes styling hooks via `::part`:

- `list` — list container
- `row` — item row
- `deleted` — applied to soft-deleted rows (with `row`)
- `input` — item input
- `delete-button` — soft delete/undo button
- `remove-button` — hard remove button

```css
ck-primitive-array::part(row) {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.5rem;
}

ck-primitive-array::part(input) {
  border-color: #2563eb;
}
```

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

#### Example 5: Soft Delete & Undo

```html
<!-- Items with delete/undo functionality -->
<ck-primitive-array 
  name="tasks"
  items='["Complete report", "Review code", "Deploy"]'>
</ck-primitive-array>

<script>
  const taskList = document.querySelector('ck-primitive-array');
  
  // Listen for changes
  taskList.addEventListener('change', (e) => {
    console.log('Active tasks:', e.detail.active.length);
    console.log('Deleted tasks:', e.detail.deleted.length);
    
    // Could submit to server, update UI, etc.
    e.detail.active.forEach(item => {
      console.log('✓', item.value);
    });
    e.detail.deleted.forEach(item => {
      console.log('✗', item.value);
    });
  });
</script>
```

**Soft Delete Features**:
- Click "Delete" to soft-delete an item (marks as deleted, disables input)
- Click "Undo" to restore a deleted item
- Deleted items are still in the DOM but visually distinguished
- Change events include separate `active` and `deleted` arrays
- Hidden form inputs use `deleted-{name}[]` namespace for deleted items

---

#### Example 6: Hard Remove (Permanent Deletion)

For permanent removal of items, use the Remove button ("X"):

```html
<ck-primitive-array
  name="fruits"
  items='["apple", "banana", "cherry"]'>
</ck-primitive-array>

<script>
  const fruitList = document.querySelector('ck-primitive-array');

  // Listen for changes
  fruitList.addEventListener('change', (e) => {
    console.log('Total items:', e.detail.items.length);
    // Items will permanently exclude removed items
    e.detail.items.forEach(item => {
      console.log('-', item.value);
    });
  });
</script>
```

**Hard Remove Features**:
- **Permanent**: Removed items cannot be undone
- **DOM Cleanup**: Row and hidden inputs removed from DOM
- **State Cleanup**: Item removed from `items` array
- **ARIA Updates**: Remaining items' labels re-indexed
- **Focus Management**: Focus moves to Add button after removal

**Soft Delete vs Hard Remove**:

| Feature | Soft Delete (Delete) | Hard Remove (X) |
|---------|---------------------|-----------------|
| **Reversible** | ✅ Yes (Undo) | ❌ No |
| **DOM** | Row stays | Row removed |
| **State** | `deleted: true` | Removed |
| **Form** | `deleted-{name}[]` | Not sent |
| **Use Case** | Review later | Immediate discard |

**When to use each**:
- **Soft Delete**: User might want to undo, data should be reviewed before final submission
- **Hard Remove**: Item was added by mistake, permanent removal is desired immediately

---

### Change Events

The component dispatches `change` events whenever items are added, edited, deleted, or removed.

#### Event Structure (v2.5+)

```javascript
event.detail = {
  items: [     // Full item objects with metadata
    { id: 'item-1', value: 'apple', deleted: false },
    { id: 'item-2', value: 'banana', deleted: true }
  ],
  active: ['apple'],    // ⚠️ String array (v2.5 breaking change)
  deleted: ['banana']   // ⚠️ String array (v2.5 breaking change)
}
```

**Breaking Change in v2.5**: `active` and `deleted` now contain **string values** instead of objects.

#### Migration from v2.4

**Before (v2.4)**:
```javascript
taskList.addEventListener('change', (e) => {
  const firstActive = e.detail.active[0].value;  // ❌ No longer works
  const firstDeleted = e.detail.deleted[0].value; // ❌ No longer works
});
```

**After (v2.5)**:
```javascript
taskList.addEventListener('change', (e) => {
  const firstActive = e.detail.active[0];   // ✅ Direct string access
  const firstDeleted = e.detail.deleted[0]; // ✅ Direct string access
});
```

#### Usage Examples

**Basic Event Listening**:
```javascript
const el = document.querySelector('ck-primitive-array');

el.addEventListener('change', (e) => {
  console.log('Active items:', e.detail.active);    // ['a', 'b', 'c']
  console.log('Deleted items:', e.detail.deleted);  // ['x', 'y']
  console.log('Total items:', e.detail.items.length);
});
```

**Form Submission with Separation**:
```javascript
const taskList = document.querySelector('ck-primitive-array');

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();

  const event = new CustomEvent('form-submit');
  taskList.addEventListener('change', (changeEvent) => {
    fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        completed: changeEvent.detail.active,
        archived: changeEvent.detail.deleted
      })
    });
  }, { once: true });
});
```

**React Integration**:
```jsx
function TaskManager() {
  const handleChange = (e) => {
    setActiveTasks(e.detail.active);
    setDeletedTasks(e.detail.deleted);
  };

  return (
    <ck-primitive-array
      items={JSON.stringify(initialTasks)}
      ref={(el) => el?.addEventListener('change', handleChange)}
    />
  );
}
```

**Review Workflow**:
```javascript
const itemList = document.querySelector('ck-primitive-array');

itemList.addEventListener('change', (e) => {
  // Show review panel if there are deletions
  if (e.detail.deleted.length > 0) {
    showReviewPanel(e.detail.deleted);
  }

  // Update counters
  document.getElementById('active-count').textContent = e.detail.active.length;
  document.getElementById('deleted-count').textContent = e.detail.deleted.length;
});
```

#### Event Triggers

Change events fire on:
- ✅ Adding items (via Add button or `addItem()`)
- ✅ Editing items (inline input changes)
- ✅ Soft deleting items (Delete button)
- ✅ Undoing deletions (Undo button)
- ✅ Hard removing items (X button)

#### Event Properties

| Property | Type | Description |
|----------|------|-------------|
| `bubbles` | `true` | Event bubbles up through DOM |
| `detail.items` | `Array<{id, value, deleted}>` | All items with full metadata |
| `detail.active` | `string[]` | Values of non-deleted items |
| `detail.deleted` | `string[]` | Values of soft-deleted items |

#### Timing Guarantees

Change events fire **after** DOM updates are complete:
```javascript
el.addEventListener('change', () => {
  // DOM is already updated
  const inputs = el.shadowRoot.querySelectorAll('input');
  console.log('Input count:', inputs.length); // Reflects current state
});
```

---

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

Accessibility features include:
- List semantics (`role="list"` / `role="listitem"`)
- Index-aware `aria-label`s for inputs and buttons
- `aria-invalid`, `aria-disabled`, `aria-readonly`, and `aria-required` states
- `aria-live="polite"` announcements for add/delete/restore/remove and validation errors
- Keyboard navigation with Tab/Shift+Tab, Enter/Space activation, and Escape focus management

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
