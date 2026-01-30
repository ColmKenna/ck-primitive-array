export const ckPrimitiveArrayCSS = `
:host {
  display: block;
  --ck-primitive-array-background: transparent;
  --ck-primitive-array-color: inherit;
  --ck-primitive-array-padding: 0;
  --ck-primitive-array-border-radius: 0;
  --ck-primitive-array-box-shadow: none;
  --ck-primitive-array-text-align: center;
  --ck-primitive-array-message-font-size: 1.5rem;
  --ck-primitive-array-subtitle-font-size: 1rem;
  --ck-primitive-array-subtitle-opacity: 0.8;
}

.ck-primitive-array {
  background: var(--ck-primitive-array-background);
  color: var(--ck-primitive-array-color);
  padding: var(--ck-primitive-array-padding);
  border-radius: var(--ck-primitive-array-border-radius);
  text-align: var(--ck-primitive-array-text-align);
  box-shadow: var(--ck-primitive-array-box-shadow);
}

.ck-primitive-array__message {
  font-size: var(--ck-primitive-array-message-font-size);
  margin: 0;
  color: var(--ck-primitive-array-color);
}

.ck-primitive-array__subtitle {
  font-size: var(--ck-primitive-array-subtitle-font-size);
  margin: 0.5rem 0 0 0;
  opacity: var(--ck-primitive-array-subtitle-opacity);
}

.ck-primitive-array__controls {
  margin-top: 1rem;
}

.ck-primitive-array__list {
  margin-top: 1rem;
  display: grid;
  gap: 0.5rem;
}

.ck-primitive-array__item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.5rem;
  align-items: center;
}

.ck-primitive-array__input {
  padding: 0.4rem 0.6rem;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  font-size: 0.95rem;
}

.ck-primitive-array__item.has-error .ck-primitive-array__input {
  border-color: #d73a49;
  background: #fff5f5;
}

.ck-primitive-array__error {
  grid-column: 1 / -1;
  color: #d73a49;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  text-align: left;
}

.ck-primitive-array__delete,
.ck-primitive-array__remove {
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.ck-primitive-array__delete {
  background: #f0f2f5;
  color: #24292f;
}

.ck-primitive-array__remove {
  background: #d73a49;
  color: #fff;
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
