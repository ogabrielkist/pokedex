// buildModal("magikarp");
// buildModal("gyarados");
// buildModal("gyarados");
buildModal("gyarados");

async function buildModal(pokemonName) {
  HandleSelectedPokemon(pokemonName);
}

async function HandleSelectedPokemon(pokemonName) {
  const selectedPokemon = await getPokemonByName(pokemonName);
  console.log(selectedPokemon);

  const pokeBG = document.querySelector(".pokedex-main-screen");
  const pokeImg = document.querySelector(".pokedex-image img");
  const pokeName = document.querySelector(".pokedex-main-screen h1");
  const pokeWeight = document.getElementById("weight");
  const pokeHeight = document.getElementById("height");
  const pokeTypesList = document.querySelector(".pokedex-types");
  const pokeMovesList = document.querySelector(".pokedex-move ul");
  const pokeWeaknessList = document.querySelector(".pokedex-weakness ul");

  pokeImg.src = selectedPokemon.sprites.other.dream_world.front_default;
  pokeName.innerText = capitalize(selectedPokemon.name);
  pokeBG.classList.add(`${selectedPokemon.types[0].type.name}-bg`);

  //TO DO VARIAVEIS COM NOMES DO TIPO E VALOR DE COR
  pokeName.style.color = "white";
  pokeWeight.innerText = `${selectedPokemon.weight / 10} KG`;
  pokeHeight.innerText = `${selectedPokemon.height / 10} M`;

  pokeTypesList.innerHTML = "";
  selectedPokemon.types.forEach((type) => {
    pokeTypesList.innerHTML += getPokemonTypeListItem(type.type.name);
  });

  selectedPokemon.stats.forEach((status) => {
    const attribute = document.getElementById(status.stat.name);
    attribute.innerText = status.base_stat;
  });

  pokeMovesList.innerHTML = "";
  for (let i = 0; i < selectedPokemon.moves.length - 1; i++) {
    if (i > 30) {
      break;
    }
    pokeMovesList.innerHTML += `<li>${selectedPokemon.moves[i].move.name}</li>`;
  }

  pokeWeaknessList.innerHTML = "";
  selectedPokemon.types.forEach((type) => {
    pokeWeaknessList.innerHTML += getPokemonEvolutionListItem(type.type.name);
  });
}

async function getPokemonByName(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokemon = await response.json();
  return pokemon;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPokemonTypeListItem(typeName) {
  return `
    <li>
      <span class="pokemon-type-text ${typeName}-bg">${typeName}</span>
      <img src="./img/pokemon-types/symbols/${typeName}.svg" alt="">
    </li>
  `;
}

function getPokemonEvolutionListItem(evolutionName, evolutionPhoto) {
  return `
    <li>
      <div class="evolution-pokemon">
        <img class="circle-bg" src="${""}" alt="${""}">
        <span>${""}</span>
      </div>

      <div class="evolution-arrow">
        <img src="./img/icons/arrow.svg" alt="Evolui para">
      </div>

      <div class="evolution-pokemon">
        <img class="circle-bg" src="${""}" alt="${""}">
        <span>${""}</span>
      </div>
    </li>
  `;
}

const closeButton = document.querySelector(".close-button");
if (closeButton) {
  closeButton.addEventListener("click", (event) => {
    console.log("clickou fechar");
  });
}
