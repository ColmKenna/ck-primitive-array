import { CkPrimitiveArray } from '../../src/components/ck-primitive-array/ck-primitive-array';

// Define the custom element before running tests
beforeAll(() => {
  if (!customElements.get('ck-primitive-array')) {
    customElements.define('ck-primitive-array', CkPrimitiveArray);
  }
});

describe('CkPrimitiveArray Component', () => {
  let element: CkPrimitiveArray;

  beforeEach(() => {
    // Create a fresh instance for each test
    element = new CkPrimitiveArray();
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Clean up after each test
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  test('should create an instance', () => {
    expect(element).toBeInstanceOf(CkPrimitiveArray);
    expect(element).toBeInstanceOf(HTMLElement);
  });

  test('should have shadow DOM', () => {
    expect(element.shadowRoot).toBeTruthy();
  });

  test('should have default name "World"', () => {
    expect(element.name).toBe('World');
  });

  test('should set and get name attribute', () => {
    element.name = 'Jest';
    expect(element.name).toBe('Jest');
    expect(element.getAttribute('name')).toBe('Jest');
  });

  test('should render content in shadow DOM', () => {
    element.connectedCallback();
    const shadowContent = element.shadowRoot?.innerHTML;
    expect(shadowContent).toContain('Hello');
    expect(shadowContent).toContain('World');
  });

  test('should update content when name attribute changes', () => {
    element.connectedCallback();
    element.setAttribute('name', 'Testing');

    // Trigger attribute change callback
    element.attributeChangedCallback('name', 'World', 'Testing');

    const shadowContent = element.shadowRoot?.innerHTML;
    expect(shadowContent).toContain('Testing');
  });

  test('should observe name and color attributes', () => {
    const observedAttributes = CkPrimitiveArray.observedAttributes;
    expect(observedAttributes).toContain('name');
    expect(observedAttributes).toContain('color');
  });

  test('should handle color attribute', () => {
    element.setAttribute('color', 'blue');
    element.connectedCallback();

    const shadowContent = element.shadowRoot?.innerHTML;
    expect(shadowContent).toContain('blue');
  });

  test('customElements.get should return the component class', () => {
    const ComponentClass = customElements.get('ck-primitive-array');
    expect(ComponentClass).toBeDefined();
    expect(ComponentClass).toBe(CkPrimitiveArray);
  });

  test('element created via HTML should be instance of CkPrimitiveArray', () => {
    // Create a container and parse HTML
    const container = document.createElement('div');
    container.innerHTML = '<ck-primitive-array></ck-primitive-array>';
    document.body.appendChild(container);

    const htmlElement = container.querySelector('ck-primitive-array');

    expect(htmlElement).toBeInstanceOf(CkPrimitiveArray);
    expect(htmlElement).toBeInstanceOf(HTMLElement);

    // Cleanup
    document.body.removeChild(container);
  });

  test('element created via document.createElement should render without errors', () => {
    const jsElement = document.createElement(
      'ck-primitive-array'
    ) as CkPrimitiveArray;

    expect(jsElement).toBeInstanceOf(CkPrimitiveArray);
    expect(jsElement).toBeInstanceOf(HTMLElement);

    // Append to DOM and verify it renders
    document.body.appendChild(jsElement);
    jsElement.connectedCallback();

    expect(jsElement.shadowRoot).toBeTruthy();
    expect(jsElement.shadowRoot?.innerHTML).toContain('Hello');

    // Cleanup
    document.body.removeChild(jsElement);
  });

  test('shadow root is created when element is connected', () => {
    const el = document.createElement('ck-primitive-array') as CkPrimitiveArray;
    document.body.appendChild(el);
    // connectedCallback is called on append; verify shadowRoot exists
    expect(el.shadowRoot).toBeTruthy();
    document.body.removeChild(el);
  });

  test('list container with role="list" exists in shadow DOM', () => {
    const el = new CkPrimitiveArray();
    document.body.appendChild(el);
    el.connectedCallback();
    const list = el.shadowRoot?.querySelector('[role="list"]');
    expect(list).toBeTruthy();
    document.body.removeChild(el);
  });

  test('add button is visible and enabled when there are no items', () => {
    const el = new CkPrimitiveArray();
    document.body.appendChild(el);
    el.connectedCallback();
    const btn = el.shadowRoot?.querySelector(
      'button.add-item'
    ) as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    expect(btn?.disabled).toBeFalsy();
    document.body.removeChild(el);
  });

  test('placeholder text is shown when list has no items', () => {
    const el = new CkPrimitiveArray();
    document.body.appendChild(el);
    el.connectedCallback();
    const placeholder =
      el.shadowRoot?.querySelector('.ck-primitive-array__placeholder')
        ?.textContent || '';
    expect(placeholder).toContain('No items');
    document.body.removeChild(el);
  });
});
