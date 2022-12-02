const endpoint = "pokemon/";
const listId = "#list";

function createPokemonCard(img, name, types) {
  return `
    <li onclick="sendDataOfPokemonToModal(event)" class="pkcard">
      <img src="${img}" alt="">
      <span class="pokename">${name}</span>
      ${types
        .map(
          ({ type }) =>
            `<span class="pokemon-type-text ${type.name.toLowerCase()}-bg">${
              type.name
            }</span>`
        )
        .join("")} 
    </li>
  `;
}

function showSinglePokemonCard(data) {
  const list = document.querySelector("#list");

  list.innerHTML = createPokemonCard(
    data.sprites.front_default,
    data.name,
    data.types
  );

  const showAllbtn = document.querySelector(".showall");
  showAllbtn.style.display = "block";
}

function sendDataOfPokemonToModal(event) {
  const pokeValue = event.currentTarget.querySelector(".pokename").innerText;
  enableLoading();
  document
    .querySelector(".pokedex-image img")
    .addEventListener("load", showModal);
  buildModal(pokeValue.toLowerCase());
  disableLoading("hidden");
}

function showModal() {
  const modal = document.querySelector("#pokedex");
  modal.classList.remove("not-showing-modal");
  modal.classList.add("showing-modal");

  const pokedexItem = document.querySelector(".pokedex");
  pokedexItem.classList.remove("not-showing-modal");
  pokedexItem.classList.add("showing-modal");

  disableLoading("hidden");
}

const form = document.querySelector(".searchform");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSearchData(event, endpoint, "pokemon");
});

const btn = document.querySelector(".searchbarbtn");
btn.addEventListener("click", (event) => {
  event.preventDefault();
  handleSearchData(event, endpoint, "pokemon");
});

const showAllbtn = document.querySelector(".showall");
showAllbtn.addEventListener("click", async () => {
  enableLoading();
  showAllbtn.style.display = "none";

  let currentDataPage = await fetchAllItems(endpoint);
  const list = document.querySelector("#list");
  list.innerHTML = "";

  addCardsInThePage(currentDataPage, endpoint);
  disableLoading();
});

handleDataCardsList(listId, endpoint);
