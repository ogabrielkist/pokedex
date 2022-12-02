async function searchAllMoves() {
  const data = await fetch("https://pokeapi.co/api/v2/move/");
  const json = await data.json();
  return json;
}

async function getMoreData(currentDataCallback) {
  const endpoint = (await currentDataCallback()).next;

  const data = await fetch(endpoint);
  const json = await data.json();

  return json;
}

async function handleMoveItem() {
  enableLoading();

  const list = document.querySelector("#list");
  list.innerHTML = "";

  let currentDataPage = await searchAllMoves();
  addMovesInThePage(currentDataPage);

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
        addMovesInThePage(currentDataPage);
        disableLoading();
      }, 500);
    }
  });
  disableLoading();
}

function createMoveCard(type, name) {
  return `
    <li>
      <span>${name.split("-").join(" ")}</span>
      <span class="pokemon-type-text ${type}-bg">${type}</span>
    </li>
  `;
}

async function addMovesInThePage({ results }) {
  const list = document.querySelector("#list");

  results.forEach(async ({ name, url }) => {
    const data = await fetch(url);
    const json = await data.json();

    list.innerHTML += createMoveCard(json.type.name, name);
  });
}

async function handleMoveSearch(event) {
  event.preventDefault();

  const typedMove = document
    .querySelector(".searchbar")
    .value.split(" ")
    .join("-")
    .toLowerCase();
  const error = document.querySelector(".error");

  if (!typedMove.length) {
    error.innerText =
      "Hey! you forgot to insert the name of the move you want.";
    handleMoveItem();
    return;
  }

  enableLoading();
  try {
    const data = await fetch("https://pokeapi.co/api/v2/move/" + typedMove);
    json = await data.json();

    showSingleMoveCard(json);
  } catch (e) {
    error.innerText = `Error: Item with the name "${typedMove}" not found`;
  } finally {
    disableLoading();
  }
}

function removeErrorMessage() {
  const error = document.querySelector(".error");

  error.innerText = "";
}

function showSingleMoveCard(data) {
  const list = document.querySelector("#list");

  list.innerHTML = createMoveCard(data.sprites.default, data.name);

  const showAllbtn = document.querySelector(".showall");
  showAllbtn.style.display = "block";
}

const form = document.querySelector(".searchform");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleMoveSearch(event);
});

const btn = document.querySelector(".searchbarbtn");
btn.addEventListener("click", (event) => {
  event.preventDefault();
  handleMoveSearch(event);
});

const showAllbtn = document.querySelector(".showall");
showAllbtn.addEventListener("click", async () => {
  enableLoading();
  showAllbtn.style.display = "none";

  let currentDataPage = await searchAllMoves();
  const list = document.querySelector("#list");
  list.innerHTML = "";

  addMovesInThePage(currentDataPage);
  disableLoading();
});

handleMoveItem();
