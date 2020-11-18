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
})(document, window);


// variables
const urlBase = "https://api.punkapi.com/v2/beers?page=";
const filterABV = document.getElementById("filterABV");
const filterIBU = document.getElementById("filterIBU");
const pagerNumber = document.getElementById("pageNumber");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
let optionsABV = "", optionsIBU = ""; page = 1; perPage = "&per_page=24";

//filters
filterABV.addEventListener("change", e => {
  const value = e.target.value;

  switch (value) {
    case "all":
      optionsABV = "";
      break
    case "weak":
      optionsABV = "&abv_lt=4.6";
      break
    case "medium":
      optionsABV = "&abv_gt=4.5&abv_lt-7.6";
      break
    case "strong":
      optionsABV = "&abv_gt=7.5";
      break
  }

  page = 1;
  getBeers();
})

filterIBU.addEventListener("change", e => {
  const value = e.target.value;

  switch (value) {
    case "all":
      optionsIBU = "";
      break
    case "weak":
      optionsIBU = "&ibu_lt=35";
      break
    case "medium":
      optionsIBU = "&ibu_gt=34&ibu_lt=75";
      break
    case "strong":
      optionsIBU = "&ibu_gt=74";
      break
  }

  page = 1;
  getBeers();
})

// api call
async function getBeers() {
  try {
    const url = urlBase + page + perPage + optionsABV + optionsIBU;
    console.log(url);

    // fetch
    const beerPromise = await fetch(url);
    const beers = await beerPromise.json();

    // pagination
    pageNumber.innerText = page;

    if(page === 1) {
      prevPage.disabled = true;
    } else {
      prevPage.disabled = false;
    }
    if(beers.length < 24) {
      nextPage.disabled = true;
    } else {
      nextPage.disabled = false;
    }

    // render data
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
              <span>ABV: ${beer.abv}%</span>
              <span>IBU: ${beer.ibu}</span>
            </span>
          </div>
          <div class='toggle--info'>Info +</div>
          <div class='beer--content'>
            <div class='beer--name'>${beer.name}</div>
            <div class='beer--tagline'>${beer.tagline}</div>
            <div class='beer--description'>${beer.description}</div>
            <div class='beer--food-pairing'>
              Pair with: ${beer.food_pairing.join(', ')}
            </div>
          </div>
        </div>
        `
    });
    beersDiv.innerHTML = beerHtml;   

  } catch(e) {
    console.log(e);
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

// Toggle additional beer information
document.addEventListener('click', function (event) {
  if (event.target.classList.contains( 'toggle--info' ) ) {
      if (event.target.innerHTML === "Info -") {
        event.target.innerHTML = "Info +"; 
      } else {
        event.target.innerHTML = "Info -";
      };
      event.target.nextElementSibling.classList.toggle('show-content');
  }
}, false);
