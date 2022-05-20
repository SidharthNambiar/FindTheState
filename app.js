const mapSelect = document.querySelector("#mapSelect");
const maps = document.querySelectorAll(".maps");
const locationLabel = document.querySelector("#location");
// const gameStatus = document.querySelector("#status");
const reset = document.querySelector("#reset");
const hint = document.querySelector("#hint");
const cheat = document.querySelector("#cheat");
const body = document.querySelector("body");
const hintBeacon = document.createElement("span");
const modal = document.querySelector(".modal");
const gameTimerLabel = document.querySelector("#timer");
const wrongTag = document.createElement("span");

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

// gameStatus.style.display = "none";

reset.disabled = true;
hint.disabled = true;
cheat.disabled = true;

let timerCnt = 5;
let timerIntervalId = null;
let timeoutId = null;

let gameTimerId = null;

// let mouseHoldIntervalId;
// let mouseholdCnt = 0;

// body.addEventListener("mousedown", (e) => {
//   mouseHoldIntervalId = setInterval(() => {
//     mouseholdCnt++;
//     if (mouseholdCnt >= 3) showHint();
//   }, 1000);

//   body.addEventListener("mouseup", (e) => {
//     clearInterval(mouseHoldIntervalId);
//     mouseholdCnt = 0;
//   });
// });

function placeItemOnLocation(location, item) {
  itemLocation = location.getBoundingClientRect();
  item.style.left = itemLocation.left + "px";
  item.style.right = itemLocation.right + "px";
  item.style.top = itemLocation.top + "px";
  item.style.bottom = itemLocation.bottom + "px";
  item.style.x = itemLocation.x + "px";
  item.style.y = itemLocation.y + "px";
}

function showHint() {
  hint.disabled = true;

  for (let location of map) {
    if (locationToSelect === location.dataset.name) {
      placeItemOnLocation(location, hintBeacon);

      hintBeacon.classList.add("beacon");

      hint.textContent = `HINT COUNTDOWN: ${timerCnt}`;
      timerCnt--;
      toggle = 0;

      body.append(hintBeacon);

      timeoutId = setTimeout(() => {
        hint.disabled = false;
        hintBeacon.classList.remove("beacon");
        hintLocation = "";
        hintBeacon.style.left = "";
        hintBeacon.style.right = "";
        hintBeacon.style.top = "";
        hintBeacon.style.bottom = "";
        hintBeacon.style.x = "";
        hintBeacon.style.y = "";

      //  gameStatus.style.display = "none";
        clearInterval(timerIntervalId);
        hint.textContent = "HINT ( " + locationToSelect.toUpperCase() + " )";
        timerCnt = 5;
        toggle = 1;
      }, 5000);

      timerIntervalId = setInterval(() => {
      
        hint.textContent = `HINT COUNTDOWN: ${timerCnt}`;

        timerCnt--;
      }, 1000);
    }
  }
}

hint.addEventListener("click", (e) => {
  showHint();
});

let minuteLabel = 0;
let minuteCount = 0;
let secondLabel = 0;
let secondCount = 0;

let gameTimer = 0;

mapSelect.addEventListener("change", (e) => {
  body.classList.remove("bg-img");
  gameTimerLabel.textContent = "00:00";
  gameTimerId = setInterval(() => {
    gameTimer++;
    secondCount++;

    if (secondCount === 60) {
      minuteCount++;
      secondCount = 0;
    }

    if (secondCount < 10) {
      secondLabel = `0${secondCount}`;
    } else {
      secondLabel = `${secondCount}`;
    }

    if (minuteCount < 10) {
      minuteLabel = `0${minuteCount}`;
    } else {
      minuteLabel = `${minuteCount}`;
    }

    gameTimerLabel.textContent = `${minuteLabel}:${secondLabel}`;
  }, 1000);

  reset.disabled = false;
  hint.disabled = false;
  cheat.disabled = false;
  locationLabel.textContent = "";
  gameTimerLabel.style.textContent = "";
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
    location.classList.add("js-modal-trigger");
   
  }

  clickedLocation = null;
  chosenLocationIdx = Math.floor(Math.random() * allLocations.length - 1);
  locationToSelect = allLocations[chosenLocationIdx];

  locationLabel.textContent = locationToSelect.toUpperCase();
  hint.textContent = "HINT ( " + locationToSelect.toUpperCase() + " )";
  // gameStatus.style.display = "none";

  locationLabel.style.color = "dark-grey";
  count = allLocations.length;

  for (let location of map) {
    location.addEventListener("click", (e) => {
      e.stopPropagation();

      clickedLocation = location.dataset.name;

      if (clickedLocation === locationToSelect) {
        hintBeacon.classList.remove("beacon");
        clearInterval(timerIntervalId);
        clearTimeout(timeoutId);
        wrongTag.classList.remove("wrongTag");
        wrongTag.textContent = "";

        hint.disabled = false;
        timerCnt = 5;
        hintLocation = "";
        hintBeacon.style.left = "";
        hintBeacon.style.right = "";
        hintBeacon.style.top = "";
        hintBeacon.style.bottom = "";
        hintBeacon.style.x = "";
        hintBeacon.style.y = "";
        toggle = 1;
        // gameStatus.style.display = "none";
        // if (clickedLocations.length !== 0) {
        //   for (let location of clickedLocations) {
        //     if (location.style.fill === "rgb(255, 224, 138)") {
        //       location.style.fill = "white";
        //     }
        //   }
        //   clickedLocations = [];
        // }
        location.style.fill = "mediumseagreen";
        count = count - 1;

        if (count === 0) {
          clearInterval(gameTimerId);
          reset.classList.add("is-focused");
          gameTimer = 0;
          modal.classList.add("is-active");
          // hint.disabled && cheat.disabled;
          hint.textContent = "HINT";
          hint.disabled = true;
          cheat.disabled = true;
          locationLabel.textContent = "";
          // gameStatus.style.display = "none";

         
        } else {
          allLocations.splice(chosenLocationIdx, 1);
          chosenLocationIdx = Math.floor(Math.random() * count);
          locationToSelect = allLocations[chosenLocationIdx];
          locationLabel.textContent = locationToSelect.toUpperCase();
          hint.textContent = "HINT ( " + locationToSelect.toUpperCase() + " )";
        }
      } else {
        if (location.style.fill !== "mediumseagreen") {
          placeItemOnLocation(location, wrongTag);
          wrongTag.textContent = "WRONG!";
          wrongTag.classList.add("wrongTag", "has-text-dark");
          body.append(wrongTag);
          setTimeout(() => {
            wrongTag.classList.remove("wrongTag");
            wrongTag.textContent = "";
          }, 1000);
          //   // location.style.fill = "#ffe08a";
          //   // gameStatus.style.display = "";
          //   // gameStatus.classList.value = "notification is-warning";
          //   // gameStatus.textContent = `Incorrect! You selected ${location.dataset.name.toUpperCase()}. Try Again`;
          //   clickedLocations.push(location);
        }
      }
    });
  }
});

