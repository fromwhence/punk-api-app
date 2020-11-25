// Removes :focus outline for mouse users
(function(document, window){
	if (!document || !window) {
		return;
	}
	var styleText = '::-moz-focus-inner{border:0 !important;}:focus{outline: none !important;';
	var unfocus_style = document.createElement('STYLE');

	window.unfocus = function(){
		document.getElementsByTagName('HEAD')[0].appendChild(unfocus_style);
		document.addEventListener('mousedown', function(){
			unfocus_style.innerHTML = styleText+'}';
		});
		document.addEventListener('keydown', function(){
			unfocus_style.innerHTML = '';
		});
	};
	unfocus.style = function(style){
		styleText += style;
	};
	unfocus();
}) (document, window);

// Variables
let log = console.log;
const urlBase = 'https://api.punkapi.com/v2/beers?page=';
const filterABV = document.getElementById('filterABV');
const filterIBU = document.getElementById('filterIBU');
const pagerNumber = document.getElementById('pageNumber');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');

let itemsPerPage = 24;
let optionsABV = '', optionsIBU = ''; page = 1; perPage = `&per_page=${itemsPerPage}`;

// Filters
filterABV.addEventListener('change', e => {
  const value = e.target.value;

  switch (value) {
    case 'all':
      optionsABV = '';
      break
    case 'weak':
      optionsABV = '&abv_lt=4.6';
      break
    case 'medium':
      optionsABV = '&abv_gt=4.5&abv_lt-7.6';
      break
    case 'strong':
      optionsABV = '&abv_gt=7.5';
      break
  }

  page = 1;
  getBeers();
})

filterIBU.addEventListener('change', e => {
  const value = e.target.value;

  switch (value) {
    case 'all':
      optionsIBU = '';
      break
    case 'weak':
      optionsIBU = '&ibu_lt=35';
      break
    case 'medium':
      optionsIBU = '&ibu_gt=34&ibu_lt=75';
      break
    case 'strong':
      optionsIBU = '&ibu_gt=74';
      break
  }

  page = 1;
  getBeers();
})

// sort results by data (A-Z)
const sortName = (beers) => {
  beers.sort(function(a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
)};

// sort by ABV (ascending)
const sortABV = (beers) => {
  beers.sort(function(a, b) {
    return a.abv - b.abv;
  }
)};

// sort by IBU (ascending)
const sortIBU = (beers) => {
  beers.sort(function(a, b) {
    return a.ibu - b.ibu;
  }
)};

// api call
async function getBeers() {
  try {
    const url = urlBase + page + perPage + optionsABV + optionsIBU;

    // fetch
    const beerPromise = await fetch(url);
    const beers = await beerPromise.json();

    // Sort results by name, abv or ibu
    sortMenuItems[0].classList.contains('current') ? sortName(beers) : null;
    sortMenuItems[1].classList.contains('current') ? sortABV(beers) : null;
    sortMenuItems[2].classList.contains('current') ? sortIBU(beers) : null;

    // Change results per page

    
    // pagination
    pageNumber.innerText = page;

    if(page === 1) {
      prevPage.disabled = true;
    } else {
      prevPage.disabled = false;
    }
    if(beers.length < itemsPerPage) {
      nextPage.disabled = true;
    } else {
      nextPage.disabled = false;
    }

    // render beer data
    const beersDiv = document.getElementById('beers');

    let beerHtml = "";
    const genericBottle = "images/generic-bottle.png";

    beers.forEach(beer => {
      beerHtml += `
        <div class='beer-wrapper card'>
          <div class='beer--card'>
            <img class='beer--img' src='${beer.image_url ? beer.image_url : genericBottle}'/>
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
        `
    });
    beersDiv.innerHTML = beerHtml;

  } catch(e) {
    log(e);
  }
}

prevPage.addEventListener('click', () => {
  page--;
  getBeers();
});
nextPage.addEventListener('click', () => {
  page++;
  getBeers();
});

getBeers();

// Toggle additional info on individual beer card
const beerResults = document.getElementById('beers');

beerResults.addEventListener('click', function(e) {
  e.stopPropagation();
  if (e.target.classList.contains('toggle--text')) {
    e.target.classList.toggle('open');
    e.target.nextElementSibling.classList.toggle('show-content');
  }
}, true);

// Used to remove current class from all siblings
const getSiblings = (elem) => {
  let siblings = [];
  let sibling = elem.parentNode.firstChild;
  while(sibling) {
    if (sibling !== elem) {
      siblings.push(sibling)
    }
    sibling = sibling.nextElementSibling;
  }
  return siblings;
};

// Sort results
const sortMenuItems = Array.from(document.getElementsByClassName('sort-option'));
const sortDropdownBtn = document.querySelector('.dropdown-btn');

// Sort results button and menu appearance
sortDropdownBtn.addEventListener('click', function() {
  sortDropdownBtn.classList.toggle('open');
  sortDropdownBtn.nextElementSibling.classList.toggle('active');
});

// Select sort option (Name, ABV, IBU)
for (let i = 0; i < sortMenuItems.length; i++) {
  sortMenuItems[i].addEventListener('click', function() {
    if (!sortMenuItems[i].classList.contains('current')) {
      sortMenuItems[i].classList.toggle('current');
      sortDropdownBtn.classList.remove('open');
      sortDropdownBtn.nextElementSibling.classList.remove('active');
    };
    let removeCurrent = getSiblings(sortMenuItems[i]);
    removeCurrent.shift();
    removeCurrent.forEach(item => {
      item.classList.remove('current');
    });
    getBeers();
  }, true);
};

// Results per page button and menu appearance 
const resultsPerPgOptions = Array.from(document.getElementsByClassName('results-per-option'));
console.log(resultsPerPgOptions);

