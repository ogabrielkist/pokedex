function enableLoading() {
  const loadingElement = document.querySelector(".loading-wrapper");
  const body = document.querySelector("body");
  body.style.overflowY = "hidden";
  loadingElement.classList.add("ativo");
}

function disableLoading() {
  const loadingElement = document.querySelector(".loading-wrapper");
  const body = document.querySelector("body");

  setTimeout(() => {
    body.style.overflowY = "auto";
    loadingElement.classList.remove("ativo");
  }, 800);
}
