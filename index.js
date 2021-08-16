function getBeers(page = 1) {
  fetch(`https://api.punkapi.com/v2/beers?page=${page}&per_page=20`)
  .then(resp => resp.json())
  .then(renderBeers)
}

function renderBeers(beers) {
  beers.forEach(createBeerCard)
}

function createBeerCard(beer) {
  const img = document.createElement('img');
  img.src = beer.image_url;
  
  const name = document.createElement('h3');
  name.textContent = beer.name;
  
  const card = document.createElement('div')
  card.className = 'card';
  card.append(img, name);

  document.querySelector('#item-container').appendChild(card)
}

function getMoreBeer() {
  let page = 1;
  const less = document.querySelector('#less');
  less.addEventListener('click', () => {
    page -= 1;
    if (page === 0) {
      return;
    }
    document.querySelector('#item-container').forEach()
    getBeers(page);
  })
  const more = document.querySelector('#more');
  more.addEventListener('click', () => {
    page += 1;
    getBeers(page);
  })
}

document.addEventListener('DOMContentLoaded', () => {
  getBeers();
  getMoreBeer();
})