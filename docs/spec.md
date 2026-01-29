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
| `readonly`| boolean| –       | When present, disables the Add button |
| `disabled`| boolean| –       | When present, disables the Add button |

### Properties

#### `name: string`
- **Getter**: Returns the `name` attribute value or "World" if not set
- **Setter**: Sets the `name` attribute

#### `color: string`
- **Getter**: Returns the `color` attribute value or "#333" if not set
- **Setter**: Sets the `color` attribute

#### `items: { id: string; value: string; deleted: boolean }[]`
- **Getter**: Returns internal item state objects with stable `id`, `value`, and `deleted` flags
- **Setter**: Accepts an array of primitives or item-like objects and serializes their values to the `items` attribute JSON

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

### Methods

#### `addItem(value?: string): void`
- **Public** method to programmatically add an item
- **`value`** (optional): The initial value for the new item. Defaults to `''` if omitted.
- Creates a new row with a text input pre-filled with the given value
- The new input receives focus automatically
- A `change` CustomEvent is dispatched with `detail.items` containing the updated array

### Add Button Behavior

The Add button calls `addItem()` with no argument (empty value):

1. **New Item**: Creates a row with a text input (empty by default, or pre-filled if `addItem(value)` is called)
2. **Focus**: The new input receives focus automatically
3. **State**: `el.items` reflects the new item
4. **Event**: A `change` CustomEvent is dispatched with `detail.items` containing the updated array
5. **Readonly/Disabled**: The Add button is disabled when the `readonly` or `disabled` attribute is present

### Keyboard Interaction

#### Enter Key in Item Input

When the user presses **Enter** while focused on an item input:

1. **Default Behavior**: Calls `addItem()` to create a new empty item
2. **Focus Management**: After adding, focus moves to the Add button
3. **Readonly Respect**: If `readonly` attribute is present, Enter key does nothing
4. **Event Dispatch**: A `change` CustomEvent is dispatched (via `addItem()`)
5. **Value Preservation**: The original input's value is preserved in state

**Example Usage**:
```javascript
// User types in input, then presses Enter
// → New empty item added below
// → Focus moves to Add button
// → Original input keeps its typed value
```

### Inline Edit (Phase 2.1)

Each item's text input supports inline editing with the following features:

#### State Updates
- **Real-time**: State updates on every keystroke (input event)
- **Identity Preservation**: Item `id` remains stable across edits
- **Reactivity**: Changes trigger `change` CustomEvent with updated `items` array

#### Change Events
Every input keystroke dispatches a `change` CustomEvent:
```javascript
el.addEventListener('change', (e) => {
  console.log('Items updated:', e.detail.items);
});
```

**Event Details**:
- **Type**: `CustomEvent`
- **Bubbles**: `true`
- **Detail**: `{ items: Array<{ id, value, deleted }> }`
- **Frequency**: Dispatched on every keystroke

#### Form Integration (Hidden Inputs)

When the `name` attribute is set, each item creates a hidden input for form submission:

```html
<ck-primitive-array name="tags" items='["a","b"]'></ck-primitive-array>

<!-- Renders hidden inputs: -->
<input type="hidden" name="tags[]" value="a" />
<input type="hidden" name="tags[]" value="b" />
```

**Behavior**:
- Hidden input created only if `name` attribute present
- Hidden input name: `{name}[]` (array notation for server-side)
- Hidden input value updates in sync with text input
- Enables standard HTML form submission

#### Accessibility (ARIA)

Each input has a dynamic ARIA label:
```html
<input type="text" aria-label="Item: apple" value="apple" />
```

**ARIA Updates**:
- Initial label: `"Item: {value}"`
- Updates on every keystroke to reflect current value
- Provides context for screen readers

#### Soft-Delete Support

Items with `deleted: true` have disabled inputs:
```javascript
itemState.deleted = true; // Input becomes disabled
```

**Behavior**:
- `input.disabled = true` when `itemState.deleted === true`
- Prevents editing of soft-deleted items
- Visual indicator (grayed out, browser-default disabled styling)

#### Validation

Empty values trigger validation error indicators:

**Visual Indicators**:
- `aria-invalid="true"` attribute on input
- `.has-error` CSS class on item row

**Validation Logic**:
```javascript
if (input.value === '') {
  input.setAttribute('aria-invalid', 'true');
  itemRow.classList.add('has-error');
} else {
  input.removeAttribute('aria-invalid');
  itemRow.classList.remove('has-error');
}
```

**Use Cases**:
- Form validation styling
- Accessibility announcements
- Custom error messages via CSS

### Soft Delete & Undo (Phase 2.2 & 2.3)

The component supports soft-deletion of items, allowing users to mark items as deleted without permanently removing them. Deleted items can be restored via an undo operation.

#### Delete Button Behavior

Each item row contains a delete button that toggles between delete and undo states:

```html
<!-- Active item -->
<button type="button" data-action="delete" aria-pressed="false">Delete</button>

<!-- Soft-deleted item -->
<button type="button" data-action="delete" aria-pressed="true">Undo</button>
```

