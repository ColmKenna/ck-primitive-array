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

  describe('Basic Item Rendering', () => {
    test('each item has a row with role="listitem"', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const rows = el.shadowRoot?.querySelectorAll('[role="listitem"]');
      expect(rows?.length).toBe(2);

      document.body.removeChild(el);
    });

    test('each row contains a text input', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const rows = Array.from(
        el.shadowRoot?.querySelectorAll('[role="listitem"]') || []
      );
      rows.forEach(row => {
        const input = row.querySelector('input[type="text"]');
        expect(input).toBeTruthy();
      });

      document.body.removeChild(el);
    });

    test('input displays item value', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["hello"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input?.value).toBe('hello');

      document.body.removeChild(el);
    });

    test('each row has a delete button', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const rows = Array.from(
        el.shadowRoot?.querySelectorAll('[role="listitem"]') || []
      );
      rows.forEach(row => {
        const btn = row.querySelector('button[data-action="delete"]');
        expect(btn).toBeTruthy();
      });

      document.body.removeChild(el);
    });

    test('each row has a remove button with "X"', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const rows = Array.from(
        el.shadowRoot?.querySelectorAll('[role="listitem"]') || []
      );
      rows.forEach(row => {
        const btn = row.querySelector('button[data-action="remove"]');
        expect(btn?.textContent).toBe('X');
      });

      document.body.removeChild(el);
    });

    test('items property returns internal state', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const items = el.items as unknown as Array<{
        id: string;
        value: string;
        deleted: boolean;
      }>;
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveProperty('id');
      expect(items[0]).toHaveProperty('value', 'a');
      expect(items[0]).toHaveProperty('deleted', false);
      expect(items[1]).toHaveProperty('id');
      expect(items[1]).toHaveProperty('value', 'b');
      expect(items[1]).toHaveProperty('deleted', false);

      document.body.removeChild(el);
    });
  });

  describe('Add Button Behavior', () => {
    test('Add button creates new item with empty input', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const rows = el.shadowRoot?.querySelectorAll('[role="listitem"]');
      expect(rows?.length).toBe(1);
      const input = rows?.[0]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input?.value).toBe('');

      document.body.removeChild(el);
    });

    test('New item input receives focus after add', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const rows = el.shadowRoot?.querySelectorAll('[role="listitem"]');
      const input = rows?.[rows.length - 1]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input).toBeTruthy();
      expect(el.shadowRoot?.activeElement).toBe(input);

      document.body.removeChild(el);
    });

    test('Items property updated after add', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const items = el.items;
      expect(items).toHaveLength(1);
      expect(items[0].value).toBe('');
      expect(items[0]).toHaveProperty('id');
      expect(items[0]).toHaveProperty('deleted', false);

      document.body.removeChild(el);
    });

    test('Change event dispatched on add', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const handler = jest.fn();
      el.addEventListener('change', handler);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as {
        detail: { items: unknown[] };
      };
      expect(event.detail).toBeDefined();
      expect(event.detail.items).toHaveLength(1);

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('Multiple adds work sequentially', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();
      btn.click();
      btn.click();

      const rows = el.shadowRoot?.querySelectorAll('[role="listitem"]');
      expect(rows?.length).toBe(3);
      expect(el.items).toHaveLength(3);

      document.body.removeChild(el);
    });

    test('Adding new item preserves existing input values', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;

      // Add first item and type a value into it
      btn.click();
      const firstInput = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      firstInput.value = 'typed value';
      firstInput.dispatchEvent(new window.Event('input', { bubbles: true }));

      // Add second item — first input should keep its value
      btn.click();

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll(
          '[role="listitem"] input[type="text"]'
        ) || []
      ) as HTMLInputElement[];
      expect(inputs.length).toBe(2);
      expect(inputs[0].value).toBe('typed value');
      expect(inputs[1].value).toBe('');

      document.body.removeChild(el);
    });

    test('Add button disabled when readonly', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      expect(btn?.disabled).toBe(true);

      document.body.removeChild(el);
    });

    test('Add button disabled when disabled', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('disabled', '');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      expect(btn?.disabled).toBe(true);

      document.body.removeChild(el);
    });

    test('addItem() with value uses that value', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      el.addItem('hello');

      const items = el.items;
      expect(items).toHaveLength(1);
      expect(items[0].value).toBe('hello');

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input?.value).toBe('hello');

      document.body.removeChild(el);
    });

    test('addItem() without value defaults to empty string', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      el.addItem();

      const items = el.items;
      expect(items).toHaveLength(1);
      expect(items[0].value).toBe('');

      document.body.removeChild(el);
    });

    test('addItem() with value dispatches change event with that value', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const handler = jest.fn();
      el.addEventListener('change', handler);

      el.addItem('test value');

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as {
        detail: {
          items: Array<{ id: string; value: string; deleted: boolean }>;
        };
      };
      expect(event.detail.items[0].value).toBe('test value');

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });
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
      const input0 = items?.[0]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const input1 = items?.[1]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const input2 = items?.[2]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input0?.value).toBe('a');
      expect(input1?.value).toBe('b');
      expect(input2?.value).toBe('c');

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
      const input0 = items?.[0]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const input1 = items?.[1]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const input2 = items?.[2]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input0?.value).toBe('1');
      expect(input1?.value).toBe('2');
      expect(input2?.value).toBe('3');

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
      const input0 = items?.[0]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const input1 = items?.[1]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input0?.value).toBe('true');
      expect(input1?.value).toBe('false');

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
      const input0 = items?.[0]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const input1 = items?.[1]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input0?.value).toBe('a');
      expect(input1?.value).toBe('b');

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
      const input0 = items?.[0]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const input1 = items?.[1]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input0?.value).toBe('a');
      expect(input1?.value).toBe('b');

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
      const input0 = items?.[0]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const input1 = items?.[1]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input0?.value).toBe('a');
      expect(input1?.value).toBe('b');

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
      const input0 = items?.[0]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const input1 = items?.[1]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      const input2 = items?.[2]?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement | null;
      expect(input0?.value).toBe('a');
      expect(input1?.value).toBe('b');
      expect(input2?.value).toBe('c');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      document.body.removeChild(el);
    });
  });

  describe('Add Item via Enter Key (1.6)', () => {
    test('Enter in empty input adds item', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      addButton.click();

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      const initialCount = el.items.length;

      // Simulate Enter key press
      const enterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      input.dispatchEvent(enterEvent);

      expect(el.items.length).toBe(initialCount + 1);

      document.body.removeChild(el);
    });

    test('Enter in filled input adds item and preserves original value', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      addButton.click();

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      const initialCount = el.items.length;

      // Simulate Enter key press
      const enterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      input.dispatchEvent(enterEvent);

      expect(el.items.length).toBe(initialCount + 1);
      expect(el.items[0].value).toBe('test');

      document.body.removeChild(el);
    });

    test('Focus moves to Add button after Enter adds item', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      addButton.click();

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      // Simulate Enter key press
      const enterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      input.dispatchEvent(enterEvent);

      expect(el.shadowRoot?.activeElement).toBe(addButton);

      document.body.removeChild(el);
    });

    test('Enter is no-op when readonly', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      addButton.click(); // This won't work since button is disabled, so add programmatically
      el.addItem();

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      const initialCount = el.items.length;

      // Simulate Enter key press
      const enterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      input.dispatchEvent(enterEvent);

      expect(el.items.length).toBe(initialCount);

      document.body.removeChild(el);
    });

    test('Change event dispatched on Enter add', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      addButton.click();

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      const handler = jest.fn();
      el.addEventListener('change', handler);

      // Simulate Enter key press
      const enterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      input.dispatchEvent(enterEvent);

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as {
        detail: {
          items: Array<{ id: string; value: string; deleted: boolean }>;
        };
      };
      expect(event.detail).toBeDefined();
      expect(event.detail.items).toHaveLength(2); // Initial item + new item

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });
  });
});
