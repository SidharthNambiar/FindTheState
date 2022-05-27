const mapSelect = document.querySelector("#mapSelect");
const maps = document.querySelectorAll(".maps");
const locationLabel = document.querySelector("#location");
const reset = document.querySelector("#reset");
const hint = document.querySelector("#hint");
const cheat = document.querySelector("#cheat");
const body = document.querySelector("body");
const hintBeacon = document.createElement("span");
const modal = document.querySelector(".modal");
const gameTimerLabel = document.querySelector("#timer");
const resultTag = document.createElement("span");
const locationTag = document.createElement("span");

let allLocations = [];
let clickedLocation = null;
let chosenLocationIdx = null;
let locationToSelect = "";
let numberOfLocations = null;
let clickedLocations = [];
let mapSelectedByUser = "usa";
let isBeaconOff = true;
let map = null;
let locationsWithWideStroke = [];
let strokeWidthVal = null;
let hintTimeoutId = null;
let gameTimerId = null;
let minuteLabel = 0;
let minuteCount = 0;
let secondLabel = 0;
let secondCount = 0;
let gameTimer = 0;
let keyCountLowC = 0;
let keyCountLowH = 0;
let keyCountLowL = 0;
let lastKnownScrollPosition = 0;
let ticking = false;
let innerWidth = window.innerWidth;
let middleWindow = innerWidth / 2;

// let mouseHoldIntervalId;
// let mouseholdCnt = 0;

reset.disabled = true;
hint.style.display = "none";
cheat.style.display = "none";

/*******************/
/*****Functions*****/
/*******************/

function placeItemOnLocation(location, item) {
  itemLocation = location.getBoundingClientRect();
  item.style.left = itemLocation.left + "px";
  item.style.top = itemLocation.top + "px";
}

function showHint() {
  hint.disabled = true;
  for (let location of map) {
    if (locationToSelect === location.dataset.name) {
      placeItemOnLocation(location, hintBeacon);
      hintBeacon.classList.add("beacon");
      isBeaconOff = false;

      hintTimeoutId = setTimeout(() => {
        hint.disabled = false;
        hintBeacon.classList.remove("beacon");
        hintBeacon.style.left = "";
        hintBeacon.style.top = "";

        hint.textContent = "HINT FOR " + locationToSelect.toUpperCase();
        isBeaconOff = true;
      }, 5000);
    }
  }
}

function gameplayInit() {
  hint.style.display = "";
  cheat.style.display = "";
  body.classList.remove("bg-img");
  reset.disabled = false;
  hint.disabled = false;
  cheat.disabled = false;
  locationLabel.textContent = "";
  gameTimerLabel.style.textContent = "";
  mapSelectedByUser = mapSelect.value;
  mapSelect.disabled = true;

  body.append(resultTag);
  body.append(hintBeacon);
  body.append(locationTag);

  //Only display the selected map; hide the others
  for (let map of maps) {
    if (map.id !== mapSelectedByUser) {
      map.style.display = "none";
    } else {
      map.style.display = "";
      map.classList.add(
        "is-flex",
        "is-flex-direction-row",
        "is-justify-content-center"
      );
    }
  }

  // querying all the paths(locations) within the selected map
  map = document.querySelectorAll(`#${mapSelectedByUser} path`);

  // extracting the names of all the locations and putting them in a an array called allLocations
  allLocations = [];

  for (let location of map) {
    allLocations.push(location.dataset.name);
    location.style.fill = "#EBDCC9";
    location.classList.add("js-modal-trigger");

    strokeWidthVal = parseFloat(location.style.strokeWidth);
    if (strokeWidthVal > 1) {
      locationsWithWideStroke.push(location.dataset.name);
      location.style.opacity = "0.5";
      location.style.stroke = "#EBDCC9";
    }

    location.style.cursor = "crosshair";
  }

  clickedLocation = null;
  chosenLocationIdx = Math.floor(Math.random() * allLocations.length - 1);
  locationToSelect = allLocations[chosenLocationIdx];

  locationLabel.textContent = locationToSelect.toUpperCase();
  hint.textContent = "HINT FOR " + locationToSelect.toUpperCase();

  locationLabel.style.color = "dark-grey";
  numberOfLocations = allLocations.length;
}

