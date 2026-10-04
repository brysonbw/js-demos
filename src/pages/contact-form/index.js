import './index.css';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderContactForm(container) {
  container.innerHTML = `
    <header class="page-heading">
      <p class="eyebrow">Page 01</p>
      <h1 id="page-title">Contact form</h1>
      <p>Add a new contact using the form below — with client-side validation, inline notifications, and a contacts table that updates dynamically.</p>
    </header>

     <div id="notification" role="alert" data-notification-type=""></div>

    <form class="form" id="contact-form">
      <label for="name">Name <span>*</span></label>
      <input class="input" id="name" name="name">

      <label for="mobileNumber">Mobile Number <span>*</span></label>
      <input class="input" id="mobileNumber" name="mobileNumber" type="tel">

      <label for="email">Email <span>*</span></label>
      <input class="input" id="email" name="email" type="email">

      <div class="form-actions">
        <button class="button button-primary" type="submit" id="submit">Submit</button>
      </div>
    </form>

    <h3>Contacts</h3>
    <table id="contacts">
      <thead>
        <tr>
          <th>Name</th>
          <th>Mobile Number</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
      <tr>
        <td>John Doe</td>
        <td>1234567890</td>
        <td>johndoe@example.com</td>
      </tr>
      </tbody>
    </table>
  `;

  const contactForm = container.querySelector('#contact-form');
  const nameInput = container.querySelector('#name');
  const mobileNumberInput = container.querySelector('#mobileNumber');
  const emailInput = container.querySelector('#email');

  const notification = container.querySelector('#notification');

  const CONTACT_NAME_REGEX = /^[A-Za-z\s]{1,20}$/;
  const MOBILE_NUMBER_REGEX = /^\d{9,10}$/;
  const EMAIL_REGEX =
    /^[A-Za-z][A-Za-z0-9.]{1,9}@[A-Za-z]{2,10}\.[A-Za-z]{2,10}$/;

  contactForm.addEventListener('submit', addContact);

  /**
   * @param {SubmitEvent} event
   * @returns {void}
   */
  function addContact(event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const mobileNumber = mobileNumberInput.value.trim();
    const email = emailInput.value.trim();

    // Validate form inputs
    if (!CONTACT_NAME_REGEX.test(name)) {
      if (name.length === 0) {
        renderNotification('error', 'Name is required.');
      } else if (name.length > 20) {
        renderNotification('error', 'Name is too long.');
      } else {
        renderNotification(
          'error',
          'Please enter a valid name. Contact name should only contain letters and spaces.'
        );
      }
      return;
    }

    if (!MOBILE_NUMBER_REGEX.test(mobileNumber)) {
      if (mobileNumber.length === 0) {
        renderNotification('error', 'Mobile number is required.');
      } else if (mobileNumber.length < 9 || mobileNumber.length > 10) {
        renderNotification(
          'error',
          'Mobile number must be 9 or 10 digits long.'
        );
      }
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      renderNotification(
        'error',
        'Please enter a valid email (i.e johndoes.3@example.com)'
      );
      return;
    }

    renderNotification('success', 'Contact added successfully.');
    contactForm.reset();
    addContactRow({ name, mobileNumber, email });
  }

  /**
   * @param {string} type
   * @param {string} message
   */
  function renderNotification(type, message) {
    notification.dataset.notificationType = type;
    notification.textContent = message;
  }

  /**
   * @param {{name: string, mobileNumber: string, email: string}} contact
   */
  function addContactRow(contact) {
    const contactsTableBody = container.querySelector('#contacts tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${contact.name}</td>
      <td>${contact.mobileNumber}</td>
      <td>${contact.email}</td>
    `;
    contactsTableBody.appendChild(row);
  }
}
export { renderContactForm };
