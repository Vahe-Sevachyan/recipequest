import { MEAL_API_URL } from "./config.js";
const searchMealBtn = document.querySelector("#get-data-btn");
searchMealBtn.setAttribute("value", "Search Meal");
const inputField = document.querySelector("#inputField");
const container = document.getElementById("data-container");

searchMealBtn.addEventListener("click", () => {
  const searchResult = inputField.value;
  const searchMealByName = `${MEAL_API_URL}${searchResult}`;
  fetchMealData(searchMealByName);
});

function retrieveRecipeData(mealName, buttonValue) {
  const searchMealByName = `${MEAL_API_URL}${mealName}`;
  fetchMealData(searchMealByName, buttonValue);
}

function fetchMealData(searchByName, buttonValue, searchMealBtn) {
  fetch(searchByName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (buttonValue === "Get Recipe") {
        console.log("Clicked");
        // get recipe data function will go here
        return;
      }
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
    getRecipeBtn.setAttribute("value", "Get Recipe");
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
      const recipeButtonValue = getRecipeBtn.value;
      retrieveRecipeData(item.strMeal, recipeButtonValue);
    });
  });
}

// function getRecipeData() {
//   window.open("https://www.google.com/?zx=1768256797711&no_sw_cr=1", "_blank");
// }