function setGameTimer() {
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
}

function mouseEnterConfig(location, e) {
  if (location.style.fill !== "mediumseagreen") {
    location.style.fill = "white";
  } else if (location.style.fill === "mediumseagreen") {
    locationTag.textContent = `${location.dataset.name}`;
    locationTag.classList.add("locationTag", "has-text-dark");
    if (e.x > middleWindow) {
      locationTag.style.left = e.x - locationTag.scrollWidth + "px";
    } else {
      locationTag.style.left = e.x + "px";
    }

    locationTag.style.top = e.y + "px";
  }

  if (locationsWithWideStroke.includes(location.dataset.name)) {
    location.style.opacity = "1";
  }
}

function mouseLeaveConfig(location, e) {
  if (location.style.fill !== "mediumseagreen") {
    location.style.fill = "#EBDCC9";
    if (locationsWithWideStroke.includes(location.dataset.name)) {
      location.style.opacity = "0.5";
    }
  } else if (location.style.fill === "mediumseagreen") {
    locationTag.style.left = null;
    locationTag.style.top = null;
    locationTag.textContent = "";
    locationTag.classList.remove("locationTag", "has-text-dark");
  }
}

function processMouseClickOnLoation(location, e) {
  clickedLocation = location.dataset.name;

  if (clickedLocation === locationToSelect) {
    if (locationsWithWideStroke.includes(clickedLocation)) {
      location.style.strokeWidth = String(strokeWidthVal / 5);
      locationsWithWideStroke.splice(
        locationsWithWideStroke.indexOf(location.dataset.name),
        1
      );
    }
    hintBeacon.classList.remove("beacon");
    clearTimeout(hintTimeoutId);
    resultTag.classList.remove("wrongTag", "has-text-white");
    // resultTag.textContent = "";

    hint.disabled = false;
    hintBeacon.style.left = "";
    hintBeacon.style.top = "";
    isBeaconOff = true;

    location.style.fill = "mediumseagreen";
    numberOfLocations = numberOfLocations - 1;

    if (numberOfLocations === 0) {
      hint.style.display = "none";
      cheat.style.display = "none";
      clearInterval(gameTimerId);
      reset.classList.add("is-focused");
      gameTimer = 0;
      modal.classList.add("is-active");
      hint.textContent = "HINT";
      hint.disabled = true;
      cheat.disabled = true;
      locationLabel.textContent = "";
    } else {
      allLocations.splice(chosenLocationIdx, 1);
      chosenLocationIdx = Math.floor(Math.random() * numberOfLocations);
      locationToSelect = allLocations[chosenLocationIdx];
      locationLabel.textContent = locationToSelect.toUpperCase();
      hint.textContent = "HINT FOR " + locationToSelect.toUpperCase();
    }

    resultTag.textContent = "PINPOINT " + locationToSelect.toUpperCase();
    resultTag.classList.add("rightTag", "is-white");

    if (e.x > middleWindow) {
      resultTag.style.left = e.x - resultTag.scrollWidth + "px";
    } else {
      resultTag.style.left = e.x + "px";
    }

    resultTag.style.top = e.y + "px";

    setTimeout(() => {
      resultTag.classList.remove("rightTag", "is-white");
      resultTag.textContent = "";
    }, 1000);
  } else {
    if (location.style.fill !== "mediumseagreen") {
      resultTag.classList.remove("rightTag", "is-white");

      resultTag.textContent = "NOT " + locationToSelect.toUpperCase() + "!";
      resultTag.classList.add("wrongTag", "has-text-white");

      if (e.x > middleWindow) {
        resultTag.style.left = e.x - resultTag.scrollWidth + "px";
      } else {
        resultTag.style.left = e.x + "px";
      }

      resultTag.style.top = e.y + "px";

      setTimeout(() => {
        resultTag.classList.remove("wrongTag", "has-text-white");
        resultTag.textContent = "";
      }, 1000);
    }
  }
}