**Delete Operation (2.2)**:
1. Click "Delete" button
2. `itemState.deleted` becomes `true`
3. Button text changes to "Undo"
4. Button `aria-pressed` becomes `"true"`
5. Input becomes disabled (`input.disabled = true`)
6. Row gains `part="item deleted"` attribute
7. Hidden input name changes to `deleted-{name}[]`
8. Focus remains on button (now showing "Undo")
9. `change` event dispatches with separate `active` and `deleted` arrays

**Undo Operation (2.3)**:
1. Click "Undo" button
2. `itemState.deleted` becomes `false`
3. Button text changes to "Delete"
4. Button `aria-pressed` becomes `"false"`
5. Input becomes enabled (`input.disabled = false`)
6. Row has `part="item"` attribute
7. Hidden input name changes back to `{name}[]`
8. Focus remains on button (now showing "Delete")
9. `change` event dispatches with item in `active` array

#### Change Event Structure

Soft delete/undo operations dispatch enhanced `change` events:

```javascript
el.addEventListener('change', (e) => {
  console.log('All items:', e.detail.items);       // All items
  console.log('Active items:', e.detail.active);   // Only active items
  console.log('Deleted items:', e.detail.deleted); // Only soft-deleted items
});
```

**Event Details**:
- **Type**: `CustomEvent`
- **Bubbles**: `true`
- **Detail**:
  - `items`: Full array of all items (active + deleted)
  - `active`: Array of items where `deleted === false`
  - `deleted`: Array of items where `deleted === true`

#### Visual Styling

Deleted items receive styling hooks via the `part` attribute:

```css
/* Style deleted items */
ck-primitive-array::part(deleted) {
  opacity: 0.5;
  text-decoration: line-through;
}
```

#### Form Integration

Soft-deleted items use a separate hidden input namespace:

```html
<!-- Active item -->
<input type="hidden" name="tags[]" value="active item" />

<!-- Deleted item -->
<input type="hidden" name="deleted-tags[]" value="deleted item" />
```

This allows server-side code to differentiate between active and soft-deleted items.

#### Accessibility

- **aria-pressed**: Toggle button uses `aria-pressed` to indicate delete state
  - `"false"` = Active item (showing "Delete")
  - `"true"` = Deleted item (showing "Undo")
- **Disabled inputs**: Soft-deleted items have `input.disabled = true`
- **Focus management**: Focus remains on the button after toggle

---

### Hard Remove (Phase 2.4)

The component supports permanent deletion of items via the Remove button ("X"). Unlike soft delete, hard remove permanently removes the item from state and DOM with no undo capability.

#### Remove Button Behavior

Each item row contains a remove button for permanent deletion:

```html
<!-- Remove button in each row -->
<button type="button" data-action="remove">X</button>
```

**Remove Operation (2.4)**:
1. Click "X" button (remove button)
2. Item permanently removed from `itemsState` array
3. Row removed from DOM
4. Hidden input (if exists) removed from DOM
5. Remaining items' ARIA labels updated (re-indexed)
6. Focus moves to Add button
7. `change` event dispatches with updated arrays

#### Permanent Deletion

Hard remove permanently deletes items:

```javascript
// Before removal (3 items)
el.items = [
  { id: 'item-1', value: 'a', deleted: false },
  { id: 'item-2', value: 'b', deleted: false },
  { id: 'item-3', value: 'c', deleted: false }
];

// Remove middle item (click X button on "b")
// After removal (2 items)
el.items = [
  { id: 'item-1', value: 'a', deleted: false },
  { id: 'item-3', value: 'c', deleted: false }
];
// Item "b" is gone permanently - no undo
```

#### Change Event on Remove

Hard remove dispatches standard change events:

```javascript
el.addEventListener('change', (e) => {
  console.log('Total items:', e.detail.items.length);       // 2 (was 3)
  console.log('Active items:', e.detail.active.length);     // 2
  console.log('Deleted items:', e.detail.deleted.length);   // 0
});
```

**Event Details**:
- **Type**: `CustomEvent`
- **Bubbles**: `true`
- **Detail**:
  - `items`: Updated array (removed item excluded)
  - `active`: Active items only (removed item excluded)
  - `deleted`: Soft-deleted items only

#### ARIA Label Re-indexing

After removal, remaining items' ARIA labels are updated:

```html
<!-- Before removal (3 items) -->
<input type="text" value="a" aria-label="Item: a" />
<input type="text" value="b" aria-label="Item: b" />
<input type="text" value="c" aria-label="Item: c" />

<!-- After removing "b" (2 items) -->
<input type="text" value="a" aria-label="Item: a" />
<input type="text" value="c" aria-label="Item: c" />
```

ARIA labels stay synchronized with current item values for screen reader accessibility.

#### Focus Management

After removal, focus moves to the Add button:

