import { beforeEach, describe, expect, it } from 'vitest';

import { renderContactForm } from './index.js';

function fillForm(container, { name, mobileNumber, email }) {
  container.querySelector('#name').value = name;
  container.querySelector('#mobileNumber').value = mobileNumber;
  container.querySelector('#email').value = email;
  container
    .querySelector('#contact-form')
    .dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
}

describe('renderContactForm', () => {
  let containerEl;

  beforeEach(() => {
    containerEl = document.createElement('div');
    renderContactForm(containerEl);
  });

  it('renders the form with one seed contact row', () => {
    expect(containerEl.querySelector('#contact-form')).not.toBeNull();
    expect(containerEl.querySelectorAll('#contacts tbody tr')).toHaveLength(1);
  });

  it('adds a contact row on valid submission', () => {
    fillForm(containerEl, {
      name: 'Jane Doe',
      mobileNumber: '1234567890',
      email: 'jane.doe@example.com',
    });

    const rowEls = containerEl.querySelectorAll('#contacts tbody tr');
    expect(rowEls).toHaveLength(2);
    expect(rowEls[1].textContent).toContain('Jane Doe');
  });

  it('shows a success notification on valid submission', () => {
    fillForm(containerEl, {
      name: 'Jane Doe',
      mobileNumber: '1234567890',
      email: 'jane.doe@example.com',
    });

    const notificationEl = containerEl.querySelector('#notification');
    expect(notificationEl).toHaveAttribute('data-notification-type', 'success');
    expect(notificationEl.textContent).toBe('Contact added successfully.');
  });

  it('rejects an empty name', () => {
    fillForm(containerEl, {
      name: '',
      mobileNumber: '1234567890',
      email: 'jane@example.com',
    });

    const notificationEl = containerEl.querySelector('#notification');
    expect(notificationEl).toHaveAttribute('data-notification-type', 'error');
    expect(notificationEl.textContent).toBe('Name is required.');
    expect(containerEl.querySelectorAll('#contacts tbody tr')).toHaveLength(1);
  });

  it('rejects a name with digits', () => {
    fillForm(containerEl, {
      name: 'Jane123',
      mobileNumber: '1234567890',
      email: 'jane@example.com',
    });

    const notificationEl = containerEl.querySelector('#notification');
    expect(notificationEl).toHaveAttribute('data-notification-type', 'error');
  });

  it('rejects an invalid mobile number', () => {
    fillForm(containerEl, {
      name: 'Jane Doe',
      mobileNumber: '123',
      email: 'jane@example.com',
    });

    const notificationEl = containerEl.querySelector('#notification');
    expect(notificationEl).toHaveAttribute('data-notification-type', 'error');
    expect(notificationEl.textContent).toBe(
      'Mobile number must be 9 or 10 digits long.'
    );
  });

  it('rejects an invalid email', () => {
    fillForm(containerEl, {
      name: 'Jane Doe',
      mobileNumber: '1234567890',
      email: 'not-an-email',
    });

    const notificationEl = containerEl.querySelector('#notification');
    expect(notificationEl).toHaveAttribute('data-notification-type', 'error');
  });

  it('clears the form after a successful submission', () => {
    fillForm(containerEl, {
      name: 'Jane Doe',
      mobileNumber: '1234567890',
      email: 'jane.doe@example.com',
    });

    expect(containerEl.querySelector('#name').value).toBe('');
    expect(containerEl.querySelector('#mobileNumber').value).toBe('');
    expect(containerEl.querySelector('#email').value).toBe('');
  });

  it('rejects a name longer than 20 characters', () => {
    fillForm(containerEl, {
      name: 'A name way too long to be valid',
      mobileNumber: '1234567890',
      email: 'jane@example.com',
    });

    const notificationEl = containerEl.querySelector('#notification');
    expect(notificationEl).toHaveAttribute('data-notification-type', 'error');
    expect(notificationEl.textContent).toBe('Name is too long.');
  });

  it('rejects an empty mobile number', () => {
    fillForm(containerEl, {
      name: 'Jane Doe',
      mobileNumber: '',
      email: 'jane@example.com',
    });

    const notificationEl = containerEl.querySelector('#notification');
    expect(notificationEl).toHaveAttribute('data-notification-type', 'error');
    expect(notificationEl.textContent).toBe('Mobile number is required.');
  });

  it('appends new contacts after the seed row in order', () => {
    fillForm(containerEl, {
      name: 'Jane Doe',
      mobileNumber: '1234567890',
      email: 'jane.doe@example.com',
    });
    fillForm(containerEl, {
      name: 'John Smith',
      mobileNumber: '0987654321',
      email: 'john.smith@example.com',
    });

    const rowEls = containerEl.querySelectorAll('#contacts tbody tr');
    expect(rowEls).toHaveLength(3);
    expect(rowEls[1].textContent).toContain('Jane Doe');
    expect(rowEls[2].textContent).toContain('John Smith');
  });

  it('keeps the notification hidden before any submission', () => {
    const notificationEl = containerEl.querySelector('#notification');
    expect(notificationEl).toHaveAttribute('data-notification-type', '');
  });

  it('does not add a row when validation fails', () => {
    fillForm(containerEl, {
      name: '',
      mobileNumber: '1234567890',
      email: 'jane@example.com',
    });

    expect(containerEl.querySelectorAll('#contacts tbody tr')).toHaveLength(1);
  });
});
