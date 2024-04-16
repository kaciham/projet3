const form = document.querySelector("form");
let storage = window.localStorage;

form.addEventListener("submit", (e) => {
  // empêche le comportement du submit par défault
  e.preventDefault();
  //création de l'objet "connexion";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const connexion = {
    email: email,
    password: password,
  };
  //création de la charge utile en convertissant le JSON en string
  const chargeUtile = JSON.stringify(connexion);

  // const message = document.getElementsByClassName(errorMessage);
  // message.value = "";
  //Requête envoyé au serveur et récupération du token
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: chargeUtile,
  })
    .then((res) => {
      if (res.status === 200) {
        let reso = res.json();
        return reso;
      } else {
        document.getElementsByClassName("errorMessage")[0].style.display =
          "block";
      }
    })
    .then((data) => {
      storage.setItem("token", data.token);
      console.log(data.token);
      window.location.href = "index.html";
    });
});
