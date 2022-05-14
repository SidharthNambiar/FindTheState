const mapSelect = document.querySelector("#mapSelect");
const maps = document.querySelectorAll(".maps");
const locationLabel = document.querySelector("#location");
const gameStatus = document.querySelector("#status");
const reset = document.querySelector("#reset");
const hint = document.querySelector("#hint");
const cheat = document.querySelector("#cheat");
const body = document.querySelector("body");
const hintBeacon = document.createElement("span");

let allLocations = [];
let clickedLocation = null;
let chosenLocationIdx = null;
let locationToSelect = null;
let count = null;
let clickedLocations = [];
let mapSelected = "usa";
let toggle = 1;
let map = document.querySelectorAll(`#${mapSelected} path`);
let hintLocation = null;

gameStatus.style.display = "none";

reset.disabled = true;
hint.disabled = true;
cheat.disabled = true;

hint.addEventListener("click", () => {
  for (let location of map) {
    if (locationToSelect === location.dataset.name) {
      if (toggle) {
        console.log(location.getBoundingClientRect());
        hintLocation = location.getBoundingClientRect();
        hintBeacon.style.left = hintLocation.left + "px";
        hintBeacon.style.right = hintLocation.right + "px";
        hintBeacon.style.top = hintLocation.top + "px";
        hintBeacon.style.bottom = hintLocation.bottom + "px";
        hintBeacon.style.x = hintLocation.x + "px";
        hintBeacon.style.y = hintLocation.y + "px";

        // beacon.style.position = "absolute"
        body.append(hintBeacon);
        hintBeacon.classList.add("beacon");
        // location.style.fill = "#ffe08a";
        gameStatus.style.display = "";
        gameStatus.classList.value = "notification is-link";
        gameStatus.textContent = "Hint Revealed!";
        toggle = 0;
      } else {
        hintBeacon.classList.remove("beacon")
        hintLocation = ""
        hintBeacon.style.left = ""
        hintBeacon.style.right = ""
        hintBeacon.style.top = ""
        hintBeacon.style.bottom = ""
        hintBeacon.style.x = ""
        hintBeacon.style.y = ""
        
        gameStatus.style.display = "none";
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
      let x = e.x;
      let y = e.y;
      console.log(x, y);
      console.dir(location);

      // console.dir(beacon)

      clickedLocation = location.dataset.name;

      if (clickedLocation === locationToSelect) {
        hintBeacon.classList.remove("beacon")
        hintLocation = ""
        hintBeacon.style.left = ""
        hintBeacon.style.right = ""
        hintBeacon.style.top = ""
        hintBeacon.style.bottom = ""
        hintBeacon.style.x = ""
        hintBeacon.style.y = ""
        toggle = 1;
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

let keyCount = 0;
body.addEventListener("keyup", (e) => {
  if (e.key === "h") {
    keyCount++;
  } else {
    keyCount = 0;
  }

  if (keyCount === 5) {
    keyCount = 0;
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
      if (count !== 0)
        locationLabel.textContent = locationToSelect.toUpperCase();
    }

    locationLabel.textContent = "";
    gameStatus.style.display = "";
    gameStatus.classList.value = "notification is-success";
    gameStatus.textContent = "Great Job Cheating! You found all locations!";
  }
});

cheat.addEventListener("click", (e) => {
  count = count - 1;
  for (let location of map) {
    
    if (location.dataset.name === locationToSelect) {
      location.style.fill = "mediumseagreen";

    }
  }

  if (count === 0) {
    locationLabel.textContent = "";
    gameStatus.style.display = "";
    gameStatus.classList.value = "notification is-success";
    gameStatus.textContent = "Great Job Cheating! You found all locations!";
  } else {
    allLocations.splice(allLocations.indexOf(locationToSelect), 1);
    chosenLocationIdx = Math.floor(Math.random() * count);
    locationToSelect = allLocations[chosenLocationIdx];
    if (count !== 0) {
      locationLabel.textContent = locationToSelect.toUpperCase();
    }
  }

  if (!toggle) {
    hintBeacon.classList.remove("beacon")
    hintLocation = ""
    hintBeacon.style.left = ""
    hintBeacon.style.right = ""
    hintBeacon.style.top = ""
    hintBeacon.style.bottom = ""
    hintBeacon.style.x = ""
    hintBeacon.style.y = ""
    toggle = 1;
  }
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
  hint.disabled = true;
  cheat.disabled = true;
  mapSelect.value = "";

  if (mapSelected === "world") {
    const div = document.querySelector("#world");
    div.classList.remove("is-flex");
  }
  hintBeacon.classList.remove("beacon")
        hintLocation = ""
        hintBeacon.style.left = ""
        hintBeacon.style.right = ""
        hintBeacon.style.top = ""
        hintBeacon.style.bottom = ""
        hintBeacon.style.x = ""
        hintBeacon.style.y = ""
        
  
  hintBeacon.remove();
});
