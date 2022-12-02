const endpoint = "move/";
const listId = "#list";

function createMoveCard(type, name) {
  return `
    <li>
      <span>${name.split("-").join(" ")}</span>
      <span class="pokemon-type-text ${type}-bg">${type}</span>
    </li>
  `;
}

function showSingleMoveCard(data) {
  const list = document.querySelector("#list");

  list.innerHTML = createMoveCard(data.type.name, data.name);

  const showAllbtn = document.querySelector(".showall");
  showAllbtn.style.display = "block";
}

const form = document.querySelector(".searchform");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSearchData(event, endpoint, "move");
});

const btn = document.querySelector(".searchbarbtn");
btn.addEventListener("click", (event) => {
  event.preventDefault();
  handleSearchData(event, endpoint, "move");
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
