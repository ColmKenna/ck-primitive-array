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
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

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
      const hiddenInput = el.querySelector(
        '[data-ckpa-fields] input[type="hidden"]'
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
          active?: string[];
          deleted?: string[];
        };
      };
      expect(event.detail.deleted).toBeDefined();
      expect(event.detail.deleted).toHaveLength(1);
      expect(event.detail.deleted![0]).toBe('test item');

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('Hidden input moves to deleted-name', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'myfield');
      el.setAttribute('deleted-name', 'deleted-myfield');
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const hiddenInput = el.querySelector(
        '[data-ckpa-fields] input[type="hidden"]'
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
          active?: string[];
          deleted?: string[];
        };
      };
      expect(event.detail.active).toBeDefined();
      expect(event.detail.active).toHaveLength(1);
      expect(event.detail.active![0]).toBe('test item');

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('Hidden input moves back to name', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'myfield');
      el.setAttribute('deleted-name', 'deleted-myfield');
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      // Delete
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // Verify it's in deleted state
      let hiddenInput = el.querySelector(
        '[data-ckpa-fields] input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hiddenInput.name).toBe('deleted-myfield[]');

      // Undo
      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      undoBtn.click();

      // Verify it's back to normal
      hiddenInput = el.querySelector(
        '[data-ckpa-fields] input[type="hidden"]'
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

  describe('Hard Remove', () => {
    test('should delete item permanently when remove clicked', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b", "c"]');
      document.body.appendChild(el);

      // Get the middle item's remove button
      const removeButtons = el.shadowRoot?.querySelectorAll(
        '[data-action="remove"]'
      );
      expect(removeButtons?.length).toBe(3);

      // Click remove on second item ("b")
      (removeButtons?.[1] as HTMLButtonElement).click();

      // Item should be removed from items property
      const items = el.items;
      expect(items.length).toBe(2);
      expect(items[0].value).toBe('a');
      expect(items[1].value).toBe('c');
      // "b" should not be in the array
      const hasB = items.some(item => item.value === 'b');
      expect(hasB).toBe(false);

      document.body.removeChild(el);
    });

    test('should remove row from DOM when item removed', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b", "c"]');
      document.body.appendChild(el);

      // Verify 3 rows exist
      let rows = el.shadowRoot?.querySelectorAll('[role="listitem"]');
      expect(rows?.length).toBe(3);

      // Remove middle item
      const removeButtons = el.shadowRoot?.querySelectorAll(
        '[data-action="remove"]'
      );
      (removeButtons?.[1] as HTMLButtonElement).click();

      // Verify only 2 rows remain
      rows = el.shadowRoot?.querySelectorAll('[role="listitem"]');
      expect(rows?.length).toBe(2);

      document.body.removeChild(el);
    });

    test('should move focus to Add button when remove clicked', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b"]');
      document.body.appendChild(el);

      const removeButton = el.shadowRoot?.querySelector(
        '[data-action="remove"]'
      ) as HTMLButtonElement;
      removeButton.click();

      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      expect(el.shadowRoot?.activeElement).toBe(addButton);

      document.body.removeChild(el);
    });

    test('should dispatch change event when item removed', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b", "c"]');
      document.body.appendChild(el);

      const handler = jest.fn();
      el.addEventListener('change', handler);

      const removeButtons = el.shadowRoot?.querySelectorAll(
        '[data-action="remove"]'
      );
      (removeButtons?.[1] as HTMLButtonElement).click();

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as {
        detail: {
          items: Array<{ id: string; value: string; deleted: boolean }>;
        };
      };
      expect(event.detail.items.length).toBe(2);
      expect(event.detail.items[0].value).toBe('a');
      expect(event.detail.items[1].value).toBe('c');

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('should remove hidden input when item has name attribute', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'tags');
      el.setAttribute('items', '["a", "b", "c"]');
      document.body.appendChild(el);

      // Verify 3 hidden inputs exist
      let hiddenInputs = el.querySelectorAll(
        '[data-ckpa-fields] input[type="hidden"]'
      );
      expect(hiddenInputs?.length).toBe(3);

      // Remove middle item
      const removeButtons = el.shadowRoot?.querySelectorAll(
        '[data-action="remove"]'
      );
      (removeButtons?.[1] as HTMLButtonElement).click();

      // Verify only 2 hidden inputs remain
      hiddenInputs = el.querySelectorAll(
        '[data-ckpa-fields] input[type="hidden"]'
      );
      expect(hiddenInputs?.length).toBe(2);

      document.body.removeChild(el);
    });

    test('should re-index remaining items after removal', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b", "c"]');
      document.body.appendChild(el);

      // Remove middle item "b"
      const removeButtons = el.shadowRoot?.querySelectorAll(
        '[data-action="remove"]'
      );
      (removeButtons?.[1] as HTMLButtonElement).click();

      // Check that remaining items are re-indexed in ARIA labels
      const inputs = el.shadowRoot?.querySelectorAll('input[type="text"]');
      expect(inputs?.length).toBe(2);

      // First item should still be "Item 1" or "Item: a"
      expect(
        (inputs?.[0] as HTMLInputElement).getAttribute('aria-label')
      ).toMatch(/Item.*[1a]/i);

      // Third item (now second) should be "Item 2" or similar
      expect(
        (inputs?.[1] as HTMLInputElement).getAttribute('aria-label')
      ).toMatch(/Item.*[2c]/i);

      document.body.removeChild(el);
    });
  });

  describe('Change Event', () => {
    test('should bubble to parent elements', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const el = new CkPrimitiveArray();
      container.appendChild(el);

      const handler = jest.fn();
      container.addEventListener('change', handler);

      // Trigger change by adding item
      el.addItem('test');

      expect(handler).toHaveBeenCalledTimes(1);

      container.removeEventListener('change', handler);
      document.body.removeChild(container);
    });

    test('should include all items in detail.items', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a", "b"]');
      document.body.appendChild(el);

      // Soft delete one item
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;

      const handler = jest.fn();
      el.addEventListener('change', handler);

      deleteBtn.click();

      const event = handler.mock.calls[0][0] as {
        detail: {
          items: Array<{ id: string; value: string; deleted: boolean }>;
        };
      };

      // Should have both items (1 active, 1 deleted)
      expect(event.detail.items.length).toBe(2);
      expect(event.detail.items[0].deleted).toBe(true);
      expect(event.detail.items[1].deleted).toBe(false);

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('should include active values as strings in detail.active', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["active1", "active2", "will-delete"]');
      document.body.appendChild(el);

      // Soft delete the third item
      const deleteButtons = el.shadowRoot?.querySelectorAll(
        '[data-action="delete"]'
      );
      const handler = jest.fn();
      el.addEventListener('change', handler);

      (deleteButtons?.[2] as HTMLButtonElement).click();

      const event = handler.mock.calls[0][0] as {
        detail: {
          active: string[];
        };
      };

      // active should be an array of strings
      expect(Array.isArray(event.detail.active)).toBe(true);
      expect(event.detail.active.length).toBe(2);
      expect(event.detail.active[0]).toBe('active1');
      expect(event.detail.active[1]).toBe('active2');
      expect(typeof event.detail.active[0]).toBe('string');

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('should include deleted values as strings in detail.deleted', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["active", "delete1", "delete2"]');
      document.body.appendChild(el);

      const deleteButtons = el.shadowRoot?.querySelectorAll(
        '[data-action="delete"]'
      );
      const handler = jest.fn();
      el.addEventListener('change', handler);

      // Delete second and third items
      (deleteButtons?.[1] as HTMLButtonElement).click();
      (deleteButtons?.[2] as HTMLButtonElement).click();

      const event = handler.mock.calls[1][0] as {
        detail: {
          deleted: string[];
        };
      };

      // deleted should be an array of strings
      expect(Array.isArray(event.detail.deleted)).toBe(true);
      expect(event.detail.deleted.length).toBe(2);
      expect(event.detail.deleted[0]).toBe('delete1');
      expect(event.detail.deleted[1]).toBe('delete2');
      expect(typeof event.detail.deleted[0]).toBe('string');

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('should fire after DOM updates complete', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      let domStateAtEvent: number | null = null;

      el.addEventListener('change', () => {
        const rows = el.shadowRoot?.querySelectorAll('[role="listitem"]');
        domStateAtEvent = rows?.length ?? 0;
      });

      // Add an item
      el.addItem('test');

      // DOM should already be updated when event fires
      expect(domStateAtEvent).toBe(1);

      document.body.removeChild(el);
    });

    test('should dispatch change event when item added', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const handler = jest.fn();
      el.addEventListener('change', handler);

      el.addItem('new item');

      expect(handler).toHaveBeenCalledTimes(1);

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('should dispatch change event when item edited', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["original"]');
      document.body.appendChild(el);

      const handler = jest.fn();
      el.addEventListener('change', handler);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'edited';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(handler).toHaveBeenCalledTimes(1);

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('should dispatch change event when item soft deleted', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["item"]');
      document.body.appendChild(el);

      const handler = jest.fn();
      el.addEventListener('change', handler);

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      expect(handler).toHaveBeenCalledTimes(1);

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('should dispatch change event when delete undone', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["item"]');
      document.body.appendChild(el);

      // First delete
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const handler = jest.fn();
      el.addEventListener('change', handler);

      // Then undo
      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      undoBtn.click();

      expect(handler).toHaveBeenCalledTimes(1);

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('should dispatch change event when item hard removed', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["item"]');
      document.body.appendChild(el);

      const handler = jest.fn();
      el.addEventListener('change', handler);

      const removeBtn = el.shadowRoot?.querySelector(
        '[data-action="remove"]'
      ) as HTMLButtonElement;
      removeBtn.click();

      expect(handler).toHaveBeenCalledTimes(1);

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });
  });

  describe('Form Participation - Hidden Input Generation', () => {
    test('light DOM container exists with data-ckpa-fields attribute', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      document.body.appendChild(el);

      const container = el.querySelector('[data-ckpa-fields]');
      expect(container).toBeTruthy();

      document.body.removeChild(el);
    });

    test('hidden inputs created for items when name attribute set', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b"]');
      el.setAttribute('name', 'items');
      document.body.appendChild(el);

      const container = el.querySelector('[data-ckpa-fields]');
      const inputs = container?.querySelectorAll('input');
      expect(inputs?.length).toBe(2);

      document.body.removeChild(el);
    });

    test('hidden inputs have type="hidden"', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b"]');
      el.setAttribute('name', 'items');
      document.body.appendChild(el);

      const container = el.querySelector('[data-ckpa-fields]');
      const inputs = Array.from(container?.querySelectorAll('input') || []);
      inputs.forEach(input => {
        expect(input.type).toBe('hidden');
      });

      document.body.removeChild(el);
    });

    test('hidden inputs have correct values', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b"]');
      el.setAttribute('name', 'items');
      document.body.appendChild(el);

      const container = el.querySelector('[data-ckpa-fields]');
      const inputs = Array.from(
        container?.querySelectorAll('input') || []
      ) as HTMLInputElement[];
      expect(inputs[0].value).toBe('a');
      expect(inputs[1].value).toBe('b');

      document.body.removeChild(el);
    });

    test('no hidden inputs created without name attribute', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      const container = el.querySelector('[data-ckpa-fields]');
      const inputs = container?.querySelectorAll('input');
      expect(inputs?.length ?? 0).toBe(0);

      document.body.removeChild(el);
    });

    test('should reuse hidden inputs on edit to reduce DOM churn', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      document.body.appendChild(el);

      const container = el.querySelector('[data-ckpa-fields]');
      const originalInput = container?.querySelector('input');
      const originalReference = originalInput;

      const textInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      textInput.value = 'b';
      textInput.dispatchEvent(new window.Event('input', { bubbles: true }));

      const updatedInput = container?.querySelector('input');
      expect(updatedInput).toBe(originalReference); // Same DOM node
      expect(updatedInput?.value).toBe('b');

      document.body.removeChild(el);
    });

    test('container is in light DOM adjacent to shadow host', () => {
      const wrapper = document.createElement('div');
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      wrapper.appendChild(el);
      document.body.appendChild(wrapper);

      // Container should be a child of the element itself (light DOM)
      const container = el.querySelector('[data-ckpa-fields]');
      expect(container).toBeTruthy();
      expect(container?.parentElement).toBe(el);

      document.body.removeChild(wrapper);
    });

    test('all hidden inputs are inside container', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b","c"]');
      el.setAttribute('name', 'items');
      document.body.appendChild(el);

      const container = el.querySelector('[data-ckpa-fields]');
      const inputsInContainer = container?.querySelectorAll('input');
      const allInputsInLightDom = el.querySelectorAll('input');

      expect(inputsInContainer?.length).toBe(allInputsInLightDom.length);

      document.body.removeChild(el);
    });
  });

  describe('Form Participation - Name Attribute', () => {
    test('active items use name[] format', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      document.body.appendChild(el);

      const input = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(input.name).toBe('items[]');

      document.body.removeChild(el);
    });

    test('name change updates hidden inputs', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      document.body.appendChild(el);

      el.setAttribute('name', 'new');

      const input = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(input.name).toBe('new[]');

      document.body.removeChild(el);
    });

    test('name removal removes hidden inputs', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      document.body.appendChild(el);

      el.removeAttribute('name');

      const container = el.querySelector('[data-ckpa-fields]');
      const inputs = container?.querySelectorAll('input');
      expect(inputs?.length ?? 0).toBe(0);

      document.body.removeChild(el);
    });

    test('empty name treated as no name', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', '');
      document.body.appendChild(el);

      const container = el.querySelector('[data-ckpa-fields]');
      const inputs = container?.querySelectorAll('input');
      expect(inputs?.length ?? 0).toBe(0);

      document.body.removeChild(el);
    });

    test('special characters in name preserved', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'my-items');
      document.body.appendChild(el);

      const input = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(input.name).toBe('my-items[]');

      document.body.removeChild(el);
    });
  });

  describe('Form Participation - Deleted-Name Attribute', () => {
    test('deleted items use deleted-name[] format', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      el.setAttribute('deleted-name', 'removed');
      document.body.appendChild(el);

      // Soft delete the item
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const input = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(input.name).toBe('removed[]');

      document.body.removeChild(el);
    });

    test('no deleted inputs without deleted-name attribute', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      document.body.appendChild(el);

      // Soft delete the item
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const container = el.querySelector('[data-ckpa-fields]');
      const inputs = container?.querySelectorAll('input');
      expect(inputs?.length ?? 0).toBe(0);

      document.body.removeChild(el);
    });

    test('deleted-name change updates hidden inputs', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      el.setAttribute('deleted-name', 'removed');
      document.body.appendChild(el);

      // Soft delete the item
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      el.setAttribute('deleted-name', 'trashed');

      const input = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(input.name).toBe('trashed[]');

      document.body.removeChild(el);
    });

    test('soft delete moves hidden input from name to deleted-name', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      el.setAttribute('deleted-name', 'removed');
      document.body.appendChild(el);

      // Before delete - should use name[]
      let input = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(input.name).toBe('items[]');

      // Soft delete
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // After delete - should use deleted-name[]
      input = el.querySelector('[data-ckpa-fields] input') as HTMLInputElement;
      expect(input.name).toBe('removed[]');

      document.body.removeChild(el);
    });

    test('undo moves hidden input back from deleted-name to name', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('name', 'items');
      el.setAttribute('deleted-name', 'removed');
      document.body.appendChild(el);

      // Soft delete then undo
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click(); // delete
      deleteBtn.click(); // undo

      const input = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(input.name).toBe('items[]');

      document.body.removeChild(el);
    });
  });

  describe('Form Submission', () => {
    test('should include active items in form submission', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'items');
      el.setAttribute('items', '["a","b"]');
      form.appendChild(el);
      document.body.appendChild(form);

      const formData = new window.FormData(form);
      const items = formData.getAll('items[]');
      expect(items).toEqual(['a', 'b']);

      document.body.removeChild(form);
    });

    test('should include deleted items when deleted-name is set', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'items');
      el.setAttribute('deleted-name', 'removed');
      el.setAttribute('items', '["a","b"]');
      form.appendChild(el);
      document.body.appendChild(form);

      // Soft delete first item
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const formData = new window.FormData(form);
      const activeItems = formData.getAll('items[]');
      const deletedItems = formData.getAll('removed[]');
      expect(activeItems).toEqual(['b']);
      expect(deletedItems).toEqual(['a']);

      document.body.removeChild(form);
    });

    test('should exclude deleted items without deleted-name attribute', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'items');
      el.setAttribute('items', '["a","b"]');
      form.appendChild(el);
      document.body.appendChild(form);

      // Soft delete first item
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const formData = new window.FormData(form);
      const activeItems = formData.getAll('items[]');
      expect(activeItems).toEqual(['b']);
      // No deleted items should appear in FormData at all
      const allKeys = Array.from(formData.keys());
      expect(allKeys).toEqual(['items[]']);

      document.body.removeChild(form);
    });

    test('should have current values at submission time', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'items');
      el.setAttribute('items', '["original"]');
      form.appendChild(el);
      document.body.appendChild(form);

      // Edit the input
      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'edited';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      const formData = new window.FormData(form);
      const items = formData.getAll('items[]');
      expect(items).toEqual(['edited']);

      document.body.removeChild(form);
    });

    test('should submit no values when list is empty', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'items');
      form.appendChild(el);
      document.body.appendChild(form);

      const formData = new window.FormData(form);
      const items = formData.getAll('items[]');
      expect(items).toEqual([]);

      document.body.removeChild(form);
    });

    test('should prevent form submission when invalid item exists', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'items');
      el.setAttribute('items', '["valid",""]');
      form.appendChild(el);
      document.body.appendChild(form);

      // checkValidity should exist and return false for invalid items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(typeof (el as any).checkValidity).toBe('function');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isValid = (el as any).checkValidity();
      expect(isValid).toBe(false);

      document.body.removeChild(form);
    });
  });

  describe('Input Synchronization', () => {
    test('should create hidden inputs when items attribute and name attribute are set initially', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'tags');
      el.setAttribute('items', '["a","b"]');
      document.body.appendChild(el);

      const inputs = el.querySelectorAll('[data-ckpa-fields] input');
      expect(inputs).toHaveLength(2);
      expect((inputs[0] as HTMLInputElement).value).toBe('a');
      expect((inputs[1] as HTMLInputElement).value).toBe('b');
      expect((inputs[0] as HTMLInputElement).name).toBe('tags[]');
      expect((inputs[1] as HTMLInputElement).name).toBe('tags[]');

      document.body.removeChild(el);
    });

    test('should create new hidden input when item is added', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'tags');
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      // Verify initial state
      let inputs = el.querySelectorAll('[data-ckpa-fields] input');
      expect(inputs).toHaveLength(1);

      // Add a new item
      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      addButton.click();

      // Verify new hidden input was created
      inputs = el.querySelectorAll('[data-ckpa-fields] input');
      expect(inputs).toHaveLength(2);
      expect((inputs[1] as HTMLInputElement).name).toBe('tags[]');

      document.body.removeChild(el);
    });

    test('should update hidden input value when item is edited', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'tags');
      el.setAttribute('items', '["original"]');
      document.body.appendChild(el);

      const hiddenInput = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(hiddenInput.value).toBe('original');

      // Edit the input
      const textInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      textInput.value = 'edited';
      textInput.dispatchEvent(new window.Event('input', { bubbles: true }));

      // Verify hidden input was updated
      expect(hiddenInput.value).toBe('edited');

      document.body.removeChild(el);
    });

    test('should delete hidden input when item is permanently removed', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'tags');
      el.setAttribute('items', '["a","b","c"]');
      document.body.appendChild(el);

      // Verify initial state
      let inputs = el.querySelectorAll('[data-ckpa-fields] input');
      expect(inputs).toHaveLength(3);

      // Remove middle item
      const removeButtons = el.shadowRoot?.querySelectorAll(
        '[data-action="remove"]'
      );
      (removeButtons?.[1] as HTMLButtonElement).click();

      // Verify hidden input was removed
      inputs = el.querySelectorAll('[data-ckpa-fields] input');
      expect(inputs).toHaveLength(2);
      expect((inputs[0] as HTMLInputElement).value).toBe('a');
      expect((inputs[1] as HTMLInputElement).value).toBe('c');

      document.body.removeChild(el);
    });

    test('should transition hidden input to deleted-name when item is soft-deleted', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'items');
      el.setAttribute('deleted-name', 'removed');
      el.setAttribute('items', '["test"]');
      document.body.appendChild(el);

      // Verify initial state
      let hiddenInput = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(hiddenInput.name).toBe('items[]');
      expect(hiddenInput.value).toBe('test');

      // Soft delete the item
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // Verify hidden input name changed to deleted-name
      hiddenInput = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(hiddenInput.name).toBe('removed[]');
      expect(hiddenInput.value).toBe('test');

      document.body.removeChild(el);
    });

    test('should transition hidden input back to name when soft-deleted item is restored', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'items');
      el.setAttribute('deleted-name', 'removed');
      el.setAttribute('items', '["test"]');
      document.body.appendChild(el);

      // Soft delete the item
      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      // Verify it's in deleted state
      let hiddenInput = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(hiddenInput.name).toBe('removed[]');

      // Undo (restore the item)
      const undoBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      undoBtn.click();

      // Verify hidden input name changed back to name
      hiddenInput = el.querySelector(
        '[data-ckpa-fields] input'
      ) as HTMLInputElement;
      expect(hiddenInput.name).toBe('items[]');
      expect(hiddenInput.value).toBe('test');

      document.body.removeChild(el);
    });

    test('should refresh hidden inputs when items attribute is updated', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'tags');
      el.setAttribute('items', '["a","b"]');
      document.body.appendChild(el);

      // Verify initial state
      let inputs = el.querySelectorAll('[data-ckpa-fields] input');
      expect(inputs).toHaveLength(2);
      expect((inputs[0] as HTMLInputElement).value).toBe('a');
      expect((inputs[1] as HTMLInputElement).value).toBe('b');

      // Update items attribute
      el.setAttribute('items', '["x","y","z"]');

      // Verify hidden inputs reflect new items
      inputs = el.querySelectorAll('[data-ckpa-fields] input');
      expect(inputs).toHaveLength(3);
      expect((inputs[0] as HTMLInputElement).value).toBe('x');
      expect((inputs[1] as HTMLInputElement).value).toBe('y');
      expect((inputs[2] as HTMLInputElement).value).toBe('z');
      expect((inputs[0] as HTMLInputElement).name).toBe('tags[]');
      expect((inputs[1] as HTMLInputElement).name).toBe('tags[]');
      expect((inputs[2] as HTMLInputElement).name).toBe('tags[]');

      document.body.removeChild(el);
    });
  });

  describe('Keyboard Shortcuts - Ctrl/Cmd+Enter Form Submission', () => {
    test('Ctrl+Enter submits form (Windows/Linux)', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      form.appendChild(el);
      document.body.appendChild(form);

      let submitCalled = false;
      form.addEventListener('submit', e => {
        e.preventDefault();
        submitCalled = true;
      });

      // Focus the input
      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      input.focus();

      // Simulate Ctrl+Enter
      const ctrlEnterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        ctrlKey: true,
        bubbles: true,
      });
      input.dispatchEvent(ctrlEnterEvent);

      expect(submitCalled).toBe(true);

      document.body.removeChild(form);
    });

    test('Cmd+Enter submits form (Mac)', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      form.appendChild(el);
      document.body.appendChild(form);

      let submitCalled = false;
      form.addEventListener('submit', e => {
        e.preventDefault();
        submitCalled = true;
      });

      // Focus the input
      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      input.focus();

      // Simulate Cmd+Enter
      const cmdEnterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        metaKey: true,
        bubbles: true,
      });
      input.dispatchEvent(cmdEnterEvent);

      expect(submitCalled).toBe(true);

      document.body.removeChild(form);
    });

    test('Ctrl/Cmd+Enter does nothing when not in a form', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["test item"]');
      document.body.appendChild(el);

      // Focus the input
      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      input.focus();

      // Simulate Ctrl+Enter (should not throw error)
      const ctrlEnterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        ctrlKey: true,
        bubbles: true,
      });

      expect(() => {
        input.dispatchEvent(ctrlEnterEvent);
      }).not.toThrow();

      document.body.removeChild(el);
    });

    test('Current input saved before submit', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'tags');
      el.setAttribute('items', '["old value"]');
      form.appendChild(el);
      document.body.appendChild(form);

      let submittedValues: string[] = [];
      form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new window.FormData(form);
        submittedValues = data.getAll('tags[]') as string[];
      });

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;

      input.value = 'new value';

      const ctrlEnterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        ctrlKey: true,
        bubbles: true,
      });
      input.dispatchEvent(ctrlEnterEvent);

      expect(submittedValues).toEqual(['new value']);

      document.body.removeChild(form);
    });

    test('Ctrl+Enter submits form when readonly', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('readonly', '');
      el.setAttribute('items', '["test item"]');
      form.appendChild(el);
      document.body.appendChild(form);

      let submitCalled = false;
      form.addEventListener('submit', e => {
        e.preventDefault();
        submitCalled = true;
      });

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      input.focus();

      const ctrlEnterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        ctrlKey: true,
        bubbles: true,
      });
      input.dispatchEvent(ctrlEnterEvent);

      expect(submitCalled).toBe(true);

      document.body.removeChild(form);
    });
  });

  describe('Validation - Empty and Whitespace Rejection', () => {
    test('should show error when input is empty string', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-invalid')).toBe('true');
      const errorMsg = el.shadowRoot?.querySelector('[data-error]');
      expect(errorMsg).toBeTruthy();

      document.body.removeChild(el);
    });

    test('should show error when input is whitespace only', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = '   ';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-invalid')).toBe('true');
      const errorMsg = el.shadowRoot?.querySelector('[data-error]');
      expect(errorMsg).toBeTruthy();

      document.body.removeChild(el);
    });

    test('should display error message below input', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      const itemRow = el.shadowRoot?.querySelector('[role="listitem"]');
      const errorMsg = itemRow?.querySelector('[data-error]');
      expect(errorMsg).toBeTruthy();
      expect(errorMsg?.textContent).toContain('required');

      document.body.removeChild(el);
    });

    test('should apply invalid CSS class on validation error', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(input.classList.contains('has-error')).toBe(true);

      document.body.removeChild(el);
    });

    test('should clear error when valid value entered', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;

      // Set invalid
      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).toBe('true');

      // Set valid
      input.value = 'valid value';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });
  });

  describe('Validation - Duplicate Detection', () => {
    test('should show error for duplicate values by default', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["apple", "banana"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll(
          '[role="listitem"] input[type="text"]'
        ) || []
      ) as HTMLInputElement[];

      // Change second item to match first
      inputs[1].value = 'apple';
      inputs[1].dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(inputs[1].getAttribute('aria-invalid')).toBe('true');

      document.body.removeChild(el);
    });

    test('should permit duplicates with allow-duplicates attribute', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('allow-duplicates', '');
      el.setAttribute('items', '["apple", "banana"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll(
          '[role="listitem"] input[type="text"]'
        ) || []
      ) as HTMLInputElement[];

      inputs[1].value = 'apple';
      inputs[1].dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(inputs[1].getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });

    test('should be case-sensitive by default', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["Apple"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll(
          '[role="listitem"] input[type="text"]'
        ) || []
      ) as HTMLInputElement[];

      inputs[1].value = 'apple';
      inputs[1].dispatchEvent(new window.Event('input', { bubbles: true }));

      // Should not be invalid because "apple" != "Apple"
      expect(inputs[1].getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });

    test('should exclude soft-deleted items from duplicate check', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["apple", "banana"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll(
          '[role="listitem"] input[type="text"]'
        ) || []
      ) as HTMLInputElement[];

      inputs[1].value = 'apple';
      inputs[1].dispatchEvent(new window.Event('input', { bubbles: true }));

      // Should not be invalid because first item is soft-deleted
      expect(inputs[1].getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });

    test('should clear duplicate error when value becomes unique', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["apple", "banana"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll(
          '[role="listitem"] input[type="text"]'
        ) || []
      ) as HTMLInputElement[];

      inputs[1].value = 'apple';
      inputs[1].dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(inputs[1].getAttribute('aria-invalid')).toBe('true');

      inputs[1].value = 'cherry';
      inputs[1].dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(inputs[1].getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });

    test('should update error when allow-duplicates attribute changes', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["apple", "banana"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll(
          '[role="listitem"] input[type="text"]'
        ) || []
      ) as HTMLInputElement[];

      inputs[1].value = 'apple';
      inputs[1].dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(inputs[1].getAttribute('aria-invalid')).toBe('true');

      el.setAttribute('allow-duplicates', '');
      inputs[1].dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(inputs[1].getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });
  });

  describe('Validation - Minlength and Maxlength', () => {
    test('should show error when value is below minlength', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('minlength', '3');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'ab';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-invalid')).toBe('true');

      document.body.removeChild(el);
    });

    test('should be valid when value meets minlength', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('minlength', '3');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'abc';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });

    test('should show error when value exceeds maxlength', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('maxlength', '5');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'abcdef';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-invalid')).toBe('true');

      document.body.removeChild(el);
    });

    test('should be valid when value is at maxlength', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('maxlength', '5');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'abcde';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });

    test('should validate both minlength and maxlength together', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('minlength', '2');
      el.setAttribute('maxlength', '5');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;

      // Too short
      input.value = 'a';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).toBe('true');

      // Valid
      input.value = 'abc';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).not.toBe('true');

      // Too long
      input.value = 'abcdef';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).toBe('true');

      document.body.removeChild(el);
    });

    test('should show length validation error message', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('minlength', '3');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'ab';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      const errorMsg = el.shadowRoot?.querySelector('[data-error]');
      expect(errorMsg?.textContent).toContain('3');

      document.body.removeChild(el);
    });
  });

  describe('Validation - Pattern', () => {
    test('should be valid when value matches pattern', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('pattern', '[a-z]+');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'abc';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });

    test('should show error when value does not match pattern', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('pattern', '[a-z]+');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'abc123';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-invalid')).toBe('true');

      document.body.removeChild(el);
    });

    test('should anchor pattern to match entire value', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('pattern', 'test');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;

      input.value = 'testing';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).toBe('true');

      input.value = 'test';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });

    test('should support complex regex patterns', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('pattern', '\\d{3}-\\d{4}');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;

      input.value = '123-4567';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).not.toBe('true');

      input.value = '123-456';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).toBe('true');

      document.body.removeChild(el);
    });

    test('should ignore pattern for empty value and show empty error', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('pattern', '[a-z]+');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      // Should show empty error, not pattern error
      const errorMsg = el.shadowRoot?.querySelector('[data-error]');
      expect(errorMsg?.textContent).not.toContain('format');
      expect(errorMsg?.textContent).toContain('required');

      document.body.removeChild(el);
    });

    test('should log error for invalid regex pattern', () => {
      const consoleSpy = jest
        .spyOn(globalThis.console, 'error')
        .mockImplementation();

      const el = new CkPrimitiveArray();
      el.setAttribute('pattern', '[invalid');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      document.body.removeChild(el);
    });
  });

  describe('Validation - Required Attribute', () => {
    test('should show error when required and list is empty', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('required', '');
      document.body.appendChild(el);
      el.connectedCallback();

      const errorMsg = el.shadowRoot?.querySelector('[data-required-error]');
      expect(errorMsg).toBeTruthy();

      document.body.removeChild(el);
    });

    test('should be valid when required and has at least one active item', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('required', '');
      el.setAttribute('items', '["apple"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const errorMsg = el.shadowRoot?.querySelector('[data-required-error]');
      expect(errorMsg).not.toBeTruthy();

      document.body.removeChild(el);
    });

    test('should show error when required and all items are soft-deleted', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('required', '');
      el.setAttribute('items', '["apple"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const errorMsg = el.shadowRoot?.querySelector('[data-required-error]');
      expect(errorMsg).toBeTruthy();

      document.body.removeChild(el);
    });

    test('should clear error when item is added to required empty list', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('required', '');
      document.body.appendChild(el);

      let errorMsg = el.shadowRoot?.querySelector('[data-required-error]');
      expect(errorMsg).toBeTruthy();

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'apple';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      errorMsg = el.shadowRoot?.querySelector('[data-required-error]');
      expect(errorMsg).not.toBeTruthy();

      document.body.removeChild(el);
    });

    test('should show error when last item in required list is removed', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('required', '');
      el.setAttribute('items', '["apple"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const removeBtn = el.shadowRoot?.querySelector(
        '[data-action="remove"]'
      ) as HTMLButtonElement;
      removeBtn.click();

      const errorMsg = el.shadowRoot?.querySelector('[data-required-error]');
      expect(errorMsg).toBeTruthy();

      document.body.removeChild(el);
    });

    test('should prevent form submission when required and empty', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('required', '');
      el.setAttribute('name', 'items');
      const form = document.createElement('form');
      form.appendChild(el);
      document.body.appendChild(form);
      el.connectedCallback();

      const submitEvent = new window.Event('submit', { bubbles: true });
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

      form.dispatchEvent(submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();

      document.body.removeChild(form);
    });
  });

  describe('Validation - Min and Max Item Count', () => {
    test('should show error when item count is below min', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('min', '2');
      el.setAttribute('items', '["apple"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const errorMsg = el.shadowRoot?.querySelector('[data-min-error]');
      expect(errorMsg).toBeTruthy();

      document.body.removeChild(el);
    });

    test('should be valid when item count is at min', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('min', '2');
      el.setAttribute('items', '["apple", "banana"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const errorMsg = el.shadowRoot?.querySelector('[data-min-error]');
      expect(errorMsg).not.toBeTruthy();

      document.body.removeChild(el);
    });

    test('should show error when item count exceeds max', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('max', '3');
      el.setAttribute('items', '["apple", "banana", "cherry", "date"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const errorMsg = el.shadowRoot?.querySelector('[data-max-error]');
      expect(errorMsg).toBeTruthy();

      document.body.removeChild(el);
    });

    test('should be valid when item count is at max', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('max', '3');
      el.setAttribute('items', '["apple", "banana", "cherry"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const errorMsg = el.shadowRoot?.querySelector('[data-max-error]');
      expect(errorMsg).not.toBeTruthy();

      document.body.removeChild(el);
    });

    test('should disable Add button when at max items', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('max', '2');
      el.setAttribute('items', '["apple", "banana"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const addBtn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      expect(addBtn.disabled).toBe(true);

      document.body.removeChild(el);
    });

    test('should count only active items for min validation', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('min', '2');
      el.setAttribute('items', '["apple", "banana"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const deleteBtn = el.shadowRoot?.querySelector(
        '[data-action="delete"]'
      ) as HTMLButtonElement;
      deleteBtn.click();

      const errorMsg = el.shadowRoot?.querySelector('[data-min-error]');
      expect(errorMsg).toBeTruthy();

      document.body.removeChild(el);
    });
  });

  describe('Error Display', () => {
    test('should show error for the specific invalid input', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('minlength', '3');
      el.setAttribute('items', '["alpha", "beta"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll(
          '[role="listitem"] input[type="text"]'
        ) || []
      ) as HTMLInputElement[];

      inputs[0].value = 'a';
      inputs[0].dispatchEvent(new window.Event('input', { bubbles: true }));

      const firstRow = inputs[0].closest('[role="listitem"]');
      const secondRow = inputs[1].closest('[role="listitem"]');
      const firstError = firstRow?.querySelector('[data-error]');
      const secondError = secondRow?.querySelector('[data-error]');

      expect(firstError).toBeTruthy();
      expect(secondError).not.toBeTruthy();

      const children = Array.from(firstRow?.children || []);
      const errorIndex = children.findIndex(child => child === firstError);
      const inputIndex = children.indexOf(inputs[0]);
      expect(errorIndex).toBeGreaterThan(inputIndex);

      document.body.removeChild(el);
    });

    test('should apply error class to the error message', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      const errorMsg = el.shadowRoot?.querySelector('[data-error]');
      expect(errorMsg?.classList.contains('has-error')).toBe(true);

      document.body.removeChild(el);
    });

    test('should show errors independently for multiple invalid rows', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('minlength', '3');
      el.setAttribute('items', '["aa", "bb"]');
      document.body.appendChild(el);
      el.connectedCallback();

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll(
          '[role="listitem"] input[type="text"]'
        ) || []
      ) as HTMLInputElement[];

      inputs.forEach(input => {
        input.dispatchEvent(new window.Event('input', { bubbles: true }));
      });

      const rows = Array.from(
        el.shadowRoot?.querySelectorAll('[role="listitem"]') || []
      );
      rows.forEach(row => {
        const error = row.querySelector('[data-error]');
        expect(error).toBeTruthy();
      });

      document.body.removeChild(el);
    });

    test('should remove error element when value becomes valid', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;

      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(el.shadowRoot?.querySelector('[data-error]')).toBeTruthy();

      input.value = 'valid';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(el.shadowRoot?.querySelector('[data-error]')).not.toBeTruthy();

      document.body.removeChild(el);
    });

    test('should provide descriptive error messages', () => {
      const getErrorText = (target: CkPrimitiveArray) =>
        target.shadowRoot?.querySelector('[data-error]')?.textContent || '';

      const requiredEl = new CkPrimitiveArray();
      document.body.appendChild(requiredEl);
      const requiredBtn = requiredEl.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      requiredBtn.click();
      const requiredInput = requiredEl.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      requiredInput.value = '';
      requiredInput.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(getErrorText(requiredEl)).toMatch(/required/i);
      document.body.removeChild(requiredEl);

      const minEl = new CkPrimitiveArray();
      minEl.setAttribute('minlength', '3');
      document.body.appendChild(minEl);
      const minBtn = minEl.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      minBtn.click();
      const minInput = minEl.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      minInput.value = 'ab';
      minInput.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(getErrorText(minEl)).toMatch(/at least/i);
      document.body.removeChild(minEl);

      const maxEl = new CkPrimitiveArray();
      maxEl.setAttribute('maxlength', '2');
      document.body.appendChild(maxEl);
      const maxBtn = maxEl.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      maxBtn.click();
      const maxInput = maxEl.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      maxInput.value = 'abcd';
      maxInput.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(getErrorText(maxEl)).toMatch(/no more than/i);
      document.body.removeChild(maxEl);

      const patternEl = new CkPrimitiveArray();
      patternEl.setAttribute('pattern', '[a-z]+');
      document.body.appendChild(patternEl);
      const patternBtn = patternEl.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      patternBtn.click();
      const patternInput = patternEl.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      patternInput.value = '123';
      patternInput.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(getErrorText(patternEl)).toMatch(/format/i);
      document.body.removeChild(patternEl);

      const duplicateEl = new CkPrimitiveArray();
      duplicateEl.setAttribute('items', '["apple", "banana"]');
      document.body.appendChild(duplicateEl);
      duplicateEl.connectedCallback();
      const duplicateInputs = Array.from(
        duplicateEl.shadowRoot?.querySelectorAll(
          '[role="listitem"] input[type="text"]'
        ) || []
      ) as HTMLInputElement[];
      duplicateInputs[1].value = 'apple';
      duplicateInputs[1].dispatchEvent(
        new window.Event('input', { bubbles: true })
      );
      expect(getErrorText(duplicateEl)).toMatch(/exist/i);
      document.body.removeChild(duplicateEl);
    });

    test('should link input to error with aria-describedby', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const error = el.shadowRoot?.getElementById(describedBy || '');
      expect(error).toBeTruthy();
      expect(error?.textContent).not.toBe('');

      document.body.removeChild(el);
    });

    test('should show list level required error when empty', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('required', '');
      document.body.appendChild(el);
      el.connectedCallback();

      const error = el.shadowRoot?.querySelector('[data-required-error]');
      expect(error).toBeTruthy();

      document.body.removeChild(el);
    });

    test('should prioritize empty error over pattern error', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('pattern', '[a-z]+');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      const errorMsg = el.shadowRoot?.querySelector('[data-error]');
      expect(errorMsg?.textContent).toContain('required');
      expect(errorMsg?.textContent).not.toContain('format');

      document.body.removeChild(el);
    });
  });

  describe('Live Validation Timing', () => {
    test('should validate on every input event', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('minlength', '3');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;

      input.value = 'a';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).toBe('true');

      input.value = 'ab';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).toBe('true');

      input.value = 'abc';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(input.getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });

    test('should show error immediately on invalid input', () => {
      const el = new CkPrimitiveArray();
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = '';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      const error = el.shadowRoot?.querySelector('[data-error]');
      expect(error).toBeTruthy();
      expect(input.getAttribute('aria-invalid')).toBe('true');

      document.body.removeChild(el);
    });

    test('should clear error immediately when corrected', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('minlength', '3');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'a';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(el.shadowRoot?.querySelector('[data-error]')).toBeTruthy();

      input.value = 'abcd';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      expect(el.shadowRoot?.querySelector('[data-error]')).not.toBeTruthy();
      expect(input.getAttribute('aria-invalid')).not.toBe('true');

      document.body.removeChild(el);
    });

    test('should validate without delay on rapid input', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('minlength', '3');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'a';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      input.value = 'abcd';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-invalid')).not.toBe('true');
      expect(el.shadowRoot?.querySelector('[data-error]')).not.toBeTruthy();

      document.body.removeChild(el);
    });

    test('should validate when content is pasted', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('minlength', '5');
      document.body.appendChild(el);

      const btn = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      btn.click();

      const input = el.shadowRoot?.querySelector(
        '[role="listitem"] input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'abc';
      const pasteEvent =
        typeof window.InputEvent === 'function'
          ? new window.InputEvent('input', {
              bubbles: true,
              inputType: 'insertFromPaste',
            })
          : new window.Event('input', { bubbles: true });
      input.dispatchEvent(pasteEvent);

      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(el.shadowRoot?.querySelector('[data-error]')).toBeTruthy();

      document.body.removeChild(el);
    });
  });

  describe('State Attributes - Disabled', () => {
    test('disables all inputs when disabled is set', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b"]');
      el.setAttribute('disabled', '');
      document.body.appendChild(el);

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll('input[type="text"]') || []
      ) as HTMLInputElement[];
      expect(inputs.length).toBe(2);
      inputs.forEach(input => {
        expect(input.disabled).toBe(true);
      });

      document.body.removeChild(el);
    });

    test('disables delete buttons when disabled is set', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b"]');
      el.setAttribute('disabled', '');
      document.body.appendChild(el);

      const buttons = Array.from(
        el.shadowRoot?.querySelectorAll('button[data-action="delete"]') || []
      ) as HTMLButtonElement[];
      expect(buttons.length).toBe(2);
      buttons.forEach(button => {
        expect(button.disabled).toBe(true);
      });

      document.body.removeChild(el);
    });

    test('disables remove buttons when disabled is set', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b"]');
      el.setAttribute('disabled', '');
      document.body.appendChild(el);

      const buttons = Array.from(
        el.shadowRoot?.querySelectorAll('button[data-action="remove"]') || []
      ) as HTMLButtonElement[];
      expect(buttons.length).toBe(2);
      buttons.forEach(button => {
        expect(button.disabled).toBe(true);
      });

      document.body.removeChild(el);
    });

    test('enter key does not add item when disabled', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('disabled', '');
      document.body.appendChild(el);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      const initialCount = el.items.length;

      const enterEvent = new window.KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      input.dispatchEvent(enterEvent);

      expect(el.items.length).toBe(initialCount);

      document.body.removeChild(el);
    });

    test('addItem is a no-op when disabled', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('disabled', '');
      document.body.appendChild(el);

      el.addItem('should-not-add');

      expect(el.items.length).toBe(0);
      const inputs = el.shadowRoot?.querySelectorAll('input[type="text"]');
      expect(inputs?.length ?? 0).toBe(0);

      document.body.removeChild(el);
    });

    test('removing disabled restores enabled inputs', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('disabled', '');
      document.body.appendChild(el);

      const disabledInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      expect(disabledInput.disabled).toBe(true);

      el.removeAttribute('disabled');

      const enabledInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      expect(enabledInput.disabled).toBe(false);

      document.body.removeChild(el);
    });

    test('applies disabled visual state styling', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('disabled', '');
      document.body.appendChild(el);

      const container = el.shadowRoot?.querySelector(
        '.ck-primitive-array'
      ) as HTMLElement | null;
      expect(container?.classList.contains('is-disabled')).toBe(true);

      document.body.removeChild(el);
    });

    test('change events still dispatch when disabled is set programmatically', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      el.setAttribute('disabled', '');

      const handler = jest.fn();
      el.addEventListener('change', handler);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'edited';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as {
        detail: {
          items: Array<{ id: string; value: string; deleted: boolean }>;
        };
      };
      expect(event.detail.items[0].value).toBe('edited');

      el.removeEventListener('change', handler);
      document.body.removeChild(el);
    });

    test('form submission includes values when disabled', () => {
      const form = document.createElement('form');
      const el = new CkPrimitiveArray();
      el.setAttribute('name', 'items');
      el.setAttribute('items', '["a","b"]');
      el.setAttribute('disabled', '');
      form.appendChild(el);
      document.body.appendChild(form);

      const formData = new window.FormData(form);
      const items = formData.getAll('items[]');
      expect(items).toEqual(['a', 'b']);

      document.body.removeChild(form);
    });
  });

  describe('State Attributes - Readonly', () => {
    test('sets inputs to readonly when readonly is set', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b"]');
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      const inputs = Array.from(
        el.shadowRoot?.querySelectorAll('input[type="text"]') || []
      ) as HTMLInputElement[];
      expect(inputs.length).toBe(2);
      inputs.forEach(input => {
        expect(input.readOnly).toBe(true);
        expect(input.disabled).toBe(false);
      });

      document.body.removeChild(el);
    });

    test('disables delete buttons when readonly is set', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b"]');
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      const buttons = Array.from(
        el.shadowRoot?.querySelectorAll('button[data-action="delete"]') || []
      ) as HTMLButtonElement[];
      expect(buttons.length).toBe(2);
      buttons.forEach(button => {
        expect(button.disabled).toBe(true);
      });

      document.body.removeChild(el);
    });

    test('disables remove buttons when readonly is set', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a","b"]');
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      const buttons = Array.from(
        el.shadowRoot?.querySelectorAll('button[data-action="remove"]') || []
      ) as HTMLButtonElement[];
      expect(buttons.length).toBe(2);
      buttons.forEach(button => {
        expect(button.disabled).toBe(true);
      });

      document.body.removeChild(el);
    });

    test('addItem is a no-op when readonly', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      el.addItem('should-not-add');

      expect(el.items.length).toBe(0);
      const inputs = el.shadowRoot?.querySelectorAll('input[type="text"]');
      expect(inputs?.length ?? 0).toBe(0);

      document.body.removeChild(el);
    });

    test('removing readonly restores editable inputs', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      const readonlyInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      expect(readonlyInput.readOnly).toBe(true);

      el.removeAttribute('readonly');

      const editableInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      expect(editableInput.readOnly).toBe(false);

      document.body.removeChild(el);
    });

    test('applies readonly visual state styling', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      const container = el.shadowRoot?.querySelector(
        '.ck-primitive-array'
      ) as HTMLElement | null;
      expect(container?.classList.contains('is-readonly')).toBe(true);

      document.body.removeChild(el);
    });

    test('readonly inputs remain focusable', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      input.focus();

      expect(el.shadowRoot?.activeElement).toBe(input);
      expect(input.readOnly).toBe(true);
      expect(input.disabled).toBe(false);

      document.body.removeChild(el);
    });
  });

  describe('State Attributes - Dynamic Toggling', () => {
    test('adding disabled updates controls immediately', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      const initialInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      expect(initialInput.disabled).toBe(false);

      el.setAttribute('disabled', '');

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      const deleteButton = el.shadowRoot?.querySelector(
        'button[data-action="delete"]'
      ) as HTMLButtonElement;
      const removeButton = el.shadowRoot?.querySelector(
        'button[data-action="remove"]'
      ) as HTMLButtonElement;
      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      expect(input.disabled).toBe(true);
      expect(deleteButton.disabled).toBe(true);
      expect(removeButton.disabled).toBe(true);
      expect(addButton.disabled).toBe(true);

      document.body.removeChild(el);
    });

    test('removing disabled updates controls immediately', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('disabled', '');
      document.body.appendChild(el);

      const disabledInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      expect(disabledInput.disabled).toBe(true);

      el.removeAttribute('disabled');

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      const deleteButton = el.shadowRoot?.querySelector(
        'button[data-action="delete"]'
      ) as HTMLButtonElement;
      const removeButton = el.shadowRoot?.querySelector(
        'button[data-action="remove"]'
      ) as HTMLButtonElement;
      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      expect(input.disabled).toBe(false);
      expect(deleteButton.disabled).toBe(false);
      expect(removeButton.disabled).toBe(false);
      expect(addButton.disabled).toBe(false);

      document.body.removeChild(el);
    });

    test('adding readonly updates controls immediately', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      const initialInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      expect(initialInput.readOnly).toBe(false);

      el.setAttribute('readonly', '');

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      const deleteButton = el.shadowRoot?.querySelector(
        'button[data-action="delete"]'
      ) as HTMLButtonElement;
      const removeButton = el.shadowRoot?.querySelector(
        'button[data-action="remove"]'
      ) as HTMLButtonElement;
      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      expect(input.readOnly).toBe(true);
      expect(deleteButton.disabled).toBe(true);
      expect(removeButton.disabled).toBe(true);
      expect(addButton.disabled).toBe(true);

      document.body.removeChild(el);
    });

    test('removing readonly updates controls immediately', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      const readonlyInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      expect(readonlyInput.readOnly).toBe(true);

      el.removeAttribute('readonly');

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      const deleteButton = el.shadowRoot?.querySelector(
        'button[data-action="delete"]'
      ) as HTMLButtonElement;
      const removeButton = el.shadowRoot?.querySelector(
        'button[data-action="remove"]'
      ) as HTMLButtonElement;
      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      expect(input.readOnly).toBe(false);
      expect(deleteButton.disabled).toBe(false);
      expect(removeButton.disabled).toBe(false);
      expect(addButton.disabled).toBe(false);

      document.body.removeChild(el);
    });

    test('combining disabled and readonly applies both effects', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      el.setAttribute('disabled', '');
      el.setAttribute('readonly', '');
      document.body.appendChild(el);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      const deleteButton = el.shadowRoot?.querySelector(
        'button[data-action="delete"]'
      ) as HTMLButtonElement;
      const removeButton = el.shadowRoot?.querySelector(
        'button[data-action="remove"]'
      ) as HTMLButtonElement;
      const addButton = el.shadowRoot?.querySelector(
        'button.add-item'
      ) as HTMLButtonElement;
      expect(input.disabled).toBe(true);
      expect(input.readOnly).toBe(true);
      expect(deleteButton.disabled).toBe(true);
      expect(removeButton.disabled).toBe(true);
      expect(addButton.disabled).toBe(true);

      document.body.removeChild(el);
    });

    test('disabling during edit preserves value and disables input', () => {
      const el = new CkPrimitiveArray();
      el.setAttribute('items', '["a"]');
      document.body.appendChild(el);

      const input = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      input.value = 'edited';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      el.setAttribute('disabled', '');

      const updatedInput = el.shadowRoot?.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      expect(updatedInput.value).toBe('edited');
      expect(updatedInput.disabled).toBe(true);

      document.body.removeChild(el);
    });
  });
});
