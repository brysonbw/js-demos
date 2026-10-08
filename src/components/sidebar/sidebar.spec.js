import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '../../utils/constants.js';
import { createSidebar } from './index.js';

const routes = [
  { route: 'contact', title: 'Contact form' },
  { route: 'tabs', title: 'Tabs' },
];

describe('createSidebar', () => {
  let sidebar;

  beforeEach(() => {
    sidebar = createSidebar(routes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders a numbered link for each route', () => {
    const links = sidebar.element.querySelectorAll('.sidebar-link');
    // 1 home link + 2 route links
    expect(links).toHaveLength(3);
    expect(links[1]).toHaveAttribute('href', '#/contact');
    expect(links[1].textContent).toContain('Contact form');
    expect(links[1].querySelector('span').textContent).toBe('01');
  });

  it('orders links by the demo list order regardless of routes order', () => {
    const reversed = createSidebar([...routes].reverse());
    const hrefs = [...reversed.element.querySelectorAll('.sidebar-link')].map(
      (link) => link.getAttribute('href')
    );
    expect(hrefs).toEqual([ROUTES.HOME.hash, '#/contact', '#/tabs']);
  });

  it('links home to the home hash', () => {
    const homeLink = sidebar.element.querySelector(
      `[data-page-id="${ROUTES.HOME.route}"]`
    );
    expect(homeLink).toHaveAttribute('href', ROUTES.HOME.hash);
  });

  it('marks the active page in both sidebar and dialog', () => {
    sidebar.setActive('tabs');

    [sidebar.element, sidebar.dialog].forEach((root) => {
      const active = root.querySelector('[data-page-id="tabs"]');
      expect(active).toHaveClass('active');
      expect(active).toHaveAttribute('aria-current', 'page');

      const inactive = root.querySelector('[data-page-id="contact"]');
      expect(inactive).not.toHaveClass('active');
      expect(inactive).not.toHaveAttribute('aria-current');
    });
  });

  it('shows the current year in the footer', () => {
    const footer = sidebar.element.querySelector('.sidebar-footer');
    expect(footer.textContent).toContain(String(new Date().getFullYear()));
  });

  it('renders the same links inside the mobile dialog', () => {
    const dialogLinks = sidebar.dialog.querySelectorAll('.sidebar-link');
    expect(dialogLinks).toHaveLength(3);
    expect(dialogLinks[2].textContent).toContain('Tabs');
  });

  it('opens the dialog with openMenu', () => {
    sidebar.openMenu();
    expect(sidebar.dialog.showModal).toHaveBeenCalledOnce();
  });

  it('closes the dialog when the close button is clicked', () => {
    sidebar.dialog.querySelector('.dialog-close').click();
    expect(sidebar.dialog.close).toHaveBeenCalledOnce();
  });

  it('closes the dialog when the backdrop is clicked', () => {
    sidebar.dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(sidebar.dialog.close).toHaveBeenCalled();
  });

  it('closes the dialog when a navigation link is clicked', () => {
    sidebar.dialog.querySelector('[data-page-id="contact"]').click();
    expect(sidebar.dialog.close).toHaveBeenCalled();
  });

  it('clears the previous active page when setActive is called again', () => {
    sidebar.setActive('tabs');
    sidebar.setActive('contact');

    const previous = sidebar.element.querySelector('[data-page-id="tabs"]');
    expect(previous).not.toHaveClass('active');
    expect(previous).not.toHaveAttribute('aria-current');
  });

  it('numbers links by their position in the demo list order', () => {
    const numbers = [...sidebar.element.querySelectorAll('.sidebar-link span')]
      .map((span) => span.textContent)
      .filter((text) => /^\d+$/.test(text));
    expect(numbers).toEqual(['01', '04']);
  });
});
