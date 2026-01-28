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

  describe('Items Attribute Parsing', () => {
    test('Valid JSON array of strings renders items', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b","c"]');
      document.body.appendChild(el);

      const items = el.shadowRoot?.querySelectorAll(
        '.ck-primitive-array__item'
      );
      expect(items?.length).toBe(3);
      expect(items?.[0]?.textContent).toBe('a');
      expect(items?.[1]?.textContent).toBe('b');
      expect(items?.[2]?.textContent).toBe('c');

      document.body.removeChild(el);
    });

    test('Numbers are coerced to strings', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '[1, 2, 3]');
      document.body.appendChild(el);

      const items = el.shadowRoot?.querySelectorAll(
        '.ck-primitive-array__item'
      );
      expect(items?.length).toBe(3);
      expect(items?.[0]?.textContent).toBe('1');
      expect(items?.[1]?.textContent).toBe('2');
      expect(items?.[2]?.textContent).toBe('3');

      document.body.removeChild(el);
    });

    test('Booleans are coerced to strings', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '[true, false]');
      document.body.appendChild(el);

      const items = el.shadowRoot?.querySelectorAll(
        '.ck-primitive-array__item'
      );
      expect(items?.length).toBe(2);
      expect(items?.[0]?.textContent).toBe('true');
      expect(items?.[1]?.textContent).toBe('false');

      document.body.removeChild(el);
    });

    test('Non-primitive objects are ignored', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", {"x":1}, "b"]');
      document.body.appendChild(el);

      const items = el.shadowRoot?.querySelectorAll(
        '.ck-primitive-array__item'
      );
      expect(items?.length).toBe(2);
      expect(items?.[0]?.textContent).toBe('a');
      expect(items?.[1]?.textContent).toBe('b');

      document.body.removeChild(el);
    });

    test('Arrays are ignored', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", [1,2], "b"]');
      document.body.appendChild(el);

      const items = el.shadowRoot?.querySelectorAll(
        '.ck-primitive-array__item'
      );
      expect(items?.length).toBe(2);
      expect(items?.[0]?.textContent).toBe('a');
      expect(items?.[1]?.textContent).toBe('b');

      document.body.removeChild(el);
    });

    test('Null values are ignored', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", null, "b"]');
      document.body.appendChild(el);

      const items = el.shadowRoot?.querySelectorAll(
        '.ck-primitive-array__item'
      );
      expect(items?.length).toBe(2);
      expect(items?.[0]?.textContent).toBe('a');
      expect(items?.[1]?.textContent).toBe('b');

      document.body.removeChild(el);
    });

    test('Invalid JSON logs error and renders no items', () => {
      const consoleSpy = jest
        .spyOn(globalThis.console, 'error')
        .mockImplementation();

      const el = new CkPrimitiveArray();
      el.setAttribute('items', 'not json');
      document.body.appendChild(el);

      const items = el.shadowRoot?.querySelectorAll(
        '.ck-primitive-array__item'
      );
      expect(items?.length).toBe(0);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      document.body.removeChild(el);
    });

    test('Invalid JSON preserves previous state', () => {
      const consoleSpy = jest
        .spyOn(globalThis.console, 'error')
        .mockImplementation();

      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b", "c"]');
      document.body.appendChild(el);

      // Verify initial state
      let items = el.shadowRoot?.querySelectorAll('.ck-primitive-array__item');
      expect(items?.length).toBe(3);

      // Set invalid JSON
      el.setAttribute('items', 'invalid json');

      // Items should remain the same
      items = el.shadowRoot?.querySelectorAll('.ck-primitive-array__item');
      expect(items?.length).toBe(3);
      expect(items?.[0]?.textContent).toBe('a');
      expect(items?.[1]?.textContent).toBe('b');
      expect(items?.[2]?.textContent).toBe('c');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      document.body.removeChild(el);
    });
  });
});
