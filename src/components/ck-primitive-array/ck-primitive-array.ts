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
  }

  static get observedAttributes() {
    return ['name', 'color', 'items'];
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

  get items(): string[] {
    const parsed = this.parseItems();
    return parsed !== null ? parsed : [];
  }

  set items(value: string[]) {
    this.setAttribute('items', JSON.stringify(value));
  }

  private parseItems(): string[] | null {
    const itemsAttr = this.getAttribute('items');
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

    // Render items from attribute
    if (this.listElement) {
      const itemsToRender = this.parseItems();

      // Only update items if parsing was successful (null means error)
      if (itemsToRender !== null) {
        // Clear existing items (but keep placeholder)
        const existingItems = this.listElement.querySelectorAll(
          '.ck-primitive-array__item'
        );
        existingItems.forEach(item => item.remove());

        // Add items from attribute
        itemsToRender.forEach(itemText => {
          const item = document.createElement('div');
          item.className = 'ck-primitive-array__item';
          item.setAttribute('role', 'listitem');
          item.textContent = itemText;
          this.listElement!.appendChild(item);
        });
      }
    }

    // Ensure placeholder visibility
    if (this.listElement && this.placeholderElement) {
      const hasItems =
        this.listElement.querySelectorAll('.ck-primitive-array__item').length >
        0;
      this.placeholderElement.style.display = hasItems ? 'none' : '';
    }
  }

  private addItem() {
    if (!this.listElement) return;
    const item = document.createElement('div');
    item.className = 'ck-primitive-array__item';
    item.setAttribute('role', 'listitem');
    item.textContent = `Item ${this.listElement.querySelectorAll('.ck-primitive-array__item').length + 1}`;
    this.listElement.appendChild(item);
    if (this.placeholderElement) this.placeholderElement.style.display = 'none';
  }
}

// Register the custom element
if (!customElements.get('ck-primitive-array')) {
  customElements.define('ck-primitive-array', CkPrimitiveArray);
}
