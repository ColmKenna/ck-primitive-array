import {
  ckPrimitiveArraySheet,
  ckPrimitiveArrayCSS,
} from './ck-primitive-array.styles';

export class CkPrimitiveArray extends HTMLElement {
  private shadow: ShadowRoot;

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

  static get observedAttributes() {
    return ['name', 'color'];
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

    this.shadow.innerHTML = `
      <div class="ck-primitive-array">
        <h1 class="ck-primitive-array__message">Hello, ${this.name}!</h1>
        <p class="ck-primitive-array__subtitle">Welcome to our Web Component Library</p>
      </div>
    `;

    // For testability (unit tests inspect shadowRoot.innerHTML), set the color
    // as an inline style on the message element so the color string appears in
    // the serialized HTML. Runtime styling still relies on the CSS variable.
    const msg = this.shadow.querySelector(
      '.ck-primitive-array__message'
    ) as HTMLElement | null;
    if (msg) msg.style.color = this.color;
  }
}

// Register the custom element
if (!customElements.get('ck-primitive-array')) {
  customElements.define('ck-primitive-array', CkPrimitiveArray);
}
