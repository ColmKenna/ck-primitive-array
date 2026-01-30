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
  private hasInitializedItems = false;
  private pendingItemsChange = false;
  private fieldsContainer: HTMLDivElement | null = null;
  private hiddenInputsMap: Map<string, HTMLInputElement> = new Map();
  private liveRegionElement: HTMLDivElement | null = null;
  private announcementSequence = 0;
  private lastErrorAnnouncements: Map<string, string> = new Map();
  private boundKeydownHandler: ((event: Event) => void) | null = null;
  private boundFocusHandler: ((event: FocusEvent) => void) | null = null;

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
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }

    if (!this.boundFocusHandler) {
      this.boundFocusHandler = (event: FocusEvent) => {
        const path = event.composedPath ? event.composedPath() : [];
        const origin = path.length > 0 ? path[0] : event.target;
        if (origin !== this) return;
        if (this.shadow.activeElement) return;
        this.focusFirstInteractive();
      };
    }
    this.addEventListener('focus', this.boundFocusHandler);

    if (!this.boundKeydownHandler) {
      this.boundKeydownHandler = (event: Event) => {
        this.handleShadowKeydown(event as KeyboardEvent);
      };
    }
    this.shadow.addEventListener('keydown', this.boundKeydownHandler);

    this.ensureFieldsContainer();
    this.render();
  }

  disconnectedCallback() {
    // cleanup event listeners and references
    if (this.addButton && this.boundAddHandler) {
      this.addButton.removeEventListener('click', this.boundAddHandler);
    }
    if (this.boundKeydownHandler) {
      this.shadow.removeEventListener('keydown', this.boundKeydownHandler);
    }
    if (this.boundFocusHandler) {
      this.removeEventListener('focus', this.boundFocusHandler);
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.boundAddHandler = null;
    this.boundKeydownHandler = null;
    this.boundFocusHandler = null;
    this.container = null;
    this.messageElement = null;
    this.subtitleElement = null;
    this.controlsElement = null;
    this.addButton = null;
    this.listElement = null;
    this.placeholderElement = null;
    this.liveRegionElement = null;

    // Cleanup light DOM fields container
    if (this.fieldsContainer && this.fieldsContainer.parentNode) {
      this.fieldsContainer.parentNode.removeChild(this.fieldsContainer);
    }
    this.fieldsContainer = null;
    this.hiddenInputsMap.clear();
    this.lastErrorAnnouncements.clear();
  }

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

  private parseItemsAttribute(itemsAttr: string | null): string[] {
    if (itemsAttr === null || itemsAttr === '') return [];

    try {
      const parsed = JSON.parse(itemsAttr);
      if (parsed === null) {
        return [];
      }
      if (!Array.isArray(parsed)) {
        (globalThis as any).console?.error(
          'Items attribute must be a JSON array.',
          parsed
        );
        return [];
      }

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
      return [];
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

    this.lastItemsAttribute = itemsAttr;
    this.itemsState = parsed.map(value => ({
      id: this.createItemId(),
      value,
      deleted: false,
    }));
    this.lastErrorAnnouncements.clear();

    if (this.hasInitializedItems && this.isConnected) {
      this.pendingItemsChange = true;
    }
    this.hasInitializedItems = true;
  }

  private validateItemValue(
    value: string,
    itemState: { id: string; value: string; deleted: boolean }
  ): string | null {
    // Check empty/whitespace
    if (value.trim() === '') {
      return 'This field is required.';
    }

    // Check minlength
    const minlength = this.getAttribute('minlength');
    if (minlength) {
      const min = parseInt(minlength, 10);
      if (value.length < min) {
        return `Must be at least ${min} characters.`;
      }
    }

    // Check maxlength
    const maxlength = this.getAttribute('maxlength');
    if (maxlength) {
      const max = parseInt(maxlength, 10);
      if (value.length > max) {
        return `Must be no more than ${max} characters.`;
      }
    }

    // Check pattern
    const pattern = this.getAttribute('pattern');
    if (pattern) {
      try {
        const regex = new RegExp(`^${pattern}$`);
        if (!regex.test(value)) {
          return 'Invalid format.';
        }
      } catch (error) {
        (globalThis as any).console?.error(
          'Invalid regex pattern:',
          pattern,
          error
        );
      }
    }

    // Check duplicates (unless allow-duplicates is set)
    if (!this.hasAttribute('allow-duplicates')) {
      const duplicateExists = this.itemsState.some(
        item =>
          item.id !== itemState.id && !item.deleted && item.value === value
      );
      if (duplicateExists) {
        return 'This value already exists.';
      }
    }

    return null;
  }

  private commitInputValue(
    itemState: { id: string; value: string; deleted: boolean },
    input: HTMLInputElement,
    itemRow: HTMLDivElement,
    emitChange: boolean
  ) {
    const valueChanged = itemState.value !== input.value;

    if (valueChanged) {
      itemState.value = input.value;
      // Update hidden input in light DOM
      this.syncHiddenInputs();
      // Refresh labels for index/value changes
      this.updateAriaLabels();
    }

    // Always validate
    const errorMessage = this.validateItemValue(input.value, itemState);

    if (errorMessage) {
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('has-error');
      itemRow.classList.add('has-error');

      const errorId = `ckpa-error-${itemState.id}`;
      let errorEl = itemRow.querySelector(
        `#${errorId}`
      ) as HTMLDivElement | null;

      if (!errorEl) {
        // Remove old error message if exists
        const oldError = itemRow.querySelector('[data-error]');
        if (oldError) {
          oldError.remove();
        }

        // Create and add error message
        errorEl = document.createElement('div');
        errorEl.setAttribute('data-error', '');
        errorEl.id = errorId;
        itemRow.appendChild(errorEl);
      }

      errorEl.className = 'ck-primitive-array__error has-error';
      errorEl.textContent = errorMessage;
      input.setAttribute('aria-describedby', errorId);

      const lastError = this.lastErrorAnnouncements.get(itemState.id);
      if (lastError !== errorMessage) {
        this.lastErrorAnnouncements.set(itemState.id, errorMessage);
        this.announce(`Validation error: ${errorMessage}`);
      }
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      input.classList.remove('has-error');
      itemRow.classList.remove('has-error');
      const oldError = itemRow.querySelector('[data-error]');
      if (oldError) {
        oldError.remove();
      }
      this.lastErrorAnnouncements.delete(itemState.id);
    }

    if (valueChanged && emitChange) {
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

  private setAriaDisabled(element: HTMLElement, disabled: boolean) {
    if (disabled) {
      element.setAttribute('aria-disabled', 'true');
    } else {
      element.removeAttribute('aria-disabled');
    }
  }

  private setAriaReadonly(input: HTMLInputElement, readonly: boolean) {
    if (readonly) {
      input.setAttribute('aria-readonly', 'true');
    } else {
      input.removeAttribute('aria-readonly');
    }
  }

  private formatItemLabel(index: number, value: string): string {
    const base = `Item ${index}`;
    const trimmed = value.trim();
    return trimmed === '' ? base : `${base}: ${value}`;
  }

  private getItemIndex(itemId: string): number {
    const index = this.itemsState.findIndex(item => item.id === itemId);
    return index === -1 ? 1 : index + 1;
  }

  private updateAriaLabels() {
    if (!this.listElement) return;

    const rows = Array.from(
      this.listElement.querySelectorAll<HTMLDivElement>(
        '.ck-primitive-array__item'
      )
    );

    rows.forEach((row, index) => {
      const input = row.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const deleteButton = row.querySelector(
        'button[data-action="delete"]'
      ) as HTMLButtonElement | null;
      const removeButton = row.querySelector(
        'button[data-action="remove"]'
      ) as HTMLButtonElement | null;
      const value = input ? input.value : '';
      const itemLabel = this.formatItemLabel(index + 1, value);
      const itemId = row.getAttribute('data-id') || '';
      const itemState = this.itemsState.find(item => item.id === itemId);
      const isDeleted = itemState?.deleted ?? false;

      if (input) {
        input.setAttribute('aria-label', itemLabel);
      }

      if (deleteButton) {
        const action = isDeleted ? 'Restore' : 'Delete';
        deleteButton.setAttribute('aria-label', `${action} ${itemLabel}`);
      }

      if (removeButton) {
        removeButton.setAttribute('aria-label', `Remove ${itemLabel}`);
      }
    });
  }

  private updateListAriaDescribedBy(errorIds: string[]) {
    if (!this.listElement) return;
    if (errorIds.length > 0) {
      this.listElement.setAttribute('aria-describedby', errorIds.join(' '));
    } else {
      this.listElement.removeAttribute('aria-describedby');
    }
  }

  private announce(message: string) {
    if (!this.liveRegionElement) return;
    this.announcementSequence += 1;
    this.liveRegionElement.setAttribute(
      'data-announce-seq',
      String(this.announcementSequence)
    );
    this.liveRegionElement.textContent = message;
  }

  private getFocusableElements(): HTMLElement[] {
    const elements = Array.from(
      this.shadow.querySelectorAll<HTMLElement>('button, input, [tabindex]')
    );

    return elements.filter(element => {
      if (element.tabIndex < 0) return false;
      const isDisabled = (element as HTMLButtonElement | HTMLInputElement)
        .disabled;
      return !isDisabled;
    });
  }

  private focusFirstInteractive() {
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  private focusOutside(direction: 'next' | 'prev'): boolean {
    const selector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
    ).filter(element => {
      const isDisabled = (element as HTMLButtonElement | HTMLInputElement)
        .disabled;
      return !isDisabled;
    });

    const hostIndex = focusable.indexOf(this);
    if (hostIndex === -1) return false;

    const targetIndex = direction === 'next' ? hostIndex + 1 : hostIndex - 1;
    const target = focusable[targetIndex];
    if (!target) return false;

    target.focus();
    return true;
  }

  private handleShadowKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (event.key === 'Tab') {
      const focusable = this.getFocusableElements();
      const currentIndex = focusable.indexOf(target);
      if (currentIndex === -1) return;

      const direction = event.shiftKey ? -1 : 1;
      const nextIndex = currentIndex + direction;

      if (nextIndex >= 0 && nextIndex < focusable.length) {
        event.preventDefault();
        focusable[nextIndex].focus();
        return;
      }

      const movedOutside = this.focusOutside(event.shiftKey ? 'prev' : 'next');
      if (movedOutside) {
        event.preventDefault();
      }
    }

    if (
      target instanceof HTMLButtonElement &&
      (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar')
    ) {
      if (target.disabled) {
        return;
      }
      event.preventDefault();
      target.click();
    }
  }

  private validateListConstraints(): void {
    if (!this.container || !this.listElement) return;

    const activeCount = this.itemsState.filter(item => !item.deleted).length;
    const min = this.getAttribute('min');
    const max = this.getAttribute('max');
    const isRequired = this.hasAttribute('required');
    const errorIds: string[] = [];

    // Remove old validation errors
    const oldErrors = this.container.querySelectorAll(
      '[data-required-error], [data-min-error], [data-max-error]'
    );
    oldErrors.forEach(error => error.remove());

    // Check required
    if (isRequired && activeCount === 0) {
      const errorEl = document.createElement('div');
      errorEl.setAttribute('data-required-error', '');
      errorEl.className = 'ck-primitive-array__list-error';
      errorEl.id = 'ckpa-list-error-required';
      errorEl.textContent = 'At least one item is required.';
      this.container.appendChild(errorEl);
      errorIds.push(errorEl.id);
    }

    // Check min
    if (min) {
      const minCount = parseInt(min, 10);
      if (activeCount < minCount && activeCount > 0) {
        const errorEl = document.createElement('div');
        errorEl.setAttribute('data-min-error', '');
        errorEl.className = 'ck-primitive-array__list-error';
        errorEl.id = 'ckpa-list-error-min';
        errorEl.textContent = `At least ${minCount} items required.`;
        this.container.appendChild(errorEl);
        errorIds.push(errorEl.id);
      }
    }

    // Check max
    if (max) {
      const maxCount = parseInt(max, 10);
      if (activeCount > maxCount) {
        const errorEl = document.createElement('div');
        errorEl.setAttribute('data-max-error', '');
        errorEl.className = 'ck-primitive-array__list-error';
        errorEl.id = 'ckpa-list-error-max';
        errorEl.textContent = `Maximum ${maxCount} items allowed.`;
        this.container.appendChild(errorEl);
        errorIds.push(errorEl.id);
      }
    }

    this.updateListAriaDescribedBy(errorIds);

    // Update add button disabled state
    if (this.addButton) {
      const isReadonly = this.hasAttribute('readonly');
      const isDisabled = this.hasAttribute('disabled');
      const atMax = max ? activeCount >= parseInt(max, 10) : false;
      this.addButton.disabled = isReadonly || isDisabled || atMax;
      this.setAriaDisabled(this.addButton, this.addButton.disabled);
    }
  }

  private attachFormValidation(): void {
    const form = this.closest('form');
    if (!form) return;

    // Only attach once
    if ((form as any).__ckpaValidationAttached) {
      return;
    }
    (form as any).__ckpaValidationAttached = true;

    // Prevent form submission if invalid
    const handleSubmit = (e: Event) => {
      if (!this.checkValidity()) {
        e.preventDefault();
      }
    };

    form.addEventListener('submit', handleSubmit);
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

    const isReadonly = this.hasAttribute('readonly');
    const isDisabled = this.hasAttribute('disabled');

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
      this.addButton.setAttribute('aria-label', 'Add item');
      this.addButton.textContent = 'Add';
      this.controlsElement.appendChild(this.addButton);
      this.container.appendChild(this.controlsElement);

      this.listElement = document.createElement('div');
      this.listElement.className = 'ck-primitive-array__list';
      this.listElement.setAttribute('role', 'list');
      this.listElement.setAttribute('aria-label', 'Items');
      this.listElement.setAttribute('part', 'list');

      this.placeholderElement = document.createElement('p');
      this.placeholderElement.className = 'ck-primitive-array__placeholder';
      this.placeholderElement.textContent = 'No items';
      this.listElement.appendChild(this.placeholderElement);

      this.container.appendChild(this.listElement);

      this.liveRegionElement = document.createElement('div');
      this.liveRegionElement.className = 'ck-primitive-array__live';
      this.liveRegionElement.setAttribute('aria-live', 'polite');
      this.liveRegionElement.setAttribute('aria-atomic', 'true');
      this.liveRegionElement.setAttribute('role', 'status');
      this.announcementSequence = 0;
      this.liveRegionElement.setAttribute('data-announce-seq', '0');
      this.container.appendChild(this.liveRegionElement);

      this.shadow.appendChild(this.container);

      // Wire up event handler
      this.boundAddHandler = () => {
        this.addItem();
      };
      this.addButton.addEventListener('click', this.boundAddHandler);
    }

    if (this.container) {
      this.container.classList.toggle('is-disabled', isDisabled);
      this.container.classList.toggle('is-readonly', isReadonly);
    }

    if (this.listElement) {
      if (this.hasAttribute('required')) {
        this.listElement.setAttribute('aria-required', 'true');
      } else {
        this.listElement.removeAttribute('aria-required');
      }
    }

    // Update dynamic content
    if (this.messageElement) {
      this.messageElement.textContent = `Hello, ${this.name}!`;
      (this.messageElement.style as CSSStyleDeclaration).color = this.color;
    }

    // Render items from attribute
    if (this.listElement) {
      this.syncItemsFromAttribute();
      this.renderItems();
    }

    // Sync hidden inputs for form participation
    this.syncHiddenInputs();

    // Validate list constraints
    this.validateListConstraints();

    // Attach form validation
    this.attachFormValidation();

    if (this.pendingItemsChange) {
      this.pendingItemsChange = false;
      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          detail: { items: this.items },
        })
      );
    }
  }

  private createItemRow(itemState: {
    id: string;
    value: string;
    deleted: boolean;
  }): HTMLDivElement {
    const isReadonly = this.hasAttribute('readonly');
    const isDisabled = this.hasAttribute('disabled');
    const itemRow = document.createElement('div');
    itemRow.className = 'ck-primitive-array__item';
    itemRow.setAttribute('role', 'listitem');
    itemRow.setAttribute('data-id', itemState.id);

    // Set part attribute for styling based on deleted state
    if (itemState.deleted) {
      itemRow.setAttribute('part', 'row deleted');
    } else {
      itemRow.setAttribute('part', 'row');
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'ck-primitive-array__input';
    input.value = itemState.value;
    input.setAttribute('part', 'input');

    // Disable input if item is soft-deleted
    input.readOnly = isReadonly;
    input.disabled = itemState.deleted || isDisabled;
    input.setAttribute(
      'aria-label',
      this.formatItemLabel(this.getItemIndex(itemState.id), itemState.value)
    );
    this.setAriaReadonly(input, isReadonly);
    this.setAriaDisabled(input, input.disabled);

    input.addEventListener('input', () => {
      this.commitInputValue(itemState, input, itemRow, true);
    });
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isDisabled) {
          return;
        }
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

      if (e.key === 'Escape') {
        this.addButton?.focus();
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'ck-primitive-array__delete';
    deleteButton.setAttribute('data-action', 'delete');
    deleteButton.setAttribute('part', 'delete-button');
    deleteButton.setAttribute(
      'aria-pressed',
      itemState.deleted ? 'true' : 'false'
    );
    deleteButton.textContent = itemState.deleted ? 'Undo' : 'Delete';
    deleteButton.disabled = isReadonly || isDisabled;
    this.setAriaDisabled(deleteButton, deleteButton.disabled);

    deleteButton.addEventListener('click', () => {
      if (this.hasAttribute('readonly') || this.hasAttribute('disabled')) {
        return;
      }
      itemState.deleted = !itemState.deleted;

      // Update button text and aria-pressed
      deleteButton.textContent = itemState.deleted ? 'Undo' : 'Delete';
      deleteButton.setAttribute(
        'aria-pressed',
        itemState.deleted ? 'true' : 'false'
      );

      // Update part attribute on row
      if (itemState.deleted) {
        itemRow.setAttribute('part', 'row deleted');
      } else {
        itemRow.setAttribute('part', 'row');
      }

      // Update input disabled state
      input.readOnly = this.hasAttribute('readonly');
      input.disabled = itemState.deleted || this.hasAttribute('disabled');
      this.setAriaReadonly(input, this.hasAttribute('readonly'));
      this.setAriaDisabled(input, input.disabled);

      // Sync hidden inputs in light DOM
      this.syncHiddenInputs();

      // Re-validate list constraints
      this.validateListConstraints();

      // Focus the button after toggle
      deleteButton.focus();

      this.updateAriaLabels();

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

      const itemLabel = this.formatItemLabel(
        this.getItemIndex(itemState.id),
        itemState.value
      );
      if (itemState.deleted) {
        this.announce(`${itemLabel} deleted`);
      } else {
        this.announce(`${itemLabel} restored`);
      }
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'ck-primitive-array__remove';
    removeButton.setAttribute('data-action', 'remove');
    removeButton.textContent = 'X';
    removeButton.setAttribute('part', 'remove-button');
    removeButton.disabled = isReadonly || isDisabled;
    this.setAriaDisabled(removeButton, removeButton.disabled);

    removeButton.addEventListener('click', () => {
      if (this.hasAttribute('readonly') || this.hasAttribute('disabled')) {
        return;
      }
      const removedIndex = this.getItemIndex(itemState.id);
      const removedLabel = this.formatItemLabel(removedIndex, itemState.value);
      // Remove from state
      const index = this.itemsState.findIndex(item => item.id === itemState.id);
      if (index !== -1) {
        this.itemsState.splice(index, 1);
      }
      this.lastErrorAnnouncements.delete(itemState.id);

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

      // Re-validate list constraints
      this.validateListConstraints();

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

      this.announce(`${removedLabel} removed`);
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
      const row = this.createItemRow(itemState);
      this.listElement!.appendChild(row);
      const input = row.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      if (input) {
        this.commitInputValue(itemState, input, row, false);
      }
    });

    this.updatePlaceholder();
    this.updateAriaLabels();
  }

  private updatePlaceholder() {
    if (this.placeholderElement) {
      this.placeholderElement.style.display =
        this.itemsState.length > 0 ? 'none' : '';
    }
  }

  checkValidity(): boolean {
    // Check required constraint
    if (this.hasAttribute('required')) {
      const activeCount = this.itemsState.filter(item => !item.deleted).length;
      if (activeCount === 0) {
        return false;
      }
    }

    // Check min constraint
    const min = this.getAttribute('min');
    if (min) {
      const minCount = parseInt(min, 10);
      const activeCount = this.itemsState.filter(item => !item.deleted).length;
      if (activeCount < minCount) {
        return false;
      }
    }

    // Check max constraint
    const max = this.getAttribute('max');
    if (max) {
      const maxCount = parseInt(max, 10);
      const activeCount = this.itemsState.filter(item => !item.deleted).length;
      if (activeCount > maxCount) {
        return false;
      }
    }

    // Check individual item values
    return this.itemsState.every(
      item => item.deleted || item.value.trim() !== ''
    );
  }

  addItem(value?: string) {
    if (this.hasAttribute('readonly') || this.hasAttribute('disabled')) {
      return;
    }
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
    this.updateAriaLabels();

    // Sync hidden inputs for form participation
    this.syncHiddenInputs();

    // Re-validate list constraints
    this.validateListConstraints();

    // Focus the new input
    const input = row.querySelector('input') as HTMLInputElement | null;
    input?.focus();

    const itemLabel = this.formatItemLabel(
      this.itemsState.length,
      newItem.value
    );
    this.announce(`${itemLabel} added`);

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
