'use-strict';

// Hide instructions bar in mobile view
const instructionsBar = document.querySelector('.instructions');
const instructionsText = document.querySelector('.instructions-text');
const instructionsToggleIcon = document.querySelector('.instructions-toggle');

const toggleInstructions = function () {
  instructionsBar.classList.toggle('close');
  instructionsToggleIcon.classList.toggle('close');
  instructionsText.classList.toggle('close');
};

instructionsToggleIcon.addEventListener('click', toggleInstructions);

// Sticky sort and pagination toolbar
const sortPaginationBar = document.querySelector(
  '.sortby-pagination-container'
);
const listViewContent = document.querySelector('.list-view');
const sticky = sortPaginationBar.offsetTop;

function setStickyToolbar() {
  if (window.pageYOffset >= sticky) {
    listViewContent.style.paddingTop = `${sortPaginationBar.offsetHeight}px`;
    sortPaginationBar.classList.add('sticky');
  } else {
    sortPaginationBar.classList.remove('sticky');
    listViewContent.style.paddingTop = '0px';
  }
}
window.onscroll = () => setStickyToolbar();
