let page = 1;

function getBeers(page = 1, name) {
  const url = name ? `https://api.punkapi.com/v2/beers?page=${page}&per_page=20&beer_name=${name}` : `https://api.punkapi.com/v2/beers?page=${page}&per_page=20`;
  fetch(url)
  .then(resp => resp.json())
  .then(renderBeers)
}

function renderBeers(beers) {
  beers.forEach(createBeerCard)
}

function createBeerCard(beer) {
  const {image_url, name} = beer
  const img = document.createElement('img');
  if (image_url !== null) img.src = image_url;
  
  const beerName = document.createElement('h3');
  beerName.textContent = beerName;
  
  const card = document.createElement('div')
  card.className = 'card';
  card.append(img, name);

  document.querySelector('#item-container').appendChild(card)
}

function getBeersFromSearch() {
  const searchForm = document.querySelector('#beer-search')
  const items = document.querySelector('#item-container');
  searchForm.addEventListener('submit', handleSearchSubmit);
}

function handleSearchSubmit(e) {
  e.preventDefault();
  
  const items = document.querySelector('#item-container');
  removeChildren(items);
  rerenderPageButtons();
  
  const name = e.target.parentNode.querySelector('#beer-name').value;
  getBeers(1, name);
  getMoreBeer(name);
}

function rerenderPageButtons() {
  const bttnContainer = document.querySelector('#bttn-container');
  removeChildren(bttnContainer);

  const previous = document.createElement('button');
  previous.id = 'previous-page';
  previous.textContent = 'Previous Page';
  
  const next = document.createElement('button');
  next.id = "next-page";
  next.textContent = 'Next Page';
  
  bttnContainer.append(previous, next);
}

//might need to use this function to supply page number and name of the search
function getMoreBeer(name) {
  page = 1;
  const items = document.querySelector('#item-container');
  const previous = document.querySelector('#previous-page');
  previous.addEventListener('click', () => {
    page -= 1;
    if (page === 0) {
      page = 1;
      return;
    }
    removeChildren(items);
    getBeers(page, name);
  })
  const next = document.querySelector('#next-page');
  next.addEventListener('click', () => {
    if (items.children.length !== 0) {
      page += 1;
      removeChildren(items);
      getBeers(page, name);
    }
  })
}

function removeChildren(node) {
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getBeers();
  getMoreBeer();
  getBeersFromSearch();
})