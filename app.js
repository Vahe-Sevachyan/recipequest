import { MEAL_API_URL } from "./config.js";
const getDataBtn = document.querySelector("#get-data-btn");
const inputField = document.querySelector("#inputField");
const container = document.getElementById("data-container");
const getRecipeBtn = document.querySelector(".recipe-btn");

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
    getRecipeBtn.addEventListener("click", () => {
      getRecipeData();
    });
    mealCard.appendChild(getRecipeBtn);
    container.appendChild(mealCard);
  });
}
function getRecipeData() {
  console.log("clicked");
}
