const endpoint = "item/";
const listId = "#list";

function createItemCard(img, name) {
  return `
    <li onclick="">
      <img src="${img}">
      <span>${name.split("-").join(" ")}</span>
    </li>
  `;
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
  handleSearchData(event, endpoint, "item");
});

const btn = document.querySelector(".searchbarbtn");
btn.addEventListener("click", (event) => {
  event.preventDefault();
  handleSearchData(event, endpoint, "item");
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
