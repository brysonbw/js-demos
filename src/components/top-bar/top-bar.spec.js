import { describe, expect, it } from 'vitest';

import { ROUTES } from '../../utils/constants.js';
import { createTopbar } from './index.js';

describe('createTopbar', () => {
  it('renders the brand link pointing at home', () => {
    const { element } = createTopbar();
    const brand = element.querySelector('.brand');
    expect(brand).toHaveAttribute('href', ROUTES.HOME.hash);
  });

  it('exposes the menu and theme buttons', () => {
    const { menuButton, themeButton } = createTopbar();
    expect(menuButton).toBeInstanceOf(HTMLButtonElement);
    expect(themeButton).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders the theme toggle with an accessible label', () => {
    const { themeButton } = createTopbar();
    expect(themeButton).toHaveAttribute('aria-label', 'Switch color mode');
  });
});
