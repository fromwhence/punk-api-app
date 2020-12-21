'use strict';
// Removes :focus outline for mouse users
(function (document, window) {
  if (!document || !window) {
    return;
  }
  var styleText =
    '::-moz-focus-inner{border:0 !important;}:focus{outline: none !important;';
  var unfocus_style = document.createElement('STYLE');

  window.unfocus = function () {
    document.getElementsByTagName('HEAD')[0].appendChild(unfocus_style);
    document.addEventListener('mousedown', function () {
      unfocus_style.innerHTML = styleText + '}';
    });
    document.addEventListener('keydown', function () {
      unfocus_style.innerHTML = '';
    });
  };
  unfocus.style = function (style) {
    styleText += style;
  };
  unfocus();
})(document, window);

// Variables
const urlBase = 'https://api.punkapi.com/v2/beers?page=';
const beerGrid = document.getElementById('beers');
const filterABV = document.getElementById('filterABV');
const filterIBU = document.getElementById('filterIBU');
const pagerNumber = document.getElementById('pageNumber');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');

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
};

// Sort by ABV (ascending)
const sortABV = function (beerResults) {
  beerResults.sort(function (a, b) {
    return a.abv - b.abv;
  });
};

// Sort by IBU (ascending)
const sortIBU = function (beerResults) {
  beerResults.sort(function (a, b) {
    return a.ibu - b.ibu;
  });
};

// Fade in results
const fadeInContent = function () {
  beerGrid.classList.add('fade-in');
  setTimeout(function () {
    beerGrid.classList.remove('fade-in');
  }, 1500);
};

// API call
async function getBeers() {
  try {
    const url = urlBase + page + perPage + optionsABV + optionsIBU;
    // Fetch
    const beerPromise = await fetch(url);
    const beers = await beerPromise.json();

    // Sort results by name, abv or ibu
    sortMenuItems[0].classList.contains('current') ? sortName(beers) : null;
    sortMenuItems[1].classList.contains('current') ? sortABV(beers) : null;
    sortMenuItems[2].classList.contains('current') ? sortIBU(beers) : null;

    // Pagination
    pageNumber.innerText = page;

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
    const beersDiv = document.getElementById('beers');

    let beerHtml = '';
    const genericBottle = 'images/generic-bottle.png';

    beers.forEach(function (beer) {
      beerHtml += `
        <div class='beer-wrapper card'>
          <div class='beer--card'>
            <img class='beer--img' src='${
              beer.image_url ? beer.image_url : genericBottle
            }'/>
            <h3 class='beer--name'>${beer.name}</h3>
            <span class='beer--info'>
              <span>ABV: ${beer.abv ? beer.abv : 'N/A'}%</span>
              <span>IBU: ${beer.ibu ? beer.ibu : 'N/A'}</span>
            </span>
          </div>
          <div class='toggle--info-bg'></div>
          <div class='toggle--text'>Info </div>
            <div class='beer--content'>
              <div class='beer--name'>${beer.name}</div>
              <div class='beer--tagline'>${beer.tagline}</div>
              <div class='beer--description'>${beer.description}</div>
            </div>
        </div>
        `;
    });
    beersDiv.innerHTML = beerHtml;
  } catch (e) {
    log(e);
  }
  // Display additional beer info
  const infoTextLinks = document.querySelectorAll('.toggle--text');
  console.log(infoTextLinks);

  infoTextLinks.forEach(info =>
    info.addEventListener('click', function () {
      info.classList.toggle('open');
      info.nextElementSibling.classList.toggle('show-content');
    })
  );

  fadeInContent();
}

prevPage.addEventListener('click', function () {
  page--;
  getBeers();
});
nextPage.addEventListener('click', function () {
  page++;
  getBeers();
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
const dropDownContent = Array.from(
  document.querySelectorAll('.dropdown-content')
);
console.log(dropDownContent);

// Sort results button and menu appearance
sortDropdownBtn.addEventListener('click', function () {
  sortDropdownBtn.classList.toggle('open');
  sortDropdownBtn.nextElementSibling.classList.toggle('active');
});

// Select sort option (Name, ABV, IBU)
for (let i = 0; i < sortMenuItems.length; i++) {
  sortMenuItems[i].addEventListener(
    'click',
    function () {
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
    },
    true
  );
}

// Change number of results per page
const resultsPerPage = Array.from(
  document.getElementsByClassName('results-per-option')
);
const resultsDropdownBtn = document.querySelector('.results-per-btn');

// Results per page button and menu appearance
resultsDropdownBtn.addEventListener('click', function () {
  resultsDropdownBtn.classList.toggle('open');
  resultsDropdownBtn.nextElementSibling.classList.toggle('active');
});

// Select results per page quantity
for (let i = 0; i < resultsPerPage.length; i++) {
  resultsPerPage[i].addEventListener(
    'click',
    function () {
      if (!resultsPerPage[i].classList.contains('current')) {
        resultsPerPage[i].classList.toggle('current');
        itemsPerPage = resultsPerPage[i].innerText;
        perPage = `&per_page=${itemsPerPage}`;
        resultsDropdownBtn.classList.remove('open');
        resultsDropdownBtn.nextElementSibling.classList.remove('active');
      }
      let removeCurrent = getSiblings(resultsPerPage[i]);
      removeCurrent.shift();
      removeCurrent.forEach(function (item) {
        item.classList.remove('current');
      });
      getBeers();
    },
    true
  );
}