function resetGame() {
  hint.style.display = "none";
  cheat.style.display = "none";
  clearInterval(gameTimerId);
  clearTimeout(hintTimeoutId);
  hint.textContent = "HINT";
  minuteCount = 0;
  secondCount = 0;
  gameTimer = 0;
  gameTimerLabel.textContent = "";
  allLocations = allLocations.slice();
  clickedLocation = null;
  clickedLocations = [];

  locationLabel.textContent = "";

  for (let location of map) {
    location.style.fill = "#EBDCC9";
    if (locationsWithWideStroke.includes(location.dataset.name)) {
      strokeWidth = parseFloat(location.style.strokeWidth);
      location.style.strokeWidth = String(strokeWidth + 5);
    }
  }
  mapSelect.disabled = false;

  for (let map of maps) {
    map.classList.remove("is-flex");
    map.style.display = "none";
  }
  reset.disabled = true;
  hint.disabled = false;
  cheat.disabled = false;
  mapSelect.value = "";

  hintBeacon.classList.remove("beacon");
  hintBeacon.style.left = "";
  hintBeacon.style.top = "";
  isBeaconOff = true;

  mapSelect.classList.add("is-focused");
  body.classList.add("bg-img");
  locationsWithWideStroke = [];
}

hint.addEventListener("click", (e) => {
  showHint();
});

function processKeyboardEventKeyUp(e) {
  if (
    e.key === "h" &&
    !Object.values(modal.classList).includes("is-active") &&
    !cheat.disabled &&
    !hint.disabled
  ) {
    keyCountLowH++;
  } else {
    keyCountLowH = 0;
  }

  if (keyCountLowH === 3) {
    showHint();
    hint.disabled = true;
    keyCountLowH = 0;
  }

  if (
    e.key === "c" &&
    !Object.values(modal.classList).includes("is-active") &&
    !cheat.disabled &&
    !hint.disabled
  ) {
    keyCountLowC++;
  } else {
    keyCountLowC = 0;
  }

  if (keyCountLowC === 3 && !hint.disabled) {
    hint.style.display = "none";
    cheat.style.display = "none";
    keyCountLowC = 0;
    hint.textContent = "HINT";
    hint.disabled = false;
    cheat.disabled = false;
    clearInterval(gameTimerId);
    gameTimer = 0;
    hintBeacon.classList.remove("beacon");
    hintBeacon.style.left = "";
    hintBeacon.style.top = "";
    isBeaconOff = true;

    while (numberOfLocations !== 0) {
      for (let location of map) {
        if (location.dataset.name === locationToSelect) {
          location.style.fill = "mediumseagreen";
        }
        if (locationsWithWideStroke.includes(location.dataset.name)) {
          location.style.strokeWidth = String(strokeWidthVal / 5);
        }
      }
      numberOfLocations = numberOfLocations - 1;
      allLocations.splice(allLocations.indexOf(locationToSelect), 1);
      chosenLocationIdx = Math.floor(Math.random() * numberOfLocations);
      locationToSelect = allLocations[chosenLocationIdx];
      if (numberOfLocations !== 0)
        locationLabel.textContent = locationToSelect.toUpperCase();
    }
    modal.classList.add("is-active");

    locationLabel.textContent = "";
    reset.classList.add("is-focused");
  }
}

