import './index.css';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderTabs(container) {
  container.innerHTML = `<div>
      <div id="tabs">
        <button>HTML</button>
        <button>CSS</button>
        <button>JavaScript</button>
      </div>
      <div id="tabContent">
        <p>
          The HyperText Markup Language or HTML is the standard markup language
          for documents designed to be displayed in a web browser.
        </p>
        <p>
          Cascading Style Sheets is a style sheet language used for describing
          the presentation of a document written in a markup language such as
          HTML or XML.
        </p>
        <p>
          JavaScript, often abbreviated as JS, is a programming language that is
          one of the core technologies of the World Wide Web, alongside HTML and
          CSS.
        </p>
      </div>
    </div>
  `;

  const tabButtonEls = container.querySelectorAll('#tabs button');
  const tabContentItemEls = Array.from(
    container.querySelectorAll('#tabContent p')
  );

  /**
   * @param {number} activeIndex
   * @returns {void}
   */
  function toggleTab(activeIndex) {
    tabButtonEls.forEach((button, index) => {
      if (index === activeIndex) {
        button.classList.add('active');
        tabContentItemEls.at(index).style.display = 'block';
      } else {
        button.classList.remove('active');
        tabContentItemEls.at(index).style.display = 'none';
      }
    });
  }

  // Set initial active tab (index 0)
  toggleTab(0);

  // Add click event listeners to the tab buttons
  for (const [index, button] of tabButtonEls.entries()) {
    button.addEventListener('click', function () {
      toggleTab(index);
    });
  }
}
export { renderTabs };
