let isOnASinglePokemonPage = false;

async function fetchAllItems(endpoint) {
  const data = await fetch("https://pokeapi.co/api/v2/" + endpoint);
  const json = await data.json();
  return json;
}

async function getMoreData(currentDataCallback) {
  const endpoint = (await currentDataCallback()).next;
  if (!endpoint) return;
  const data = await fetch(endpoint);
  const json = await data.json();

  return json;
}

async function handleDataCardsList(listId, endpoint) {
  enableLoading();

  const list = document.querySelector(listId);
  list.innerHTML = "";

  let currentDataPage = await fetchAllItems(endpoint);

  addCardsInThePage(currentDataPage, endpoint);

  let wait = false;
  window.addEventListener("scroll", async function infiniteScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (isOnASinglePokemonPage) return;

    if (scrollTop + clientHeight >= scrollHeight - 5 && !wait) {
      enableLoading();
      wait = true;
      setTimeout(async () => {
        wait = false;
        currentDataPage = await getMoreData(async () => {
          return currentDataPage;
        });

        if (!currentDataPage) return;
        addCardsInThePage(currentDataPage, endpoint);
        disableLoading();
      }, 500);
    }
  });
  disableLoading();
}

async function addCardsInThePage({ results }, type) {
  const list = document.querySelector("#list");

  results.forEach(async ({ name, url }) => {
    const data = await fetch(url);
    const json = await data.json();

    if (type === "pokemon/") {
      list.innerHTML += createPokemonCard(
        json.sprites.front_default,
        name,
        json.types
      );
    } else if (type === "item/") {
      list.innerHTML += createItemCard(json.sprites.default, json.name);
    } else if (type === "move/") {
      list.innerHTML += createMoveCard(json.type.name, name);
    } else if (type === "type/") {
      list.innerHTML += createTypeCard(name);
    }
  });
}

async function handleSearchData(event, endpoint, type) {
  event.preventDefault();

  const typedText = document
    .querySelector(".searchbar")
    .value.toLowerCase()
    .split(" ")
    .join("-");
  const error = document.querySelector(".error");

  if (!typedText.length) {
    error.innerText = `Hey! you forgot to insert the name of the ${type} you want.`;
    handleDataCardsList("#list", endpoint);
    isOnASinglePokemonPage = true;
    return;
  }

  isOnASinglePokemonPage = true;
  enableLoading();
  try {
    const data = await fetch(
      `https://pokeapi.co/api/v2/${endpoint}${typedText}`
    );
    json = await data.json();

    if (type === "pokemon") {
      showSinglePokemonCard(json);
    } else if (type === "item") {
      showSingleItemCard(json);
    } else if (type === "move") {
      showSingleMoveCard(json);
    }
  } catch (e) {
    error.innerText = `Error: ${type} with the name "${typedText}" not found`;
  } finally {
    disableLoading();
  }
}

function removeErrorMessage() {
  const error = document.querySelector(".error");

  error.innerText = "";
}

function addListenerToButtons(endpoint, type) {
  const showAllbtn = document.querySelector(".showall");

  showAllbtn.addEventListener("click", async () => {
    enableLoading();
    showAllbtn.style.display = "none";

    let currentDataPage = await fetchAllItems(endpoint);
    const list = document.querySelector("#list");
    list.innerHTML = "";

    addCardsInThePage(currentDataPage, endpoint);
    isOnASinglePokemonPage = false;
    disableLoading();
  });

  const form = document.querySelector(".searchform");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSearchData(event, endpoint, type);
  });

  const btn = document.querySelector(".searchbarbtn");
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    handleSearchData(event, endpoint, type);
  });
}
