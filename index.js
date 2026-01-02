let page = 1;

const getBeer = (page = 1, name) => {
  name = replaceSpaces(name);
  // Old API URL: https://api.punkapi.com/v2/
  const url = name ? `https://punkapi-alxiw.amvera.io/v3/beers?page=${page}&per_page=14&beer_name=${name}` : `https://punkapi-alxiw.amvera.io/v3/beers?page=${page}&per_page=14`;
  fetch(url)
  .then(resp => resp.json())
  .then(renderBeer)
}

const getRandomBeer = () => {
  const randomBttn = document.querySelector('#random-bttn');
  const items = document.querySelector('.item-container');
  randomBttn.addEventListener('click', () => {
    rerenderPageButtons();
    removeChildren(items);
    fetch('https://api.punkapi.com/v2/beers/random')
    .then(resp => resp.json())
    .then(renderBeer)
  })
}

const replaceSpaces = name => {
  const spaces = / /g;
  if (name) name.trim();
  if (spaces.test(name)) {
    name = name.replace(spaces, '_');
  }
  return name;
}

const renderBeer = beers => {
  beers.forEach(createBeerCard)
  if (beers.length === 0) handleEndOfSelection();
}

const handleEndOfSelection = () => {
  const end = createElementWithText('p', "End of Selection \'(>_<)\'");
  end.className = 'end';
  document.querySelector('.item-container').append(end);
}

const createBeerCard = beer => {
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
  document.querySelector('.item-container').appendChild(card)
}

const handleFavorite = (beer, favorite) => {
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

const getStoredFavoriteBeer = (beer, favorite) => {
  fetch('./favorites')
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

const storeFavoriteBeer = beer => {
  fetch('./favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: beer.id})
  })
}

const deleteFavoriteBeer = beer => {
  fetch(`./favorites/${beer.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


const getBeerFromSearch = () => {
  const searchForm = document.querySelector('.beer-search')
  searchForm.addEventListener('submit', handleSearchSubmit);
}

const refreshList = () => {
  const logo = document.querySelector('.page-header img');
  const items = document.querySelector('.item-container');
  logo.addEventListener('click', () => {
    removeChildren(items);
    rerenderPageButtons();
    getBeer();
    handlePageChangeWith();
  });
}

const handleSearchSubmit = e => {
  e.preventDefault();
  const items = document.querySelector('.item-container');
  removeChildren(items);
  rerenderPageButtons();
  const name = e.target.parentNode.querySelector('#beer-name').value;
  getBeer(1, name);
  handlePageChangeWith(name);
  e.target.reset();
}

const rerenderPageButtons = () => {
  const bttnContainer = document.querySelector('.bttn-container');
  removeChildren(bttnContainer);
  const previous = createElementWithText('button', 'Previous Page');
  previous.id = 'previous-page';
  const next = createElementWithText('button', 'Next Page');
  next.id = "next-page";
  bttnContainer.append(previous, next);
}

const handlePageChangeWith = name => {
  page = 1;
  const previous = document.querySelector('#previous-page');
  previous.addEventListener('click', () => handlePreviousBttn(name));
  const next = document.querySelector('#next-page');
  next.addEventListener('click', () => handleNextBttn(name));
}

const handleNextBttn = name => {
  const items = document.querySelector('.item-container');
  if (items.children.length > 0) {
    page += 1;
    removeChildren(items);
    getBeer(page, name);
  }
}

const handlePreviousBttn = name => {
  page -= 1;
  if (page === 0) {
    page = 1;
    return;
  }
  const items = document.querySelector('.item-container');
  removeChildren(items);
  getBeer(page, name);
}

const createImage = (src, alt) => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  return img;
}

const createElementWithText = (element, text) => {
  element = document.createElement(element);
  element.textContent = text;
  return element;
}

const removeChildren = node => {
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
