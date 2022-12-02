async function searchAllTypes() {
  const data = await fetch("https://pokeapi.co/api/v2/type/");
  const json = await data.json();
  return json;
}

async function handleTypeItem() {
  enableLoading();

  const list = document.querySelector("#list");
  list.innerHTML = "";

  let currentDataPage = await searchAllTypes();
  addTypeCardsInThePage(currentDataPage);

  disableLoading();
}

function createTypeCard(name) {
  if (name == "unknown") return "";

  return `
    <li>
      <span class="pokemon-type-text ${name}-bg">${name}</span>
    </li>
  `;
}

async function addTypeCardsInThePage({ results }) {
  const list = document.querySelector("#list");

  results.forEach(async ({ name }) => {
    list.innerHTML += createTypeCard(name);
  });
}

handleTypeItem();
