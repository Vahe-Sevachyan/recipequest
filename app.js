// import { MEAL_API_URL } from "./configs.js";
const MEAL_API_URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
const searchMealBtn = document.querySelector("#search-btn");
searchMealBtn.setAttribute("value", "Search Meal");
const inputField = document.querySelector("#inputField");
const container = document.getElementById("data-container");
const recipeModal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");
const ingredientListContainer = document.querySelector(".ingredient-container");
const measurementListContainer = document.querySelector(
  ".measurement-container",
);
const ingredientList = document.createElement("ul");
ingredientList.classList.add("ingredient-list");
const measurementList = document.createElement("ul");
measurementList.classList.add("measurement-list");
const instructionsContainer = document.querySelector(".instructions-container");
const cookingInstructionsListContainer = document.querySelector(
  ".cooking-instructions-list-container",
);
const instructionsButton = document.querySelector(".instructions-btn");
const iframeElement = document.createElement("iframe");

window.addEventListener('load',()=>{
  fetchMealData(`${MEAL_API_URL}chicken`)
})
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const searchResult = inputField.value;
    const searchMealByName = `${MEAL_API_URL}${searchResult}`;
    fetchMealData(searchMealByName);
  }
});

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
          console.log(data);
          displayIngredientList(mealIngredients);
          displayMeasurementList(mealMeasurments);
          DisplayCookingInstructions(meal);
          embedYouTubeVideo(meal.strYoutube);
        });

        showRecipeModal(); // 

        return;
      }
      displayMealData(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function showRecipeModal() {
  recipeModal.style.display = "block";
}

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
      clearModal();
      const recipeButtonValue = getRecipeBtn.value;
      retrieveRecipeData(item.strMeal, recipeButtonValue);
    });
  });
}

function displayIngredientList(ingredientListItem) {
  // console.log(ingredientList);
  ingredientListContainer.appendChild(ingredientList);
  ingredientListItem.forEach((ingredient) => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-item");
    listItem.innerHTML = ` ${ingredient}`;
    ingredientList.appendChild(listItem);
    // ingredientListContainer.innerHTML = `<li class ="list-item">${ingredient}</li>`;
  });
}

function displayMeasurementList(measurementsListItems) {
  console.log(measurementsListItems);
  measurementListContainer.appendChild(measurementList);
  measurementsListItems.forEach((measurement) => {
    if (measurement.trim().length > 0) {
      const listItem = document.createElement("li");
      listItem.classList.add("list-item");
      listItem.innerHTML = `${measurement}`;
      measurementList.appendChild(listItem);
      // measurementListContainer.innerHTML = `<li class = "list-item">${measurement}</li>`;
    }
  });
}

function CookingInstructionsBulleted(text) {
  const steps = text
    // normalize line breaks & spacing
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")

    // split on sentence endings NOT preceded by a number
    .split(/(?<!\d)[.!?]\s+/)

    // clean up
    .map((step) => step.trim())
    .filter(Boolean);

  return `<ul class="cooking-instructions-list">
${steps.map((step) => `  <li>${step}</li>`).join("\n")}
</ul>`;
}

function DisplayCookingInstructions(instructions) {
  const cookingInstructions = `${instructions.strInstructions}`;
  cookingInstructionsListContainer.innerHTML =
    CookingInstructionsBulleted(cookingInstructions);
  cookingInstructionsListContainer.style.display = "none";
}

instructionsButton.addEventListener("click", function () {
  // Check the current display style and toggle it
  if (cookingInstructionsListContainer.style.display === "none") {
    cookingInstructionsListContainer.style.display = "block"; // Show the element
    instructionsButton.innerHTML = "Hide Instructions";
  } else {
    cookingInstructionsListContainer.style.display = "none"; // Hide the element
    instructionsButton.innerHTML = "Show Instructions";
  }
});

closeModal.addEventListener("click", () => {
  recipeModal.style.display = "none";
  ingredientList.innerHTML = "";
  measurementList.innerHTML = "";
  instructionsContainer.innerHTML = "";
  mealIngredients = [];
  mealMeasurments = [];
});

function clearModal() {
  ingredientList.innerHTML = "";
  measurementList.innerHTML = "";
  iframeElement.innerHTML = "";
  mealIngredients = [];
  mealMeasurments = [];
  instructionsButton.innerHTML = "Show Instructions";
  cookingInstructionsListContainer.style.display = "none";
}

function embedYouTubeVideo(videoUrl) {
  // 1. Extract the video ID from the URL (standard YouTube URL format)
  const videoId = videoUrl.split("?v=")[1];
  if (!videoId) {
    console.error("Invalid YouTube URL format");
    return;
  }
  // 2. Construct the YouTube embed URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}`; // Use the embed URL
  // Create the <iframe> element

  iframeElement.setAttribute("width", "490");
  iframeElement.setAttribute("height", "250");
  iframeElement.setAttribute("src", embedUrl);
  iframeElement.setAttribute("frameborder", "0");
  iframeElement.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  );
  iframeElement.setAttribute("allowfullscreen", "");

  // Append to the container
  instructionsContainer.appendChild(iframeElement);
}
