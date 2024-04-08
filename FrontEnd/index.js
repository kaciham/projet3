let token = localStorage.getItem("token");
let modalContent = document.querySelector(".modalContent");
let modalOption = document.querySelector(".modalOption");
console.log(modalOption);
console.log(modalContent);

function editor() {
  if (token) {
    document.getElementsByClassName("filterBar")[0].style.display = "none";
    document.querySelector(".logout").style.display = "block";
    document.querySelector(".login").style.display = "none";
    // document.querySelector(".project").style.display = "flex";
    document.querySelector(".editor").style.display = "flex";
    document.querySelector(".projet-item").style.display = "flex";
    document.querySelector(".modal").style.display = "none";
    document.querySelector(".modal2").style.display = "none";
  }
}

editor();

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
  // document.querySelector(".login").style.display = "block";
  // document.querySelector(".logout").style.display = "none";
  // document.getElementsByClassName("filterBar")[0].style.display = "flex";
  // document.querySelector(".project").style.display = "none";
  // document.querySelector(".editor").style.display = "none";
}
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

// Fonction pour filtrer et afficher les projets en fonction du filtre sélectionné
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

// feed modal element

fetch("http://localhost:5678/api/works")
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((res) => {
    res.forEach((element) => {
      let works = `<div class="injectHTML"><img src=${element.imageUrl} alt=${element.title}>
      <div class="action-icon">
        <img src="/assets/icons/trash-can-solid.svg" alt="trash icon" onclick="deleteObjet(${element.id})">
      </div></div>`;
      modalContent.insertAdjacentHTML("beforeend", works);
    });
  });

//feed modal category

fetch("http://localhost:5678/api/categories")
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((res) => {
    res.forEach((option) => {
      let options = `<option value="${option.id}">${option.name}</option>`;
      modalOption.insertAdjacentHTML("beforeend", options);
    });
  });

// Display uploaded image

let image = document.getElementById("file-upload");
let uploaded_image = "";
image.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    uploaded_image = reader.result;
    console.log(uploaded_image);
    document.querySelector(
      "#display-image"
    ).style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
  document.querySelector(".display-add-image").style.display = "none";
  document.querySelector("#display-image").style.display = "block";
});

//post new work

let form = document.getElementById("workPost");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const image = document.getElementById("file-upload").files[0];
  const title = document.getElementById("title").value;
  const categoryIdFirst = document.getElementById("category").value;
  const category = parseInt(categoryIdFirst);

  if (!image || !title || !category) {
    alert("Veuillez remplir tous les champs !");

    return;
  }
  const formData = new FormData();

  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Use Bearer token format
    },
    body: formData,
  })
    .then((response) => {
      response.json();
      if (response.ok) {
        window.location.href = "index.html";
      }
    })
    .then((data) => {
      console.log(data);
      console.log("voici l'objet ajouté ", data);
    });
});

function deleteObjet(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.ok) {
      window.location.href = "index.html";
      // modalProject();
    }
  });
}

// onclick see delete project

function modalProject() {
  console.log("ouverture modal");
  let modal = document.querySelector(".modal");
  modal.style.display = "flex";
  mainFixed = document.getElementById("specificPropertiesDiv");
  mainFixed.classList.add("specificPropertiesDiv");
}
function crossClose() {
  let modal = document.querySelector(".modal");
  let modal2 = document.querySelector(".modal2");
  modal.style.display = "none";
  modal2.style.display = "none";
  mainFixed = document.getElementById("specificPropertiesDiv");
  mainFixed.classList.remove("specificPropertiesDiv");
}

function nextPage() {
  let modal = document.querySelector(".modal");
  let modal2 = document.querySelector(".modal2");
  modal.style.display = "none";
  modal2.style.display = "flex";
}

function previousPage() {
  let modal = document.querySelector(".modal");
  let modal2 = document.querySelector(".modal2");
  modal.style.display = "flex";
  modal2.style.display = "none";
}

form.addEventListener("change", async () => {
  const image = document.getElementById("file-upload").files[0];
  const title = document.getElementById("title").value;
  const categoryIdFirst = document.getElementById("category").value;
  const category = parseInt(categoryIdFirst);
  if (image && title && category) {
    document.querySelector(".buttonInput").style.background = "#1D6154";
    document.querySelector(".buttonInput").style.pointerEvents = "all";
  }
});
