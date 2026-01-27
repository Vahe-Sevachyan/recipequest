import { MEAL_API_URL } from "./config.js";
const searchMealBtn = document.querySelector("#search-btn");
searchMealBtn.setAttribute("value", "Search Meal");
const inputField = document.querySelector("#inputField");
const container = document.getElementById("data-container");
const recipeModal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");
const ingredientListContainer = document.querySelector(".ingredients-list");
const measurementListContainer = document.querySelector(".measurements-list");

searchMealBtn.addEventListener("click", () => {
  const searchResult = inputField.value;
  const searchMealByName = `${MEAL_API_URL}${searchResult}`;
  fetchMealData(searchMealByName);
});

function retrieveRecipeData(mealName, buttonValue) {
  const searchMealByName = `${MEAL_API_URL}${mealName}`;
  fetchMealData(searchMealByName, buttonValue);
}

let mealIngredients = [];
let mealMeasurments = [];

// displayRecipeData(ingredientMeasurmentsCombined);

function fetchMealData(searchByMealName, buttonValue) {
  fetch(searchByMealName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //checks if get recipe button is clicked, otherwise skips to showRecipeModal() function below and executes a new meal search query
      if (buttonValue === "Get Recipe") {
        data.meals.forEach((meal) => {
          //checks the object keys that contain "strIngredient" and returns values of only the ones that arent a empty string
          Object.entries(meal)
            .filter(([key, value]) => key.includes("strIngredient")) // checks if the object key is equal to "strIngredient"
            .map(([key, value]) => {
              if (value) {
                mealIngredients.push(value);
                //if the object key that contains "strIngredient" does not have a empty string it adds the value
              }
            });
          Object.entries(meal)
            .filter(([key, value]) => key.includes("strMeasure")) // checks if the object key is equal to "strMeasure"
            .map(([key, value]) => {
              if (value) {
                console.log(value);
                mealMeasurments.push(value);
                //if the object key that contains "strMeasure" does not have a empty string it adds the value
              }
            });
          // console.log(ingredientMeasurmentsCombined);
          // console.log(data);
          displayIngredientList(mealIngredients);
          displayMeasurentList(mealMeasurments);
        });
        showRecipeModal(); // opens recipe modal diplay
        return;
      }
      displayMealData(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
// const ingredientMeasurmentsCombined = mealIngredients.map((meal, index) => {
//   return meal + " " + mealMeasurments[index];
// });
function showRecipeModal() {
  recipeModal.style.display = "block";
}

closeModal.addEventListener("click", () => {
  recipeModal.style.display = "none";
  ingredientListContainer.innerHTML = "";
  measurementListContainer.innerHTML = "";
  mealIngredients = [];
  mealMeasurments = [];
});

function displayMealData(data) {
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
       <span class='meal-name'> <strong>${item.strMeal}</strong></span>
       <span class='category-name'><strong>Category:</strong> ${item.strCategory}</span>
       <span class='area-name'> <strong>Origin:</strong> ${item.strArea}</span>
      `;
    mealCard.appendChild(getRecipeBtn);
    container.appendChild(mealCard);
    getRecipeBtn.addEventListener("click", () => {
      const recipeButtonValue = getRecipeBtn.value;
      retrieveRecipeData(item.strMeal, recipeButtonValue);
    });
  });
}

function displayIngredientList(ingredientList) {
  console.log(ingredientList);
  ingredientList.forEach((ingredient) => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-item");
    listItem.innerHTML = ` ${ingredient}`;
    ingredientListContainer.appendChild(listItem);
  });
}

function displayMeasurentList(measurementsList) {
  console.log(measurementsList);

  measurementsList.forEach((measurement) => {
    if (measurement.trim().length > 0) {
      const listItem = document.createElement("li");
      listItem.classList.add("list-item");
      listItem.innerHTML = `${measurement}`;
      measurementListContainer.appendChild(listItem);
    }
  });
}
