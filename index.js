
//i
  //page number
//o
  //none
//getBeers
function getBeers(page = 1) {
  fetch(`https://api.punkapi.com/v2/beers`)
  .then(resp => resp.json())
  .then(renderBeers)
}

function renderBeers(beers) {
  beers.forEach(beer => {
    const img = document.createElement('img');
    img.src = beer.image_url;

    const name = document.createElement('h3');
    name.textContent = beer.name;

    const card = document.createElement('div')
    card.className = 'card';
    card.append(img, name);
    console.log(card);

    document.querySelector('#item-container').appendChild(card)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  getBeers();
})