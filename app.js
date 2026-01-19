import { MEAL_API_URL } from "./config.js";
const getDataBtn = document.querySelector("#get-data-btn");
const inputField = document.querySelector("#inputField");
const container = document.getElementById("data-container");

getDataBtn.addEventListener("click", () => {
  const searchResult = inputField.value;
  const searchByName = `${MEAL_API_URL}${searchResult}`;
  fetch(searchByName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displayData(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

function displayData(data) {
  container.innerHTML = "";
  data.meals.forEach((item) => {
    const mealCard = document.createElement("div");
    mealCard.innerHTML = `
      <img src="${item.strMealThumb}" class="thumbnail">
       <h3> ${item.strMeal}</h3>
       <button>More info</button>
      `;
    container.appendChild(mealCard);
  });
}