function findLocation(e) {
  e.stopPropagation();
  clearTimeout(hintTimeoutId);
  hint.disabled = false;

  numberOfLocations = numberOfLocations - 1;
  for (let location of map) {
    if (location.dataset.name === locationToSelect) {
      location.style.fill = "mediumseagreen";
    }
  
  }

  if (numberOfLocations === 0) {
    clearInterval(gameTimerId);
    hint.textContent = "HINT";
    gameTimer = 0;
    cheat.disabled = false;
    hint.disabled = false;
    locationLabel.textContent = "";
    modal.classList.add("is-active");
    reset.classList.add("is-focused");
    hint.style.display = "none";
    cheat.style.display = "none";
    hintBeacon.classList.remove("beacon");
    hintBeacon.style.left = "";
    hintBeacon.style.top = "";
    isBeaconOff = true;
    
  } else {
    allLocations.splice(allLocations.indexOf(locationToSelect), 1);
    chosenLocationIdx = Math.floor(Math.random() * numberOfLocations);
    locationToSelect = allLocations[chosenLocationIdx];
    if (numberOfLocations !== 0) {
      locationLabel.textContent = locationToSelect.toUpperCase();
      hint.textContent = "HINT FOR " + locationToSelect.toUpperCase();
    }
  }

  if (!isBeaconOff) {
    hintBeacon.classList.remove("beacon");
    hintBeacon.style.left = "";
    hintBeacon.style.top = "";
    isBeaconOff = true;
  }
}

function resetHintAtScroll(scrollPos) {
  if (hint.disabled) {
    clearTimeout(hintTimeoutId);
    hint.disabled = false;
    hintBeacon.classList.remove("beacon");
    hintBeacon.style.left = "";
    hintBeacon.style.top = "";

    hint.textContent = "HINT FOR " + locationToSelect.toUpperCase();
    isBeaconOff = true;
    showHint();
  }
}

function removeModal() {
  if (Object.values(modal.classList).includes("is-active")) {
    modal.classList.remove("is-active");
  }
}

/******************/
/**Event Listeners*/
/******************/

mapSelect.addEventListener("change", (e) => {
  gameplayInit();
  setGameTimer();

  for (let location of map) {
    location.addEventListener("mouseenter", (e) => {
      mouseEnterConfig(location, e);
    });

    location.addEventListener("mouseleave", (e) => {
      mouseLeaveConfig(location, e);
    });

    location.addEventListener("click", (e) => {
      e.stopPropagation();
      processMouseClickOnLoation(location, e);
      console.log(location.dataset.name)
    });
  }
});

body.addEventListener("keyup", (e) => {
  processKeyboardEventKeyUp(e);
});

body.addEventListener("click", (e) => {
  removeModal(e);
});

cheat.addEventListener("click", (e) => {
  findLocation(e);
});

reset.addEventListener("click", (e) => {
  resetGame(e);
});

document.addEventListener("scroll", function (e) {
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function () {
      resetHintAtScroll(lastKnownScrollPosition);
      ticking = false;
    });

    ticking = true;
  }
});

// body.addEventListener("mousedown", (e) => {

//   locationTag.style.left = e.x +"px" ;
//   locationTag.style.top = e.y + "px";

//   mouseHoldIntervalId = setInterval(() => {
//     // mouseholdCnt++;
//     // // if (mouseholdCnt >= 3)

//     locationTag.textContent = `${locationToSelect}`;
//     locationTag.classList.add("locationTag", "has-text-dark");
//     body.append(locationTag);

//   }, 1000);

//   body.addEventListener("mouseup", (e) => {
//     clearInterval(mouseHoldIntervalId);
//     mouseholdCnt = 0;
//     locationTag.textContent = ``;
//     locationTag.classList.remove("locationTag","has-text-dark");

//   });
// });

// let originalOffsetTopHintButton = hint.offsetTop + 'px';
// let originalOffsetTopCheatButton = cheat.offsetTop + 'px';

// visualViewport.addEventListener('resize', function(e) {
//   /* ... */

//   if (e.target.offsetTop === 0) {
//     hint.style.top = originalOffsetTopHintButton;
//     cheat.style.top = originalOffsetTopCheatButton
//   }
//   else {
//     hint.style.top = e.target.offsetTop + 'px';
//     hint.style.left = e.target.offsetLeft + 'px'
//     hint.style.right = e.target.offsetRight +'px'

//     cheat.style.top = e.target.offsetTop + 'px';
//   }

// });

// setInterval((e) => {
//   // console.log(cheat.disabled)
//   if (cheat.style.display !== "none") {
//     findLocation()
//   }
// }, 500);

// let scrollTop = 0;
// document.addEventListener("scroll", (e) => {

// })
