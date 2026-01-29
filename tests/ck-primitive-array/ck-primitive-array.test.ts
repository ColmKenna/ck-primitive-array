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

  describe('Inline Edit', () => {
    test('should update state when input value changes', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      // Change input value
      input.value = 'b';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      // State should update
      expect(el.items[0].value).toBe('b');

      document.body.removeChild(el);
    });

    test('should dispatch change event when input value changes', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      const handler = jest.fn();
      el.addEventListener('change', handler);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      // Change input value
      input.value = 'b';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      // Should dispatch change event
      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as {
        detail: {
          items: Array<{ id: string; value: string; deleted: boolean }>;
        };
      };
      expect(event.detail.items[0].value).toBe('b');

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('should dispatch change event on every keystroke', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '[""]');
      document.body.appendChild(el);

      const handler = jest.fn();
      el.addEventListener('change', handler);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      // Type three characters
      input.value = 'a';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      input.value = 'ab';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      input.value = 'abc';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      // Should have 3 change events
      expect(handler).toHaveBeenCalledTimes(3);

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('should update hidden inputs when name attribute is set', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'tags');
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      const hiddenInput = el.shadowRoot?.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;

      // Hidden input should exist
      expect(hiddenInput).toBeTruthy();
      expect(hiddenInput?.name).toBe('tags[]');
      expect(hiddenInput?.value).toBe('a');

      // Change input value
      input.value = 'new value';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      // Hidden input should update
      expect(hiddenInput?.value).toBe('new value');

      document.body.removeChild(el);
    });

    test('should not allow editing soft-deleted items', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      // Manually add an item and mark it deleted
      el.addItem('test');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el as any).itemsState[0].deleted = true;

      // Re-render to reflect deleted state
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el as any).renderItems();

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      // Input should be disabled or readonly
      expect(input.disabled || input.readOnly).toBe(true);

      document.body.removeChild(el);
    });

    test('should preserve item identity when editing', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      const originalId = el.items[0].id;
      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      // Change value
      input.value = 'new value';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      // ID should remain the same
      expect(el.items[0].id).toBe(originalId);
      expect(el.items[0].value).toBe('new value');

      document.body.removeChild(el);
    });

    test('should update aria-label when value changes', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      // Initial aria-label should reflect value
      expect(input.getAttribute('aria-label')).toContain('a');

      // Change value
      input.value = 'b';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      // aria-label should update
      expect(input.getAttribute('aria-label')).toContain('b');

      document.body.removeChild(el);
    });

    test('should show validation error when value is empty', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test"]');
      document.body.appendChild(el);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      const itemRow = input.closest('.ck-primitive-array__item') as HTMLElement;

      // Clear the value
      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      // Should have validation error indicator
      const hasError =
        itemRow.classList.contains('has-error') ||
        itemRow.hasAttribute('data-error') ||
        input.classList.contains('error') ||
        input.hasAttribute('aria-invalid');

      expect(hasError).toBe(true);

      document.body.removeChild(el);
    });
  });

  describe('Soft Delete', () => {
    test('Delete button marks item deleted', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      expect(deleteBtn).toBeTruthy();

      deleteBtn.click();

      const items = el.items;
      expect(items[0].deleted).toBe(true);

      document.body.removeChild(el);
    });

    test('Deleted item shows undo button', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // After delete, the button should still exist and show "Undo"
      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      expect(undoBtn).toBeTruthy();
      expect(undoBtn.textContent).toBe('Undo');

      document.body.removeChild(el);
    });

    test('Deleted item has visual styling', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const itemRow = el.shadowRoot?.querySelector(
        '[role="listitem"]'
      ) as HTMLElement;
      expect(itemRow.getAttribute('part')).toContain('deleted');

      document.body.removeChild(el);
    });

    test('Focus moves to undo button', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      expect(el.shadowRoot?.activeElement).toBe(undoBtn);

      document.body.removeChild(el);
    });

    test('Change event on soft delete', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const handler = jest.fn();
      el.addEventListener('change', handler);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as {
        detail: {
          items: Array<{ id: string; value: string; deleted: boolean }>;
          active?: Array<{ id: string; value: string; deleted: boolean }>;
          deleted?: Array<{ id: string; value: string; deleted: boolean }>;
        };
      };
      expect(event.detail.deleted).toBeDefined();
      expect(event.detail.deleted).toHaveLength(1);
      expect(event.detail.deleted![0].value).toBe('test item');

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('Hidden input moves to deleted-name', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'myfield');
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const hiddenInput = el.shadowRoot?.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hiddenInput.name).toBe('deleted-myfield[]');

      document.body.removeChild(el);
    });

    test('aria-pressed updates on delete', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      
      // Initially not pressed
      expect(deleteBtn.getAttribute('aria-pressed')).toBe('false');
      
      deleteBtn.click();

      // After delete, should be pressed
      expect(deleteBtn.getAttribute('aria-pressed')).toBe('true');

      document.body.removeChild(el);
    });
  });

  describe('Undo Delete', () => {
    test('Undo restores item to active', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // Item should be deleted
      expect(el.items[0].deleted).toBe(true);

      // Click again to undo
      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      undoBtn.click();

      // Item should be restored
      expect(el.items[0].deleted).toBe(false);

      document.body.removeChild(el);
    });

    test('Restored item is editable', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // Input should be disabled after delete
      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      expect(input.disabled).toBe(true);

      // Undo
      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      undoBtn.click();

      // Input should be enabled after undo
      expect(input.disabled).toBe(false);

      document.body.removeChild(el);
    });

    test('Focus moves to delete button', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      // First soft-delete
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // Then undo
      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      undoBtn.click();

      // Focus should be on the delete button
      const newDeleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      expect(el.shadowRoot?.activeElement).toBe(newDeleteBtn);

      document.body.removeChild(el);
    });

    test('Change event on undo', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      // Delete first
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // Listen for change on undo
      const handler = jest.fn();
      el.addEventListener('change', handler);

      // Undo
      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      undoBtn.click();

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as {
        detail: {
          items: Array<{ id: string; value: string; deleted: boolean }>;
          active?: Array<{ id: string; value: string; deleted: boolean }>;
          deleted?: Array<{ id: string; value: string; deleted: boolean }>;
        };
      };
      expect(event.detail.active).toBeDefined();
      expect(event.detail.active).toHaveLength(1);
      expect(event.detail.active![0].value).toBe('test item');

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('Hidden input moves back to name', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'myfield');
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      // Delete
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // Verify it's in deleted state
      let hiddenInput = el.shadowRoot?.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hiddenInput.name).toBe('deleted-myfield[]');

      // Undo
      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      undoBtn.click();

      // Verify it's back to normal
      hiddenInput = el.shadowRoot?.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hiddenInput.name).toBe('myfield[]');

      document.body.removeChild(el);
    });

    test('aria-pressed updates on undo', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // After delete, should be pressed
      expect(deleteBtn.getAttribute('aria-pressed')).toBe('true');

      // Undo
      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      undoBtn.click();

      // After undo, should not be pressed
      expect(undoBtn.getAttribute('aria-pressed')).toBe('false');

      document.body.removeChild(el);
    });
  });
});
