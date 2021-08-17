let page = 1;

function getBeer(page = 1, name) {
  name = replaceSpaces(name);
  const url = name ? `https://api.punkapi.com/v2/beers?page=${page}&per_page=21&beer_name=${name}` : `https://api.punkapi.com/v2/beers?page=${page}&per_page=21`;
  fetch(url)
  .then(resp => resp.json())
  .then(renderBeer)
}

function replaceSpaces(name) {
  const spaces = / /g;
  if (name) name.trim();
  if (spaces.test(name)) {
    name = name.replace(spaces, '_');
  }
  return name;
}

function handleEndOfSelection() {
  const end = document.createElement('p')
  end.textContent = "End of Selection \'(>_<)\'";
  end.id = 'end';
  document.querySelector('#item-container').append(end);
}

function renderBeer(beers) {
  beers.forEach(createBeerCard)
  if (beers.length === 0) handleEndOfSelection();
}

function createBeerCard(beer) {
  const {image_url, name} = beer
  const img = document.createElement('img');
  if (image_url !== null) {
    img.src = image_url;
    img.alt = 'Beer label';
  }
  
  const beerName = document.createElement('h3');
  beerName.textContent = name;
  
  const card = document.createElement('div')
  card.className = 'card';
  card.append(img, beerName);

  document.querySelector('#item-container').appendChild(card)
}

function getBeerFromSearch() {
  const searchForm = document.querySelector('#beer-search')
  searchForm.addEventListener('submit', handleSearchSubmit);
}

function handleSearchSubmit(e) {
  e.preventDefault();
  
  const items = document.querySelector('#item-container');
  removeChildren(items);
  rerenderPageButtons();

  const name = e.target.parentNode.querySelector('#beer-name').value;
  getBeer(1, name);
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

function getMoreBeer(name) {
  page = 1;

  const previous = document.querySelector('#previous-page');
  previous.addEventListener('click', () => handlePreviousBttn(name));

  const next = document.querySelector('#next-page');
  next.addEventListener('click', () => handleNextBttn(name));
}

function handleNextBttn(name) {
  const items = document.querySelector('#item-container');
  if (items.children.length > 0) {
    page += 1;
    removeChildren(items);
    getBeer(page, name);
  }
}

function handlePreviousBttn(name) {
  page -= 1;
  if (page === 0) {
    page = 1;
    return;
  }
  
  const items = document.querySelector('#item-container');
  removeChildren(items);

  getBeer(page, name);
}

function removeChildren(node) {
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getBeer();
  getMoreBeer();
  getBeerFromSearch();
})