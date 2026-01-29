import {
  ckPrimitiveArraySheet,
  ckPrimitiveArrayCSS,
} from './ck-primitive-array.styles';

export class CkPrimitiveArray extends HTMLElement {
  private shadow: ShadowRoot;
  private container: HTMLDivElement | null = null;
  private messageElement: HTMLHeadingElement | null = null;
  private subtitleElement: HTMLParagraphElement | null = null;
  private controlsElement: HTMLDivElement | null = null;
  private addButton: HTMLButtonElement | null = null;
  private listElement: HTMLDivElement | null = null;
  private placeholderElement: HTMLParagraphElement | null = null;
  private boundAddHandler: ((e: Event) => void) | null = null;
  private itemsState: Array<{ id: string; value: string; deleted: boolean }> =
    [];
  private nextItemId = 0;
  private lastItemsAttribute: string | null = null;
  private fieldsContainer: HTMLDivElement | null = null;
  private hiddenInputsMap: Map<string, HTMLInputElement> = new Map();

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });

    // Adopt the constructable stylesheet when supported. We do this once per instance
    // but the underlying sheet was created once at module load time.
    const adopted = (
      this.shadow as unknown as ShadowRoot & {
        adoptedStyleSheets?: CSSStyleSheet[];
      }
    ).adoptedStyleSheets;
    if (ckPrimitiveArraySheet && adopted !== undefined) {
      (
        this.shadow as unknown as ShadowRoot & {
          adoptedStyleSheets: CSSStyleSheet[];
        }
      ).adoptedStyleSheets = [...adopted, ckPrimitiveArraySheet];
    }
  }

  connectedCallback() {
    this.ensureFieldsContainer();
    this.render();
  }

  disconnectedCallback() {
    // cleanup event listeners and references
    if (this.addButton && this.boundAddHandler) {
      this.addButton.removeEventListener('click', this.boundAddHandler);
    }
    this.boundAddHandler = null;
    this.container = null;
    this.messageElement = null;
    this.subtitleElement = null;
    this.controlsElement = null;
    this.addButton = null;
    this.listElement = null;
    this.placeholderElement = null;

    // Cleanup light DOM fields container
    if (this.fieldsContainer && this.fieldsContainer.parentNode) {
      this.fieldsContainer.parentNode.removeChild(this.fieldsContainer);
    }
    this.fieldsContainer = null;
    this.hiddenInputsMap.clear();
  }

  static get observedAttributes() {
    return ['name', 'color', 'items', 'readonly', 'disabled', 'deleted-name'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get name() {
    return this.getAttribute('name') || 'World';
  }

  set name(value: string) {
    this.setAttribute('name', value);
  }

  get color() {
    return this.getAttribute('color') || '#333';
  }

  set color(value: string) {
    this.setAttribute('color', value);
  }

  get items(): Array<{ id: string; value: string; deleted: boolean }> {
    return this.itemsState.map(item => ({ ...item }));
  }

  set items(
    value: Array<
      | string
      | number
      | boolean
      | { value?: string; id?: string; deleted?: boolean }
    >
  ) {
    const normalized = Array.isArray(value)
      ? value.map(item => {
          if (typeof item === 'object' && item !== null && 'value' in item) {
            return (item as { value?: string }).value ?? '';
          }
          return item as string | number | boolean;
        })
      : [];
    this.setAttribute('items', JSON.stringify(normalized));
  }

  private parseItemsAttribute(itemsAttr: string | null): string[] | null {
    if (!itemsAttr) return [];

    try {
      const parsed = JSON.parse(itemsAttr);
      if (!Array.isArray(parsed)) return [];

      // Filter to primitives only and coerce to strings
      return parsed
        .filter(item => {
          const type = typeof item;
          return type === 'string' || type === 'number' || type === 'boolean';
        })
        .map(String);
    } catch (error) {
      (globalThis as any).console?.error(
        'Failed to parse items attribute:',
        error
      );
      return null; // Return null to signal error
    }
  }

  private ensureFieldsContainer() {
    if (!this.fieldsContainer) {
      this.fieldsContainer = document.createElement('div');
      this.fieldsContainer.setAttribute('data-ckpa-fields', '');
      this.fieldsContainer.style.display = 'none';
      this.appendChild(this.fieldsContainer);
    }
  }

  private getHiddenInputName(itemState: { deleted: boolean }): string | null {
    const formName = this.getAttribute('name');
    const deletedName = this.getAttribute('deleted-name');

    if (itemState.deleted) {
      return deletedName ? `${deletedName}[]` : null;
    } else {
      return formName ? `${formName}[]` : null;
    }
  }

  private syncHiddenInputs() {
    this.ensureFieldsContainer();
    if (!this.fieldsContainer) return;

    const processedIds = new Set<string>();

    for (const itemState of this.itemsState) {
      const inputName = this.getHiddenInputName(itemState);

      if (inputName) {
        let input = this.hiddenInputsMap.get(itemState.id);
        if (!input) {
          input = document.createElement('input');
          input.type = 'hidden';
          input.setAttribute('data-item-id', itemState.id);
          this.fieldsContainer.appendChild(input);
          this.hiddenInputsMap.set(itemState.id, input);
        }
        input.name = inputName;
        input.value = itemState.value;
        processedIds.add(itemState.id);
      } else {
        // No name for this item - remove if exists
        const existingInput = this.hiddenInputsMap.get(itemState.id);
        if (existingInput) {
          existingInput.remove();
          this.hiddenInputsMap.delete(itemState.id);
        }
      }
    }

    // Remove inputs for items that no longer exist
    for (const [id, input] of this.hiddenInputsMap) {
      if (!processedIds.has(id) && !this.itemsState.find(i => i.id === id)) {
        input.remove();
        this.hiddenInputsMap.delete(id);
      }
    }
  }

  private syncItemsFromAttribute() {
    const itemsAttr = this.getAttribute('items');
    if (itemsAttr === this.lastItemsAttribute) return;

    const parsed = this.parseItemsAttribute(itemsAttr);
    if (parsed === null) return;

    this.lastItemsAttribute = itemsAttr;
    this.itemsState = parsed.map(value => ({
      id: this.createItemId(),
      value,
      deleted: false,
    }));
  }

  private commitInputValue(
    itemState: { id: string; value: string; deleted: boolean },
    input: HTMLInputElement,
    itemRow: HTMLDivElement,
    emitChange: boolean
  ) {
    if (itemState.value === input.value) {
      return;
    }

    itemState.value = input.value;

    // Update aria-label
    input.setAttribute('aria-label', `Item: ${input.value}`);

    // Update hidden input in light DOM
    this.syncHiddenInputs();

    // Validation: mark as invalid if empty
    if (input.value === '') {
      input.setAttribute('aria-invalid', 'true');
      itemRow.classList.add('has-error');
    } else {
      input.removeAttribute('aria-invalid');
      itemRow.classList.remove('has-error');
    }

    if (emitChange) {
      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          detail: { items: this.items },
        })
      );
    }
  }

  private createItemId() {
    this.nextItemId += 1;
    return `item-${this.nextItemId}`;
  }

  private render() {
    // If constructable stylesheets are not available, ensure a single fallback <style>
    // is injected per-shadow-root. We avoid creating different style content per instance
    // by keeping per-instance differences in CSS custom properties.
    if (!ckPrimitiveArraySheet) {
      // Only inject the fallback style once per shadow root
      if (
        !this.shadow.querySelector('style[data-ck-primitive-array-fallback]')
      ) {
        const style = document.createElement('style');
        style.setAttribute('data-ck-primitive-array-fallback', '');
        style.textContent = ckPrimitiveArrayCSS;
        this.shadow.appendChild(style);
      }
    }

    // Apply per-instance color via CSS custom property instead of embedding styles.
    this.style.setProperty('--ck-primitive-array-color', this.color);

    // Initialize DOM structure once per instance
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'ck-primitive-array';

      this.messageElement = document.createElement('h1');
      this.messageElement.className = 'ck-primitive-array__message';
      this.container.appendChild(this.messageElement);

      this.subtitleElement = document.createElement('p');
      this.subtitleElement.className = 'ck-primitive-array__subtitle';
      this.subtitleElement.textContent = 'Welcome to our Web Component Library';
      this.container.appendChild(this.subtitleElement);

      this.controlsElement = document.createElement('div');
      this.controlsElement.className = 'ck-primitive-array__controls';
      this.addButton = document.createElement('button');
      this.addButton.className = 'add-item';
      this.addButton.type = 'button';
      this.addButton.textContent = 'Add';
      this.controlsElement.appendChild(this.addButton);
      this.container.appendChild(this.controlsElement);

      this.listElement = document.createElement('div');
      this.listElement.className = 'ck-primitive-array__list';
      this.listElement.setAttribute('role', 'list');
      this.listElement.setAttribute('aria-label', 'items');

      this.placeholderElement = document.createElement('p');
      this.placeholderElement.className = 'ck-primitive-array__placeholder';
      this.placeholderElement.textContent = 'No items';
      this.listElement.appendChild(this.placeholderElement);

      this.container.appendChild(this.listElement);

      this.shadow.appendChild(this.container);

      // Wire up event handler
      this.boundAddHandler = () => {
        this.addItem();
      };
      this.addButton.addEventListener('click', this.boundAddHandler);
    }

    // Update dynamic content
    if (this.messageElement) {
      this.messageElement.textContent = `Hello, ${this.name}!`;
      (this.messageElement.style as CSSStyleDeclaration).color = this.color;
    }

    // Update add button disabled state based on readonly/disabled attributes
    if (this.addButton) {
      const isReadonly = this.hasAttribute('readonly');
      const isDisabled = this.hasAttribute('disabled');
      this.addButton.disabled = isReadonly || isDisabled;
    }

    // Render items from attribute
    if (this.listElement) {
      this.syncItemsFromAttribute();
      this.renderItems();
    }

    // Sync hidden inputs for form participation
    this.syncHiddenInputs();
  }

  private createItemRow(itemState: {
    id: string;
    value: string;
    deleted: boolean;
  }): HTMLDivElement {
    const itemRow = document.createElement('div');
    itemRow.className = 'ck-primitive-array__item';
    itemRow.setAttribute('role', 'listitem');
    itemRow.setAttribute('data-id', itemState.id);

    // Set part attribute for styling based on deleted state
    if (itemState.deleted) {
      itemRow.setAttribute('part', 'item deleted');
    } else {
      itemRow.setAttribute('part', 'item');
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'ck-primitive-array__input';
    input.value = itemState.value;

    // Set aria-label for accessibility
    input.setAttribute('aria-label', `Item: ${itemState.value}`);

    // Disable input if item is soft-deleted
    if (itemState.deleted) {
      input.disabled = true;
    }

    input.addEventListener('input', () => {
      this.commitInputValue(itemState, input, itemRow, true);
    });
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        // Ctrl+Enter or Cmd+Enter submits form
        if (e.ctrlKey || e.metaKey) {
          const form = this.closest('form');
          if (form) {
            this.commitInputValue(itemState, input, itemRow, true);
            form.requestSubmit();
          }
          return;
        }

        // Regular Enter adds item
        if (!this.hasAttribute('readonly')) {
          this.addItem();
          this.addButton?.focus();
        }
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'ck-primitive-array__delete';
    deleteButton.setAttribute('data-action', 'delete');
    deleteButton.setAttribute(
      'aria-pressed',
      itemState.deleted ? 'true' : 'false'
    );
    deleteButton.textContent = itemState.deleted ? 'Undo' : 'Delete';

    deleteButton.addEventListener('click', () => {
      itemState.deleted = !itemState.deleted;

      // Update button text and aria-pressed
      deleteButton.textContent = itemState.deleted ? 'Undo' : 'Delete';
      deleteButton.setAttribute(
        'aria-pressed',
        itemState.deleted ? 'true' : 'false'
      );

      // Update part attribute on row
      if (itemState.deleted) {
        itemRow.setAttribute('part', 'item deleted');
      } else {
        itemRow.setAttribute('part', 'item');
      }

      // Update input disabled state
      input.disabled = itemState.deleted;

      // Sync hidden inputs in light DOM
      this.syncHiddenInputs();

      // Focus the button after toggle
      deleteButton.focus();

      // Dispatch change event with separate active/deleted arrays
      const allItems = this.items;
      const activeItems = allItems
        .filter(item => !item.deleted)
        .map(item => item.value);
      const deletedItems = allItems
        .filter(item => item.deleted)
        .map(item => item.value);

      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          detail: {
            items: allItems,
            active: activeItems,
            deleted: deletedItems,
          },
        })
      );
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'ck-primitive-array__remove';
    removeButton.setAttribute('data-action', 'remove');
    removeButton.textContent = 'X';

    removeButton.addEventListener('click', () => {
      // Remove from state
      const index = this.itemsState.findIndex(item => item.id === itemState.id);
      if (index !== -1) {
        this.itemsState.splice(index, 1);
      }

      // Remove hidden input from light DOM
      const hiddenInput = this.hiddenInputsMap.get(itemState.id);
      if (hiddenInput) {
        hiddenInput.remove();
        this.hiddenInputsMap.delete(itemState.id);
      }

      // Remove from DOM
      itemRow.remove();

      // Update placeholder
      this.updatePlaceholder();

      // Re-index ARIA labels for remaining items
      this.updateAriaLabels();

      // Focus Add button
      this.addButton?.focus();

      // Dispatch change event
      const allItems = this.items;
      const activeItems = allItems
        .filter(item => !item.deleted)
        .map(item => item.value);
      const deletedItems = allItems
        .filter(item => item.deleted)
        .map(item => item.value);

      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          detail: {
            items: allItems,
            active: activeItems,
            deleted: deletedItems,
          },
        })
      );
    });

    itemRow.appendChild(input);
    itemRow.appendChild(deleteButton);
    itemRow.appendChild(removeButton);

    return itemRow;
  }

  private renderItems() {
    if (!this.listElement) return;

    // Clear existing items (but keep placeholder)
    const existingItems = this.listElement.querySelectorAll(
      '.ck-primitive-array__item'
    );
    existingItems.forEach(item => item.remove());

    this.itemsState.forEach(itemState => {
      this.listElement!.appendChild(this.createItemRow(itemState));
    });

    this.updatePlaceholder();
  }

  private updatePlaceholder() {
    if (this.placeholderElement) {
      this.placeholderElement.style.display =
        this.itemsState.length > 0 ? 'none' : '';
    }
  }

  private updateAriaLabels() {
    if (!this.listElement) return;

    const inputs = this.listElement.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
      const itemValue = (input as HTMLInputElement).value;
      input.setAttribute('aria-label', `Item: ${itemValue}`);
    });
  }

  checkValidity(): boolean {
    return this.itemsState.every(
      item => item.deleted || item.value.trim() !== ''
    );
  }

  addItem(value?: string) {
    if (!this.listElement) return;

    const newItem = {
      id: this.createItemId(),
      value: value ?? '',
      deleted: false,
    };
    this.itemsState.push(newItem);

    // Append only the new row — no full re-render
    const row = this.createItemRow(newItem);
    this.listElement.appendChild(row);
    this.updatePlaceholder();

    // Sync hidden inputs for form participation
    this.syncHiddenInputs();

    // Focus the new input
    const input = row.querySelector('input') as HTMLInputElement | null;
    input?.focus();

    // Dispatch change event
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        detail: { items: this.items },
      })
    );
  }
}

// Register the custom element
if (!customElements.get('ck-primitive-array')) {
  customElements.define('ck-primitive-array', CkPrimitiveArray);
}
