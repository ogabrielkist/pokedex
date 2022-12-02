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

addListenerToButtons(endpoint, "move");
handleDataCardsList(listId, endpoint);
