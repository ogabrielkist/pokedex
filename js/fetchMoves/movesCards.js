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

async function handleItemList() {
  enableLoading();

  const list = document.querySelector("#list");
  list.innerHTML = "";

  let currentDataPage = await searchAllMoves();
  addItemsInThePage(currentDataPage);

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
        addItemsInThePage(currentDataPage);
        disableLoading();
      }, 500);
    }
  });
  disableLoading();
}

function createItemCard(type, name) {
  return `
    <li>
      <span>${name.split("-").join(" ")}</span>
      <span class="pokemon-type-text ${type}-bg">${type}</span>
    </li>
  `;
}

async function addItemsInThePage({ results }) {
  const list = document.querySelector("#list");

  results.forEach(async ({ name, url }) => {
    const data = await fetch(url);
    const json = await data.json();

    list.innerHTML += createItemCard(json.type.name, name);
  });
}

async function handleItemSearch(event) {
  event.preventDefault();

  const typedItem = document
    .querySelector(".searchbar")
    .value.split(" ")
    .join("-")
    .toLowerCase();
  const error = document.querySelector(".error");

  if (!typedItem.length) {
    error.innerText =
      "Hey! you forgot to insert the name of the move you want.";
    handleItemList();
    return;
  }

  enableLoading();
  try {
    const data = await fetch("https://pokeapi.co/api/v2/move/" + typedItem);
    json = await data.json();

    showSingleItemCard(json);
  } catch (e) {
    error.innerText = `Error: Item with the name "${typedItem}" not found`;
  } finally {
    disableLoading();
  }
}

function removeErrorMessage() {
  const error = document.querySelector(".error");

  error.innerText = "";
}

function showSingleItemCard(data) {
  const list = document.querySelector("#list");

  list.innerHTML = createItemCard(data.sprites.default, data.name);

  const showAllbtn = document.querySelector(".showall");
  showAllbtn.style.display = "block";
}

const form = document.querySelector(".searchform");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleItemSearch(event);
});

const btn = document.querySelector(".searchbarbtn");
btn.addEventListener("click", (event) => {
  event.preventDefault();
  handleItemSearch(event);
});

const showAllbtn = document.querySelector(".showall");
showAllbtn.addEventListener("click", async () => {
  enableLoading();
  showAllbtn.style.display = "none";

  let currentDataPage = await searchAllMoves();
  const list = document.querySelector("#list");
  list.innerHTML = "";

  addItemsInThePage(currentDataPage);
  disableLoading();
});

handleItemList();
