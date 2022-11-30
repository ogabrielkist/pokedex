async function searchPokemonById(id) {
  const data = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);

  const json = await data.json();

  return json;
}

async function searchAllPokemons() {
  const data = await fetch("https://pokeapi.co/api/v2/pokemon/");

  const json = await data.json();
  // console.log(json);
  return json;
}

async function getMoreData(currentDataCallback) {
  const endpoint = (await currentDataCallback()).next;

  const data = await fetch(endpoint);
  const json = await data.json();

  return json;
}

// searchPokemonById("charizard");
// searchAllPokemons();
async function handlePokemonList() {
  let currentDataPage = await searchAllPokemons();

  const list = document.querySelector("#list");
  const btn = document.querySelector("#btn");
  addPokemonsInThePage(currentDataPage);

  // currentDataPage.results.forEach(({ name }) => {
  //   list.innerHTML += `<li>${name}</li>`;
  // });

  btn.addEventListener("click", async () => {
    console.log("aaaaaa");
    currentDataPage = await getMoreData(async () => {
      return currentDataPage;
    });
    addPokemonsInThePage(currentDataPage);
  });
}

async function addPokemonsInThePage({ results }) {
  const list = document.querySelector("#list");

  results.forEach(async ({ name, url }) => {
    const data = await fetch(url);
    const json = await data.json();
    list.innerHTML += `<li> <img src="${json.sprites.front_default}" alt=""><span>${name}</span></li>`;
  });
}

handlePokemonList();
