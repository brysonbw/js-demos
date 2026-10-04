import './index.css';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderAccordion(container) {
  container.innerHTML = `
     <div id="accordion">
      <div>
        <div class="accordion-title">
          HTML
          <span aria-hidden="true" class="accordion-icon"></span>
        </div>
        <div class="accordion-content">
          The HyperText Markup Language or HTML is the standard markup language
          for documents designed to be displayed in a web browser.
        </div>
      </div>
      <div>
        <div class="accordion-title">
          CSS
          <span aria-hidden="true" class="accordion-icon"></span>
        </div>
        <div class="accordion-content">
          Cascading Style Sheets is a style sheet language used for describing
          the presentation of a document written in a markup language such as
          HTML or XML.
        </div>
      </div>
      <div>
        <div class="accordion-title"> 
          JavaScript
          <span aria-hidden="true" class="accordion-icon"></span>
        </div>
        <div class="accordion-content">
          JavaScript, often abbreviated as JS, is a programming language that is
          one of the core technologies of the World Wide Web, alongside HTML and
          CSS.
        </div>
      </div>
    </div>
    `;

  const accordionEl = container.querySelector('#accordion');
  const accordionItemEls = accordionEl.children || [];

  if (accordionItemEls.length > 0) {
    for (const item of accordionItemEls) {
      if (item instanceof HTMLElement) {
        const title = item.querySelector('.accordion-title');
        const content = item.querySelector('.accordion-content');

        content.setAttribute('aria-hidden', 'true');

        // Add styles for title
        title.style.cursor = 'pointer';

        // Add event listener for title toggle
        title.addEventListener('click', function () {
          const isExpanded = content.getAttribute('aria-hidden') === 'true';
          content.setAttribute('aria-hidden', String(!isExpanded));
        });
      }
    }
  }
}
export { renderAccordion };
