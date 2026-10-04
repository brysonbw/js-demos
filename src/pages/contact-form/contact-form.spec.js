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
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    renderContactForm(container);
  });

  it('renders the form with one seed contact row', () => {
    expect(container.querySelector('#contact-form')).not.toBeNull();
    expect(container.querySelectorAll('#contacts tbody tr')).toHaveLength(1);
  });

  it('adds a contact row on valid submission', () => {
    fillForm(container, {
      name: 'Jane Doe',
      mobileNumber: '1234567890',
      email: 'jane.doe@example.com',
    });

    const rows = container.querySelectorAll('#contacts tbody tr');
    expect(rows).toHaveLength(2);
    expect(rows[1].textContent).toContain('Jane Doe');
  });

  it('shows a success notification on valid submission', () => {
    fillForm(container, {
      name: 'Jane Doe',
      mobileNumber: '1234567890',
      email: 'jane.doe@example.com',
    });

    const notification = container.querySelector('#notification');
    expect(notification).toHaveAttribute('data-notification-type', 'success');
    expect(notification.textContent).toBe('Contact added successfully.');
  });

  it('rejects an empty name', () => {
    fillForm(container, {
      name: '',
      mobileNumber: '1234567890',
      email: 'jane@example.com',
    });

    const notification = container.querySelector('#notification');
    expect(notification).toHaveAttribute('data-notification-type', 'error');
    expect(notification.textContent).toBe('Name is required.');
    expect(container.querySelectorAll('#contacts tbody tr')).toHaveLength(1);
  });

  it('rejects a name with digits', () => {
    fillForm(container, {
      name: 'Jane123',
      mobileNumber: '1234567890',
      email: 'jane@example.com',
    });

    const notification = container.querySelector('#notification');
    expect(notification).toHaveAttribute('data-notification-type', 'error');
  });

  it('rejects an invalid mobile number', () => {
    fillForm(container, {
      name: 'Jane Doe',
      mobileNumber: '123',
      email: 'jane@example.com',
    });

    const notification = container.querySelector('#notification');
    expect(notification).toHaveAttribute('data-notification-type', 'error');
    expect(notification.textContent).toBe(
      'Mobile number must be 9 or 10 digits long.'
    );
  });

  it('rejects an invalid email', () => {
    fillForm(container, {
      name: 'Jane Doe',
      mobileNumber: '1234567890',
      email: 'not-an-email',
    });

    const notification = container.querySelector('#notification');
    expect(notification).toHaveAttribute('data-notification-type', 'error');
  });

  it('clears the form after a successful submission', () => {
    fillForm(container, {
      name: 'Jane Doe',
      mobileNumber: '1234567890',
      email: 'jane.doe@example.com',
    });

    expect(container.querySelector('#name').value).toBe('');
    expect(container.querySelector('#mobileNumber').value).toBe('');
    expect(container.querySelector('#email').value).toBe('');
  });

  it('rejects a name longer than 20 characters', () => {
    fillForm(container, {
      name: 'A name way too long to be valid',
      mobileNumber: '1234567890',
      email: 'jane@example.com',
    });

    const notification = container.querySelector('#notification');
    expect(notification).toHaveAttribute('data-notification-type', 'error');
    expect(notification.textContent).toBe('Name is too long.');
  });

  it('rejects an empty mobile number', () => {
    fillForm(container, {
      name: 'Jane Doe',
      mobileNumber: '',
      email: 'jane@example.com',
    });

    const notification = container.querySelector('#notification');
    expect(notification).toHaveAttribute('data-notification-type', 'error');
    expect(notification.textContent).toBe('Mobile number is required.');
  });

  it('appends new contacts after the seed row in order', () => {
    fillForm(container, {
      name: 'Jane Doe',
      mobileNumber: '1234567890',
      email: 'jane.doe@example.com',
    });
    fillForm(container, {
      name: 'John Smith',
      mobileNumber: '0987654321',
      email: 'john.smith@example.com',
    });

    const rows = container.querySelectorAll('#contacts tbody tr');
    expect(rows).toHaveLength(3);
    expect(rows[1].textContent).toContain('Jane Doe');
    expect(rows[2].textContent).toContain('John Smith');
  });

  it('keeps the notification hidden before any submission', () => {
    const notification = container.querySelector('#notification');
    expect(notification).toHaveAttribute('data-notification-type', '');
  });

  it('does not add a row when validation fails', () => {
    fillForm(container, {
      name: '',
      mobileNumber: '1234567890',
      email: 'jane@example.com',
    });

    expect(container.querySelectorAll('#contacts tbody tr')).toHaveLength(1);
  });
});
