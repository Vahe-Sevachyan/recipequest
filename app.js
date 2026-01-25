import { MEAL_API_URL } from "./config.js";
const searchMealBtn = document.querySelector("#get-data-btn");
searchMealBtn.setAttribute("value", "Search Meal");
const inputField = document.querySelector("#inputField");
const container = document.getElementById("data-container");
const showModal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");

searchMealBtn.addEventListener("click", () => {
  const searchResult = inputField.value;
  const searchMealByName = `${MEAL_API_URL}${searchResult}`;
  fetchMealData(searchMealByName);
});

function retrieveRecipeData(mealName, buttonValue) {
  const searchMealByName = `${MEAL_API_URL}${mealName}`;
  fetchMealData(searchMealByName, buttonValue);
}

// const ingredientObjectKeys = "strIngredient";

function fetchMealData(searchByMealName, buttonValue, searchMealBtn) {
  fetch(searchByMealName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //checks if get recipe button is clicked, if not line 48 is executed and new meal search is queried
      if (buttonValue === "Get Recipe") {
        data.meals.forEach((meal) => {
          //checks the object keys that contain "strIngredient" and returns values of only the ones that arent a empty string
          Object.entries(meal)
            .filter(([key, value]) => key.includes("strIngredient")) // checks if the object key is equal to "strIngredient"
            .map(([key, value]) => {
              if (value) {
                //if the object key that contains "strIngredient" is not a empty string it returns the value
                console.log(value);
                // display recipe data function will go here
              }
            });
        });
        showRecipeInfo(); // opens recipe modal diplay
        return;
      }
      displayMealData(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function showRecipeInfo() {
  showModal.style.display = "block";
}

closeModal.addEventListener("click", () => {
  showModal.style.display = "none";
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
  console.log(data);
}
// const activeIngredients = Object.keys(meal).filter((key) =>
//   key.includes(ingredientKeys),
// );
// const activeIngredients2 = Object.entries(meal);
// const activeIngredients2 = Object.entries(meal).filter((item) =>
//   console.log(item),
// );
// check if object keys are empty or not
// console.log(resultEntries);
// function getRecipeData() {
//   window.open("https://www.google.com/?zx=1768256797711&no_sw_cr=1", "_blank");
// }
// data.forEach((item) => {
//   console.log(item);
//   const recipeContainer = ducument.createElement("div");
//   recipeContainer.classList.add("recipe-container");
//   const recipeList = document.createElement("ul");
//   recipeList = classlist.add("recipe-list");
//   const ingredients = data.filter((ingredient) => {
//     if(ingredient){}
//   })
//   recipeList.innerHTML = `

//     `;
// });

// const resultEntries = Object.entries(meal)
//   .filter(([key, value]) => key.includes(ingredientKeys))
//   .map(([key, value]) => {
//     if (value) {
//       console.log(value);
//     }
//   });
// });
