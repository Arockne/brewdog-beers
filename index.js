let page = 1;

function getBeer(page = 1, name) {
  name = replaceSpaces(name);
  const url = name ? `https://api.punkapi.com/v2/beers?page=${page}&per_page=20&beer_name=${name}` : `https://api.punkapi.com/v2/beers?page=${page}&per_page=20`;
  fetch(url)
  .then(resp => resp.json())
  .then(renderBeer)
}

function getRandomBeer() {
  const randomBttn = document.querySelector('#random-bttn');
  const items = document.querySelector('#item-container');
  randomBttn.addEventListener('click', () => {
    rerenderPageButtons();
    removeChildren(items);
    fetch('https://api.punkapi.com/v2/beers/random')
    .then(resp => resp.json())
    .then(beer => {
      renderBeer(beer)
      items.firstChild.style.margin = '0 auto';
    })
  })
}

function replaceSpaces(name) {
  const spaces = / /g;
  if (name) name.trim();
  if (spaces.test(name)) {
    name = name.replace(spaces, '_');
  }
  return name;
}

function renderBeer(beers) {
  beers.forEach(createBeerCard)
  if (beers.length === 0) handleEndOfSelection();
}

function handleEndOfSelection() {
  const end = createElementWithText('p', "End of Selection \'(>_<)\'");
  end.id = 'end';
  document.querySelector('#item-container').append(end);
}

function createBeerCard(beer) {
  const {image_url, name} = beer
  const imgURL = image_url ? image_url : './resources/images/bottle.png';
  const img = createImage(imgURL, 'Bottle');
  const beerName = createElementWithText('h3', name);
  const favorite = createElementWithText('p', '♡');
  favorite.className = 'favorite';
  getStoredFavoriteBeer(beer, favorite);
  favorite.addEventListener('click', () => handleFavorite(beer, favorite));
  const card = document.createElement('div')
  card.className = 'card';
  card.append(img, beerName, favorite);
  document.querySelector('#item-container').appendChild(card)
}

function handleFavorite(beer, favorite) {
  if (!beer.favorite) {
    beer.favorite = true;
    favorite.textContent = '♥';
    storeFavoriteBeer(beer);
  } else {
    beer.favorite = false;
    favorite.textContent = '♡';
    deleteFavoriteBeer(beer);
  }
}

function getStoredFavoriteBeer(beer, favorite) {
  fetch('http://localhost:3000/favorites')
  .then(resp => resp.json())
  .then(favoriteBeer => {
    favoriteBeer.forEach(local => {
      if (local.id === beer.id) {
        beer.favorite = true;
        favorite.textContent = '♥';
      }
    })
  }) 
}

function storeFavoriteBeer(beer) {
  fetch('http://localhost:3000/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: beer.id})
  })
}

function deleteFavoriteBeer(beer) {
  fetch(`http://localhost:3000/favorites/${beer.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


function getBeerFromSearch() {
  const searchForm = document.querySelector('#beer-search')
  searchForm.addEventListener('submit', handleSearchSubmit);
}

function refreshList() {
  const logo = document.querySelector('.page-header img');
  const items = document.querySelector('#item-container');
  logo.addEventListener('click', () => {
    removeChildren(items);
    rerenderPageButtons();
    getBeer();
    handlePageChangeWith();
  });
}

function handleSearchSubmit(e) {
  e.preventDefault();
  const items = document.querySelector('#item-container');
  removeChildren(items);
  rerenderPageButtons();
  const name = e.target.parentNode.querySelector('#beer-name').value;
  getBeer(1, name);
  handlePageChangeWith(name);
  e.target.reset();
}

function rerenderPageButtons() {
  const bttnContainer = document.querySelector('#bttn-container');
  removeChildren(bttnContainer);
  const previous = createElementWithText('button', 'Previous Page');
  previous.id = 'previous-page';
  const next = createElementWithText('button', 'Next Page');
  next.id = "next-page";
  bttnContainer.append(previous, next);
}

function handlePageChangeWith(name) {
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

function createImage(src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  return img;
}

function createElementWithText(element, text) {
  element = document.createElement(element);
  element.textContent = text;
  return element;
}

function removeChildren(node) {
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getBeer();
  handlePageChangeWith();
  getBeerFromSearch();
  getRandomBeer();
  refreshList();
})