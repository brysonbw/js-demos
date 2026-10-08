import { describe, expect, it } from 'vitest';

import { ROUTES } from '../constants.js';
import {
  createPageHeading,
  getDemoNumber,
  padIndex,
  stripModuleSyntax,
} from '../helpers.js';

describe('createPageHeading', () => {
  it('lets the eyebrow and title be overridden', () => {
    const header = createPageHeading(ROUTES.HOME.route, {
      eyebrow: 'Home',
      title: 'What is it?',
    });
    expect(header.querySelector('.eyebrow').textContent).toBe('Home');
    expect(header.querySelector('#page-title').textContent).toBe('What is it?');
    expect(header.querySelector('p:last-child').textContent).toBe(
      ROUTES.HOME.description
    );
  });

  it('builds the heading from the ROUTES entry and demo number', () => {
    const header = createPageHeading(ROUTES.TODO_LIST.route);
    expect(header).toHaveClass('page-heading');
    expect(header.querySelector('.eyebrow').textContent).toBe('Page 02');
    expect(header.querySelector('#page-title').textContent).toBe(
      ROUTES.TODO_LIST.title
    );
    expect(header.querySelector('p:last-child').textContent).toBe(
      ROUTES.TODO_LIST.description
    );
  });
});

describe('stripModuleSyntax', () => {
  it('removes single-line, side-effect and multi-line imports', () => {
    const source = [
      "import { ROUTES } from '../../utils/constants.js';",
      "import './index.css';",
      'import {',
      '  a,',
      '  b,',
      "} from '../x.js';",
      '',
      'function render() {}',
      'export { render };',
      '',
    ].join('\n');
    expect(stripModuleSyntax(source)).toBe('function render() {}\n');
  });

  it('removes export keywords from declarations', () => {
    const source =
      'export const a = 1;\nexport default function b() {}\nexport async function c() {}\n';
    expect(stripModuleSyntax(source)).toBe(
      'const a = 1;\nfunction b() {}\nasync function c() {}\n'
    );
  });

  it('leaves source without imports unchanged', () => {
    const source = 'const important = 1;\n';
    expect(stripModuleSyntax(source)).toBe(source);
  });
});

describe('getDemoNumber', () => {
  it('returns the padded position of a demo route', () => {
    expect(getDemoNumber(ROUTES.CONTACT.route)).toBe('01');
    expect(getDemoNumber(ROUTES.TODO_LIST.route)).toBe('02');
    expect(getDemoNumber(ROUTES.PRODUCTS_LIST.route)).toBe('05');
  });

  it('returns an empty string for non-demo routes', () => {
    expect(getDemoNumber(ROUTES.HOME.route)).toBe('');
    expect(getDemoNumber('unknown')).toBe('');
  });
});

describe('padIndex', () => {
  it('pads single-digit indexes with a leading zero', () => {
    expect(padIndex(0)).toBe('01');
    expect(padIndex(8)).toBe('09');
  });

  it('does not pad double-digit indexes', () => {
    expect(padIndex(9)).toBe('10');
    expect(padIndex(41)).toBe('42');
  });
});
