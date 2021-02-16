'use strict';

// Global variables
const urlBase = 'https://api.punkapi.com/v2/beers?page=';
const filterABV = document.getElementById('filter-abv');
const filterIBU = document.getElementById('filter-ibu');
const beersContainer = document.querySelector('.beers-container');
const pageText = document.querySelector('.page-number');
const prevPage = document.querySelector('.prev-page');
const nextPage = document.querySelector('.next-page');

let itemsPerPage = 24;
let optionsABV = '',
  optionsIBU = '';
let page = 1;
let perPage = `&per_page=${itemsPerPage}`;

// Filters
filterABV.addEventListener('change', function (e) {
  const value = e.target.value;
  switch (value) {
    case 'all':
      optionsABV = '';
      break;
    case 'weak':
      optionsABV = '&abv_lt=4.6';
      break;
    case 'medium':
      optionsABV = '&abv_gt=4.5&abv_lt-7.6';
      break;
    case 'strong':
      optionsABV = '&abv_gt=7.5';
      break;
  }

  page = 1;
  getBeers();
});

filterIBU.addEventListener('change', function (e) {
  const value = e.target.value;

  switch (value) {
    case 'all':
      optionsIBU = '';
      break;
    case 'weak':
      optionsIBU = '&ibu_lt=35';
      break;
    case 'medium':
      optionsIBU = '&ibu_gt=34&ibu_lt=75';
      break;
    case 'strong':
      optionsIBU = '&ibu_gt=74';
      break;
  }

  page = 1;
  getBeers();
});

