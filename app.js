import { MEAL_API_URL } from "./config.js";
const searchMealBtn = document.querySelector("#get-data-btn");
const inputField = document.querySelector("#inputField");
const container = document.getElementById("data-container");

searchMealBtn.addEventListener("click", () => {
  const searchResult = inputField.value;
  const searchMealByName = `${MEAL_API_URL}${searchResult}`;
  fetchMealData(searchMealByName);
});

function retrieveRecipeData(mealName) {
  const searchMealByName = `${MEAL_API_URL}${mealName}`;
  fetchMealData(searchMealByName);
}

function fetchMealData(searchByName) {
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
}
function displayData(data) {
  container.innerHTML = "";
  data.meals.forEach((item) => {
    const getRecipeBtn = document.createElement("button");
    getRecipeBtn.classList.add("recipe-btn");
    getRecipeBtn.innerHTML = "Get Recipe";
    const mealCard = document.createElement("div");
    mealCard.classList.add("meal-card");
    mealCard.innerHTML = `
      <img src="${item.strMealThumb}" class="meal-img">
       <span class='meal-name'> ${item.strMeal}</span>
       <span class='category-name'>Category: ${item.strCategory}</span>
       <span class='area-name'>Origin: ${item.strArea}</span>
      `;
    mealCard.appendChild(getRecipeBtn);
    container.appendChild(mealCard);
    getRecipeBtn.addEventListener("click", () => {
      // getRecipeData();
      retrieveRecipeData(item.strMeal);
    });
  });
}

// function getRecipeData() {
//   window.open("https://www.google.com/?zx=1768256797711&no_sw_cr=1", "_blank");
// }
