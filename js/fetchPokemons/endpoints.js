async function searchAllPokemons() {
  const data = await fetch("https://pokeapi.co/api/v2/pokemon/");
  const json = await data.json();
  return json;
}

async function getMoreData(currentDataCallback) {
  const endpoint = (await currentDataCallback()).next;

  const data = await fetch(endpoint);
  const json = await data.json();

  return json;
}

async function handlePokemonList() {
  enableLoading();

  const list = document.querySelector("#list");
  list.innerHTML = "";

  let currentDataPage = await searchAllPokemons();

  addPokemonsInThePage(currentDataPage);

  let wait = false;
  window.addEventListener("scroll", async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 && !wait) {
      enableLoading();
      wait = true;
      setTimeout(async () => {
        wait = false;
        currentDataPage = await getMoreData(async () => {
          return currentDataPage;
        });
        addPokemonsInThePage(currentDataPage);
        disableLoading();
      }, 500);
    }
  });
  disableLoading();
}

async function addPokemonsInThePage({ results }) {
  const list = document.querySelector("#list");

  results.forEach(async ({ name, url }) => {
    const data = await fetch(url);
    const json = await data.json();

    list.innerHTML += `<li onclick="sendDataOfPokemonToModal(event)"> 
                        <img src="${json.sprites.front_default}" alt="">
                        <span>${name}</span>
                      </li>`;
  });
}

async function handlePokemonSearch(event) {
  event.preventDefault();

  const typedPokemon = document.querySelector(".searchbar").value.toLowerCase();
  const error = document.querySelector(".error");

  if (!typedPokemon.length) {
    error.innerText =
      "Hey! you forgot to insert the name of the pokemon you want.";
    handlePokemonList();
    return;
  }

  try {
    const data = await fetch(
      "https://pokeapi.co/api/v2/pokemon/" + typedPokemon
    );
    json = await data.json();

    showSinglePokemonCard(json);
  } catch (e) {
    error.innerText = `Error: Pokemon with the name "${typedPokemon}" not found`;
  }
}

function removeErrorMessage() {
  const error = document.querySelector(".error");

  error.innerText = "";
}

function showSinglePokemonCard(data) {
  const list = document.querySelector("#list");
  list.innerHTML = `<li onclick="sendDataOfPokemonToModal(event)"> 
                     <img src="${data.sprites.front_default}" alt="">
                     <span>${data.name}</span>
                    </li>`;

  const showAllbtn = document.querySelector(".showall");
  showAllbtn.style.display = "block";
}

function sendDataOfPokemonToModal(event) {
  const pokeValue = event.currentTarget.querySelector("span").innerText;
  console.log(pokeValue);
}

const form = document.querySelector(".searchform");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  handlePokemonSearch(event);
});

const btn = document.querySelector(".searchbarbtn");
btn.addEventListener("click", (event) => {
  event.preventDefault();
  handlePokemonSearch(event);
});

const showAllbtn = document.querySelector(".showall");
showAllbtn.addEventListener("click", async () => {
  showAllbtn.style.display = "none";

  let currentDataPage = await searchAllPokemons();
  const list = document.querySelector("#list");
  list.innerHTML = "";

  addPokemonsInThePage(currentDataPage);
});

handlePokemonList();
