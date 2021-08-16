
//i
  //page number
//o
  //none
//getBeers
function getBeers(page = 1) {
  fetch(`https://api.punkapi.com/v2/beers`)
  .then(resp => resp.json())
  .then(beers => console.log(beers))
}

document.addEventListener('DOMContentLoaded', () => {
  getBeers();
})