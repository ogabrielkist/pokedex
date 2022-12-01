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

async function handlePokemonList() {
  let currentDataPage = await searchAllPokemons();

  addPokemonsInThePage(currentDataPage);

  let wait = false;
  window.addEventListener("scroll", async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 && !wait) {
      console.log("uga");

      wait = true;
      setTimeout(async () => {
        wait = false;
        currentDataPage = await getMoreData(async () => {
          return currentDataPage;
        });
        addPokemonsInThePage(currentDataPage);
      }, 500);
    }
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