let keyCount = 0;
body.addEventListener("keyup", (e) => {
  if (
    e.key === "h" &&
    !Object.values(modal.classList).includes("is-active") &&
    !cheat.disabled &&
    !hint.disabled
  ) {
    keyCount++;
  } else {
    keyCount = 0;
  }

  if (keyCount === 5 && !hint.disabled) {
    keyCount = 0;
    hint.textContent = "HINT";
    hint.disabled = true;
    cheat.disabled = true;
    clearInterval(timerIntervalId);
    clearInterval(gameTimerId);
    gameTimer = 0;
    // clearTimeout(timeoutId)
    timerCnt = 5;

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
    modal.classList.add("is-active");

    locationLabel.textContent = "";
    // gameStatus.style.display = "none";
    reset.classList.add("is-focused");
   
  }
});

body.addEventListener("click", (e) => {
  if (Object.values(modal.classList).includes("is-active")) {
    modal.classList.remove("is-active");
  }
});

cheat.addEventListener("click", (e) => {
  e.stopPropagation();
  // gameStatus.style.display = "none";
  clearInterval(timerIntervalId);
  clearTimeout(timeoutId);
  hint.disabled = false;
  timerCnt = 5;

  count = count - 1;
  for (let location of map) {
    if (location.dataset.name === locationToSelect) {
      location.style.fill = "mediumseagreen";
    }
    if (location.style.fill === "rgb(255, 224, 138)") {
      location.style.fill = "white";
    }
  }

  if (count === 0) {
    clearInterval(gameTimerId);
    hint.textContent = "HINT";
    gameTimer = 0;
    cheat.disabled = true;
    hint.disabled = true;
    locationLabel.textContent = "";
    // gameStatus.style.display = "none";
    modal.classList.add("is-active");
    reset.classList.add("is-focused");

  } else {
    allLocations.splice(allLocations.indexOf(locationToSelect), 1);
    chosenLocationIdx = Math.floor(Math.random() * count);
    locationToSelect = allLocations[chosenLocationIdx];
    if (count !== 0) {
      locationLabel.textContent = locationToSelect.toUpperCase();
      hint.textContent = "HINT ( " + locationToSelect.toUpperCase() + " )";
    }
  }

  if (!toggle) {
    hintBeacon.classList.remove("beacon");
    hintLocation = "";
    hintBeacon.style.left = "";
    hintBeacon.style.right = "";
    hintBeacon.style.top = "";
    hintBeacon.style.bottom = "";
    hintBeacon.style.x = "";
    hintBeacon.style.y = "";
    toggle = 1;
  }
});

reset.addEventListener("click", (e) => {
  clearInterval(gameTimerId);
  clearInterval(timerIntervalId);
  clearTimeout(timeoutId);
  hint.textContent = "HINT";
  minuteCount = 0;
  secondCount = 0;
  gameTimer = 0;
  gameTimerLabel.textContent = "";
  allLocations = allLocations.slice();
  clickedLocation = null;
  clickedLocations = [];

  locationLabel.textContent = "";
  // gameStatus.textContent = "";
  // gameStatus.style.display = "none";

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
  hintBeacon.classList.remove("beacon");
  hintLocation = "";
  hintBeacon.style.left = "";
  hintBeacon.style.right = "";
  hintBeacon.style.top = "";
  hintBeacon.style.bottom = "";
  hintBeacon.style.x = "";
  hintBeacon.style.y = "";

  hintBeacon.remove();

  mapSelect.classList.add("is-focused");
  body.classList.add("bg-img");
});
