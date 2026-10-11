import { describe, expect, it } from 'vitest';

import { ROUTES } from '../../utils/constants.js';
import { createTopbar } from './index.js';

describe('createTopbar', () => {
  it('renders the brand link pointing at home', () => {
    const { element } = createTopbar();
    const brandEl = element.querySelector('.brand');
    expect(brandEl).toHaveAttribute('href', ROUTES.HOME.hash);
  });

  it('exposes the menu and theme buttons', () => {
    const { menuButton, themeButton } = createTopbar();
    expect(menuButton).toBeInstanceOf(HTMLButtonElement);
    expect(themeButton).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders the GitHub icon link', () => {
    const { element } = createTopbar();
    const link = element.querySelector('.github-link');
    expect(link).toHaveAttribute('aria-label', 'GitHub repository');
    expect(link.querySelector('img')).not.toBeNull();
  });

  it('renders the theme toggle with an accessible label', () => {
    const { themeButton } = createTopbar();
    expect(themeButton).toHaveAttribute('aria-label', 'Switch color mode');
  });
});
