const mapSelect = document.querySelector("#mapSelect");
const maps = document.querySelectorAll(".maps");
const locationLabel = document.querySelector("#location");
const gameStatus = document.querySelector("#status");
const reset = document.querySelector("#reset");
const hint = document.querySelector("#hint");
const cheat = document.querySelector("#cheat");

let allLocations = [];
let clickedLocation = null;
let chosenLocationIdx = null;
let locationToSelect = null;
let count = null;
let clickedLocations = [];
let mapSelected = "usa";
let toggle = 1;
let map = document.querySelectorAll(`#${mapSelected} path`);
gameStatus.style.display = "none";

reset.disabled = true;
hint.disabled = true;
cheat.disabled = true;

hint.addEventListener("click", () => {
  for (let location of map) {
    if (locationToSelect === location.dataset.name) {
      if (toggle) {
        location.style.fill = "#ffe08a";
        gameStatus.style.display = "";
         gameStatus.classList.value = "notification is-warning";
          gameStatus.textContent = "Hint Revealed!";
        toggle = 0;
      } else {
        gameStatus.style.display = "none"
        location.style.fill = "white";
        toggle = 1;
      }
    }
  }
});

mapSelect.addEventListener("change", (e) => {
  reset.disabled = false;
  hint.disabled = false;
  cheat.disabled = false;
  locationLabel.textContent = "";
  mapSelected = mapSelect.value;
  mapSelect.disabled = true;

  //Only display the selected map; hide the others
  for (let map of maps) {
    if (map.id !== mapSelected) {
      map.hidden = true;
    } else {
      map.hidden = false;
    }
  }

  // Given the large size of the world, in order to display it completely, bulma is-flex is used
  if (mapSelected === "world") {
    const div = document.querySelector("#world");
    div.classList.add("is-flex");
  }

  // querying all the paths(locations) within the selected map
  map = document.querySelectorAll(`#${mapSelected} path`);

  // extracting the names of all the locations and putting them in a an array called allLocations
  allLocations = [];
  for (let location of map) {
    allLocations.push(location.dataset.name);
    location.style.fill = "white";
  }

  clickedLocation = null;
  chosenLocationIdx = Math.floor(Math.random() * allLocations.length - 1);
  locationToSelect = allLocations[chosenLocationIdx];

  locationLabel.textContent = locationToSelect.toUpperCase();
  gameStatus.style.display = "none";

  locationLabel.style.color = "dark-grey";
  count = allLocations.length;

  for (let location of map) {
    location.addEventListener("click", (e) => {
      clickedLocation = location.dataset.name;

      if (clickedLocation === locationToSelect) {
        gameStatus.style.display = "none";
        if (clickedLocations.length !== 0) {
          for (let location of clickedLocations) {
            location.style.fill = "white";
          }
          clickedLocations = [];
        }
        location.style.fill = "mediumseagreen";
        count = count - 1;
        if (count === 0) {
          locationLabel.textContent = "";
          gameStatus.style.display = "";

          gameStatus.classList.value = "notification is-success";
          gameStatus.textContent = "Great Job! You found all locations!";
        } else {
          allLocations.splice(chosenLocationIdx, 1);
          chosenLocationIdx = Math.floor(Math.random() * count);
          locationToSelect = allLocations[chosenLocationIdx];
          locationLabel.textContent = locationToSelect.toUpperCase();
        }
      } else {
        if (location.style.fill !== "mediumseagreen") {
          location.style.fill = "#ffe08a";
          gameStatus.style.display = "";
          gameStatus.classList.value = "notification is-warning";
          gameStatus.textContent = "Incorrect! Try Again.";
          clickedLocations.push(location);
        }
      }
    });
  }
});

cheat.addEventListener("click", (e) => {
  hint.disabled = true;
  cheat.disabled = true;

  while (count !== 0) {
    for (let location of map) {
      if (location.dataset.name === locationToSelect) {
        location.style.fill = "mediumseagreen";
      }
    }
    count = count - 1;
    allLocations.splice(allLocations.indexOf(locationToSelect), 1);
    chosenLocationIdx = Math.floor(Math.random() * count);
    locationToSelect = allLocations[chosenLocationIdx];
    if(count !== 0) locationLabel.textContent = locationToSelect.toUpperCase();

  }

 
 
 
    locationLabel.textContent = "";
    gameStatus.style.display = "";
    gameStatus.classList.value = "notification is-success";
    gameStatus.textContent = "Great Job Cheating! You found all locations!";
  
});

reset.addEventListener("click", (e) => {
  allLocations = allLocations.slice();
  clickedLocation = null;
  clickedLocations = [];

  locationLabel.textContent = "";
  gameStatus.textContent = "";
  gameStatus.style.display = "none";

  for (let location of map) {
    location.style.fill = "white";
  }
  mapSelect.disabled = false;
  for (let map of maps) {
    map.hidden = true;
  }
  reset.disabled = true;
  mapSelect.value = "";

  if (mapSelected === "world") {
    const div = document.querySelector("#world");
    div.classList.remove("is-flex");
  }
});
