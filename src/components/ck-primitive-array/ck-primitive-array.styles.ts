export const ckPrimitiveArrayCSS = `
:host {
  display: block;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.ck-primitive-array {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.ck-primitive-array:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.ck-primitive-array__message {
  font-size: 1.5rem;
  margin: 0;
  /* per-instance color via CSS custom property */
  color: var(--ck-primitive-array-color, #333);
}

.ck-primitive-array__subtitle {
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.8;
}
`;

// Try to create a constructable stylesheet where supported. Fall back to null.
export const ckPrimitiveArraySheet: CSSStyleSheet | null = (() => {
  try {
    // CSSStyleSheet may not be available in older browsers
    // create and populate the sheet once at module-eval time
    // so it gets parsed only once.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: may not exist in all targets
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(ckPrimitiveArrayCSS);
    return sheet;
  } catch {
    return null;
  }
})();