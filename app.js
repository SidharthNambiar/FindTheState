const countrySelect = document.querySelector("#countrySelect");
const countries = document.querySelectorAll(".countries");
const stateLabel = document.querySelector("#state");
const gameStatus = document.querySelector("#status");
const reset = document.querySelector("button");
let allStates = [];
let statesToSelect = [];
let clickedState = null;
let chosenStateIdx = null;
let stateToSelect = null;
let count = null;
let clickedStates = [];
let countrySelected = "usa";
let map = document.querySelectorAll(`#${countrySelected} path`);
gameStatus.style.display = "none";

reset.disabled = true;

countrySelect.addEventListener("change", (e) => {
  reset.disabled = false;
  stateLabel.textContent = "";
  countrySelected = countrySelect.value;
  countrySelect.disabled = true;

  for (let country of countries) {
    if (country.id !== countrySelected) {
      country.hidden = true;
    } else {
      country.hidden = false;
    }
  }
  map = document.querySelectorAll(`#${countrySelected} path`);
  allStates = [];
  for (let state of map) {
    allStates.push(state.dataset.name);
    state.style.fill = "white";
  }
  console.log(allStates.length);
  statesToSelect = allStates.slice();
  clickedState = null;
  chosenStateIdx = Math.floor(Math.random() * allStates.length - 1);
  stateToSelect = allStates[chosenStateIdx];
  stateLabel.textContent = stateToSelect.toUpperCase();
  gameStatus.style.display = "none";

  stateLabel.style.color = "dark-grey";
  count = allStates.length;

  for (let state of map) {
    allStates.push(state.dataset.name);
    state.style.fill = "white";
  }

  for (let state of map) {
    state.addEventListener("click", (e) => {
      clickedState = state.dataset.name;

      if (clickedState === stateToSelect) {
        gameStatus.style.display = "none";

        for (let state of clickedStates) {
          state.style.fill = "white";
        }
        clickedStates = [];
        state.style.fill = "mediumseagreen";
        count = count - 1;
        if (count === 0) {
          stateLabel.textContent = "";
          gameStatus.style.display = "";

          gameStatus.classList.value = "notification is-success";
          gameStatus.textContent = "Great Job! You found all locations!";
        } else {
          statesToSelect.splice(chosenStateIdx, 1);
          chosenStateIdx = Math.floor(Math.random() * count);
          stateToSelect = statesToSelect[chosenStateIdx];
          stateLabel.textContent = stateToSelect.toUpperCase();
        }
      } else {
        if (state.style.fill !== "mediumseagreen") {
          state.style.fill = "#ffe08a";
          gameStatus.style.display = "";

          gameStatus.textContent = "Incorrect! Try Again.";
          clickedStates.push(state);
        }
      }
    });
  }
});

reset.addEventListener("click", (e) => {
  statesToSelect = allStates.slice();
  clickedState = null;
  clickedStates = [];

  stateLabel.textContent = "";
  gameStatus.textContent = "";
  gameStatus.style.display = "none";

  for (let state of map) {
    state.style.fill = "white";
  }
  countrySelect.disabled = false;
  for (let country of countries) {
    country.hidden = true;
  }
  reset.disabled = true;
  countrySelect.value = "";
});
