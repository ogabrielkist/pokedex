const idList = "#list";
const endpoint = "type/";

async function handleTypeItem() {
  enableLoading();

  const list = document.querySelector(idList);
  list.innerHTML = "";

  let currentDataPage = await fetchAllItems(endpoint);
  addCardsInThePage(currentDataPage, endpoint);

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

handleTypeItem();
