// Initialisation
let allData = [];
fetch("http://localhost:5678/api/works")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Réseau ou réponse non valide");
    }
    return response.json();
  })
  .then((data) => {
    allData = data;
    applyFilter("tous"); // Afficher toutes les données initialement
  })
  .catch((error) => console.log(error));

// Fonction pour afficher les éléments dans la galerie
function displayWorks(data) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Effacer le contenu actuel
  data.forEach((element) => {
    let works = `<figure><img src=${element.imageUrl}><figcaption>${element.title}</figcaption></figure>`;
    gallery.insertAdjacentHTML("beforeend", works);
  });
}

// Fonction pour filtrer et afficher les travaux en fonction du filtre sélectionné
function applyFilter(category) {
  const filteredData =
    category === "tous"
      ? allData
      : allData.filter((element) => element.category.name === category);
  displayWorks(filteredData);
}

// Écouteur d'événements pour les filtres
let filters = document.querySelectorAll(".filter");
filters.forEach((filter) => {
  filter.addEventListener("click", function () {
    const currentlyActive = document.querySelector(
      '.filter[data-active="true"]'
    );

    if (currentlyActive) {
      currentlyActive.removeAttribute("data-active");
      currentlyActive.classList.remove("activeCss");
    }

    if (currentlyActive !== this) {
      this.classList.add("activeCss");
      this.setAttribute("data-active", "true");
      applyFilter(this.getAttribute("data-name"));
    } else {
      applyFilter("tous"); // Aucun filtre actif, afficher toutes les données
    }
  });
});
