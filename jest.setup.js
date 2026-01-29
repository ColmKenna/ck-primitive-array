// Jest setup file for DOM testing

// Mock any global APIs or setup that your components might need
Object.defineProperty(window, 'customElements', {
  value: window.customElements || {
    define: jest.fn(),
    get: jest.fn(),
    whenDefined: jest.fn(() => Promise.resolve()),
  },
  writable: true,
});

// Setup for any additional globals your web components might need
global.HTMLElement = window.HTMLElement;
global.HTMLInputElement = window.HTMLInputElement || class extends window.HTMLElement {};
global.HTMLButtonElement = window.HTMLButtonElement || class extends window.HTMLElement {};
global.FormData = window.FormData;
global.customElements = window.customElements;
