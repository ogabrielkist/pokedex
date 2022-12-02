function buildModal(pokemonName) {
  HandleSelectedPokemon(pokemonName);

  const modal = document.querySelector("#pokedex");
  modal.scrollTo(0, 0);
}

async function HandleSelectedPokemon(pokemonName) {
  const selectedPokemon = await getPokemonByName(pokemonName);
  const maxValueProgressBar = 200;

  const actualTypeColor = getComputedStyle(document.documentElement).getPropertyValue(
    `--${selectedPokemon.types[0].type.name}-color`
  );
  const actualTypeTextColor = getComputedStyle(document.documentElement).getPropertyValue(
    `--${selectedPokemon.types[0].type.name}-text-color`
  );

  handlePokemonBasicInfo(selectedPokemon, actualTypeTextColor);
  handlePokemonTypeList(selectedPokemon);
  handlePokemonAttributes(selectedPokemon, actualTypeColor, maxValueProgressBar);

  const quantityToList = 30;
  handlePokemonMovesList(selectedPokemon, quantityToList);
  handlePokemonEvolutionChain(selectedPokemon);
  handlePokemonWeaknessList(selectedPokemon);
}

async function getPokemonByName(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokemon = await response.json();
  return pokemon;
}

function handlePokemonBasicInfo(pokemon, actualTypeTextColor) {
  const pokeBG = document.querySelector(".pokedex-main-screen");
  const pokeImg = document.querySelector(".pokedex-image img");
  const pokeName = document.querySelector(".pokedex-main-screen h1");
  const pokeWeight = document.getElementById("weight");
  const pokeHeight = document.getElementById("height");

  const attributesLabels = document.querySelectorAll(".pokemon-info-name");
  attributesLabels.forEach((label) => (label.style.color = actualTypeTextColor));

  pokeBG.classList.add(`${pokemon.types[0].type.name}-bg`);
  pokeImg.src = pokemon.sprites.other.dream_world.front_default;

  pokeName.innerText = capitalize(pokemon.name);
  pokeName.style.color = actualTypeTextColor;

  pokeWeight.innerText = `${pokemon.weight / 10} KG`;
  pokeWeight.style.color = actualTypeTextColor;

  pokeHeight.innerText = `${pokemon.height / 10} M`;
  pokeHeight.style.color = actualTypeTextColor;
}

function handlePokemonTypeList(pokemon) {
  const pokeTypesList = document.querySelector(".pokedex-types");
  pokeTypesList.innerHTML = "";
  pokemon.types.forEach((type) => {
    pokeTypesList.innerHTML += getPokemonTypeListItem(type.type.name);
  });
}

function handlePokemonAttributes(pokemon, actualTypeColor, maxValueProgressBar) {
  pokemon.stats.forEach((status) => {
    const attribute = document.getElementById(status.stat.name);
    attribute.innerText = status.base_stat;
  });

  pokemon.stats.forEach((status) => {
    const attributeBar = document.getElementById(`${status.stat.name}-progress`);
    const percentage = Math.round((status.base_stat * 100) / maxValueProgressBar);
    attributeBar.style.background = `linear-gradient(to right, ${actualTypeColor} ${percentage}%, #D6D6D6 0%)`;
  });
}

function handlePokemonMovesList(selectedPokemon, quantityToList) {
  const pokeMovesList = document.querySelector(".pokedex-move ul");
  pokeMovesList.innerHTML = "";
  for (let i = 0; i < selectedPokemon.moves.length - 1; i++) {
    if (i > quantityToList) {
      break;
    }
    pokeMovesList.innerHTML += `<li>${selectedPokemon.moves[i].move.name}</li>`;
  }
}

async function handlePokemonEvolutionChain(pokemon) {
  const pokeEvolutionList = document.querySelector(".pokedex-evolutions ul");
  const pokeEvoChain = await getPokemonEvolutionChain(pokemon);
  pokeEvolutionList.innerHTML = "";
  pokeEvoChain.forEach(async (evoPoke) => {
    const evolution = {
      basePoke: evoPoke.name,
      basePokeImg: (await getPokemonByName(evoPoke.name)).sprites.front_default,
      evoPoke: evoPoke.evolves_to,
      evoPokeImg: (await getPokemonByName(evoPoke.evolves_to)).sprites.front_default,
    };
    pokeEvolutionList.innerHTML += getPokemonEvolutionListItem(evolution);
  });
}

async function getPokemonEvolutionChain(pokemon) {
  const species = await (await fetch(pokemon.species.url)).json();
  let evoData = (await (await fetch(species.evolution_chain.url)).json()).chain;
  let evoChain = [];

  const initialPokemon = evoData.species.name;
  const nextEvolutions = evoData.evolves_to;

  if (nextEvolutions.length > 1) {
    nextEvolutions.forEach(({ species }) => {
      evoChain.push({ name: initialPokemon, evolves_to: species.name });
    });
  } else {
    loop(initialPokemon, nextEvolutions);
  }

  function loop(currentPoke, nextEvolutions) {
    if (nextEvolutions !== undefined && nextEvolutions.length > 1) {
      nextEvolutions.forEach(({ species }) => {
        evoChain.push({ name: currentPoke, evolves_to: species.name });
      });
      return;
    }

    if (nextEvolutions !== undefined) {
      nextEvolutions.forEach(({ species, evolves_to }) => {
        evoChain.push({ name: currentPoke, evolves_to: species.name });
        loop(species.name, evolves_to);
      });
    }
  }
  return evoChain;
}

async function handlePokemonWeaknessList(selectedPokemon) {
  const pokeWeaknessList = document.querySelector(".pokedex-weakness ul");

  pokeWeaknessList.innerHTML = "";
  selectedPokemon.types.forEach(async (type) => {
    const typeWeakness = await getTypeWeakness(type.type.url);
    typeWeakness.forEach((type) => (pokeWeaknessList.innerHTML += getPokemonWeaknessListItem(type)));
  });
}

async function getTypeWeakness(url) {
  const typeWeakness = await (await fetch(url)).json();
  const allWeaknessTypes = typeWeakness.damage_relations.double_damage_from;
  const typesNames = allWeaknessTypes.map((item) => {
    return item.name;
  });

  return typesNames;
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

function getPokemonEvolutionListItem(evolution) {
  return `
    <li>
      <div class="evolution-pokemon" onclick="buildModal('${evolution.basePoke}')">
        <img class="circle-bg" src="${evolution.basePokeImg}" alt="">
        <span>${evolution.basePoke}</span>
      </div>

      <div class="evolution-arrow">
        <img src="./img/icons/arrow.svg" alt="Evolui para">
      </div>

      <div class="evolution-pokemon"" onclick="buildModal('${evolution.evoPoke}')">
        <img class="circle-bg" src="${evolution.evoPokeImg}" alt="">
        <span>${evolution.evoPoke}</span>
      </div>
    </li>
  `;
}

function getPokemonWeaknessListItem(weaknessName) {
  return `
    <li>
      ${capitalize(weaknessName)}
    </li>
  `;
}

const closeButton = document.querySelector(".close-button");
if (closeButton) {
  closeButton.addEventListener("click", destroyModal);
}

function destroyModal() {
  const pokedex = document.querySelector("#pokedex");
  const pokedexScreen = document.querySelector(".pokedex-screen");
  pokedexScreen.classList = "pokedex-screen pokedex-main-screen";
  pokedex.style.display = "none";
  document.body.style.overflow = "auto";
}

const pokedex = document.querySelector("#pokedex");

pokedex.addEventListener("click", (e) => {
  if (e.target === pokedex) {
    destroyModal();
  }
});