// Sort results by name (A-Z)
const sortName = function (beers) {
  beers.sort(function (a, b) {
    let nameA = a.name.toLowerCase();
    let nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  sortDropdownBtn.innerHTML = `Sort by Name<ion-icon name="chevron-down-outline"></ion-icon>`;
};

// Sort by ABV (ascending)
const sortABV = function (beerResults) {
  beerResults.sort(function (a, b) {
    return a.abv - b.abv;
  });
  sortDropdownBtn.innerHTML = `Sort by ABV<ion-icon name="chevron-down-outline"></ion-icon>`;
};

// Sort by IBU (ascending)
const sortIBU = function (beerResults) {
  beerResults.sort(function (a, b) {
    return a.ibu - b.ibu;
  });
  sortDropdownBtn.innerHTML = `Sort by IBU<ion-icon name="chevron-down-outline"></ion-icon>`;
};

// API call
const getBeers = async function () {
  try {
    const url = urlBase + page + perPage + optionsABV + optionsIBU;
    // Fetch
    const beerPromise = await fetch(url);
    const beers = await beerPromise.json();

    // Sort results by name, abv or ibu
    sortMenuItems[0].classList.contains('current') ? sortName(beers) : null;
    sortMenuItems[1].classList.contains('current') ? sortABV(beers) : null;
    sortMenuItems[2].classList.contains('current') ? sortIBU(beers) : null;

    console.log(beers);
    // Pagination
    pageText.innerText = page;

    if (page === 1) {
      prevPage.disabled = true;
    } else {
      prevPage.disabled = false;
    }
    if (beers.length < itemsPerPage) {
      nextPage.disabled = true;
    } else {
      nextPage.disabled = false;
    }

    // Render beer data
    const beersGrid = document.querySelector('.beers-grid');
    const beersList = document.querySelector('.beers-list');
    const genericBottle = 'images/generic-bottle.png';
    let beersGridHtml = '';
    let beersListHtml = '';

    // const beersGridView = function () {
    //   beers.forEach(function (beer) {
    //     beersGridHtml += `
    //     <div class='beer-wrapper card'>
    //       <div class='beer--card'>
    //         <img class='beer--img' src='${
    //           beer.image_url ? beer.image_url : genericBottle
    //         }'/>
    //         <h3 class='beer--name'>${beer.name}</h3>
    //         <span class='beer--info'>
    //           <span>ABV: ${beer.abv ? beer.abv : 'N/A'}%</span>
    //           <span>IBU: ${beer.ibu ? beer.ibu : 'N/A'}</span>
    //         </span>
    //       </div>
    //       <div class='toggle--info-bg'></div>
    //       <div class='toggle--text'>Info </div>
    //         <div class='beer--content'>
    //           <div class='beer--name'>${beer.name}</div>
    //           <div class='beer--tagline'>${beer.tagline}</div>
    //           <div class='beer--description'>${beer.description}</div>
    //         </div>
    //     </div>
    //     `;
    //   });
    // };
    // beersGridView();
    // beersGrid.insertAdjacentHTML('afterbegin', beersGridHtml);

    const beersListView = function () {
      beers.forEach(function (beer) {
        beersListHtml += `
        <div class='beer-wrapper card-list'>
          <div class='beer--card-list'>
            <div class='beer--img-list-container'>
              <img class='beer--img-list' src='${
                beer.image_url ? beer.image_url : genericBottle
              }'/>
            </div> 
            <div class='beer--info-list'>
              <div class='beer--name-container'>
                <h3 class='beer--name-list'>${beer.name}</h3>
                <p class='beer--tagline-list'>${beer.tagline}</p>
              </div>
              <div class="beer--bottom-info-list">
                <div class='beer--details-list'>
                  <span class='abv-list'>ABV: ${
                    beer.abv ? beer.abv : 'N/A'
                  }%</span> |
                  <span class='ibu-list'>IBU: ${
                    beer.ibu ? beer.ibu : 'N/A'
                  }</span>
                </div>
              </div>
              </div>
            </div>
            <div class='beer--description-toggle-list'>
              <ion-icon name="chevron-down-outline"></ion-icon> 
            </div>
            <div class="beer--description-list-container">
              <p class="beer--description-list">${beer.description}</p>
          </div>
        </div>
        `;
      });
    };

    beersListView();
    beersList.innerHTML = beersListHtml;
  } catch (err) {
    console.log(err);
  }
  // Display additional beer info in grid view
  const infoTextLinks = document.querySelectorAll('.toggle--text');

  infoTextLinks.forEach(info =>
    info.addEventListener('click', function () {
      info.classList.toggle('open');
      info.nextElementSibling.classList.toggle('show-content');
    })
  );

  // Display additional beer info in list view
  const beerDescriptionArrows = document.querySelectorAll(
    '.beer--description-toggle-list'
  );
  beerDescriptionArrows.forEach(arrow =>
    arrow.addEventListener('click', function () {
      arrow.classList.toggle('open');
      arrow.nextElementSibling.classList.toggle('open');
    })
  );
  fadeInContent();
};

// Fade in results
const fadeInContent = function () {
  beersContainer.classList.add('fade-in');
  setTimeout(function () {
    beersContainer.classList.remove('fade-in');
  }, 1500);
};

prevPage.addEventListener('click', function () {
  page--;
  getBeers();
  // remainSticky();
});
nextPage.addEventListener('click', function () {
  page++;
  getBeers();
  // remainSticky();
});

getBeers();

// Used to remove current class from all siblings for menu items
const getSiblings = function (elem) {
  let siblings = [];
  let sibling = elem.parentNode.firstChild;
  while (sibling) {
    if (sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextElementSibling;
  }
  return siblings;
};

// Sort results menu
const sortMenuItems = Array.from(
  document.getElementsByClassName('sort-option')
);

const sortDropdownBtn = document.querySelector('.dropdown-btn');

// Sort results button and menu appearance
sortDropdownBtn.addEventListener('click', function () {
  sortDropdownBtn.classList.toggle('open');
  sortDropdownBtn.nextElementSibling.classList.toggle('active');
});

// Select sort option (Name, ABV, IBU)
for (let i = 0; i < sortMenuItems.length; i++) {
  sortMenuItems[i].addEventListener('click', function () {
    if (!sortMenuItems[i].classList.contains('current')) {
      sortMenuItems[i].classList.toggle('current');
      sortDropdownBtn.classList.remove('open');
      sortDropdownBtn.nextElementSibling.classList.remove('active');
    }
    let removeCurrent = getSiblings(sortMenuItems[i]);
    removeCurrent.shift();
    removeCurrent.forEach(function (item) {
      item.classList.remove('current');
    });
    remainSticky();
    getBeers();
  });
}

// Change number of results per page
const resultsPerPage = Array.from(
  document.getElementsByClassName('results-per-option')
);
let resultsDropdownBtn = document.querySelector('.results-per-btn');

// Results per page button and menu appearance
resultsDropdownBtn.addEventListener('click', function () {
  resultsDropdownBtn.classList.toggle('open');
  resultsDropdownBtn.nextElementSibling.classList.toggle('active');
});

// Select results per page quantity
for (let i = 0; i < resultsPerPage.length; i++) {
  resultsPerPage[i].addEventListener('click', function () {
    if (!resultsPerPage[i].classList.contains('current')) {
      resultsPerPage[i].classList.toggle('current');
      itemsPerPage = resultsPerPage[i].innerText;
      perPage = `&per_page=${itemsPerPage}`;
      resultsDropdownBtn.classList.remove('open');
      resultsDropdownBtn.nextElementSibling.classList.remove('active');
      // Modifies dropdown button text to reflect selected items per page value
      resultsDropdownBtn.innerHTML = `${itemsPerPage} per page <ion-icon name="chevron-down-outline"></ion-icon>`;
    }
    let removeCurrent = getSiblings(resultsPerPage[i]);
    removeCurrent.shift();
    removeCurrent.forEach(function (item) {
      item.classList.remove('current');
    });
    getBeers();
  });
}