```javascript
// User clicks Remove button → focus moves to Add button
removeButton.click(); // → Add button receives focus
```

This allows keyboard users to immediately add a replacement item if desired.

#### Form Integration

Hidden inputs are removed when items are removed:

```html
<!-- Before removal -->
<input type="hidden" name="tags[]" value="a" />
<input type="hidden" name="tags[]" value="b" />
<input type="hidden" name="tags[]" value="c" />

<!-- After removing "b" -->
<input type="hidden" name="tags[]" value="a" />
<input type="hidden" name="tags[]" value="c" />
```

The hidden input for the removed item is removed from the DOM, ensuring form submissions don't include deleted items.

#### Soft Delete vs Hard Remove

| Feature | Soft Delete | Hard Remove |
|---------|-------------|-------------|
| **Trigger** | Delete button | X button |
| **Reversible** | Yes (Undo button) | No |
| **DOM** | Row remains (styled as deleted) | Row removed |
| **State** | `deleted: true` | Item removed from array |
| **Hidden Input** | Renamed to `deleted-{name}[]` | Removed entirely |
| **Focus** | Stays on toggle button | Moves to Add button |

#### Accessibility

- **Focus management**: Focus moves to Add button (consistent with Enter key)
- **ARIA labels**: Labels updated after removal to reflect new indices
- **Keyboard navigation**: Add button receives focus for quick replacement
- **Screen readers**: Updated ARIA labels announced on focus

### Lifecycle Callbacks

#### `constructor()`
- Creates shadow root with mode 'open'
- Adopts constructable stylesheet if supported

#### `connectedCallback()`
- Invoked when element is inserted into DOM
- Triggers initial render

#### `attributeChangedCallback(name, oldValue, newValue)`
- Observes: `name`, `color`, `items`, `readonly`, `disabled`
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
    <div class="ck-primitive-array__item" role="listitem">
      <input type="text" value="${item.value}" />
      <button type="button" data-action="delete">Delete</button>
      <button type="button" data-action="remove">X</button>
    </div>
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

23. ✅ Add button creates new item with empty input (1.5.1)
24. ✅ New item input receives focus (1.5.2)
25. ✅ Items property updated after add (1.5.3)
26. ✅ Change event dispatched on add (1.5.4)
27. ✅ Multiple adds work sequentially (1.5.5)
28. ✅ Add button disabled when readonly (1.5.6)
29. ✅ Add button disabled when disabled (1.5.7)

30. ✅ Adding new item preserves existing input values (1.5.8)
31. ✅ addItem() with value uses that value (1.5.9)
32. ✅ addItem() without value defaults to empty string (1.5.10)
33. ✅ addItem() with value dispatches change event with that value (1.5.11)

34. ✅ Enter in empty input adds item (1.6.1)
35. ✅ Enter in filled input adds item and preserves original value (1.6.2)
36. ✅ Focus moves to Add button after Enter adds item (1.6.3)
37. ✅ Enter is no-op when readonly (1.6.4)
38. ✅ Change event dispatched on Enter add (1.6.5)

39. ✅ Input value change updates state (2.1.1)
40. ✅ Change event on edit (2.1.2)
41. ✅ Edit triggers on every keystroke (2.1.3)
42. ✅ Edit updates hidden inputs (2.1.4)
43. ✅ Cannot edit soft-deleted item (2.1.5)
44. ✅ Edit preserves item identity (2.1.6)
45. ✅ Edit updates aria-label (2.1.7)
46. ✅ Empty edit triggers validation (2.1.8)

48. ✅ Delete button marks item deleted (2.2.1)
49. ✅ Deleted item shows undo button (2.2.2)
50. ✅ Deleted item has visual styling (2.2.3)
51. ✅ Focus moves to undo button (2.2.4)
52. ✅ Change event on soft delete (2.2.5)
53. ✅ Hidden input moves to deleted-name (2.2.6)
54. ✅ aria-pressed updates on delete (2.2.7)

55. ✅ Undo restores item to active (2.3.1)
56. ✅ Restored item is editable (2.3.2)
57. ✅ Focus moves to delete button (2.3.3)
58. ✅ Change event on undo (2.3.4)
59. ✅ Hidden input moves back to name (2.3.5)
60. ✅ aria-pressed updates on undo (2.3.6)

61. ✅ Remove button deletes item permanently (2.4.1)
62. ✅ Row is removed from DOM (2.4.2)
63. ✅ Focus moves to Add button (2.4.3)
64. ✅ Change event on remove (2.4.4)
65. ✅ Hidden input is removed (2.4.5)
66. ✅ Other items' indices update (2.4.6)

**Total**: 72 tests passing
5. ✅ Render content in shadow DOM
6. ✅ Attribute change updates
7. ✅ Observed attributes list
8. ✅ Color attribute handling

### New Test Cases (Completed 2026-01-28)

9. ✅ Custom element definition verification (1.1.1)
10. ✅ HTML creation verification (1.1.2)
11. ✅ JS creation verification (1.1.3)
