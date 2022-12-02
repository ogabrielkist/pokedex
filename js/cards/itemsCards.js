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

addListenerToButtons(endpoint, "item");
handleDataCardsList(listId, endpoint);
