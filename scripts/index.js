
function getRecipes() {
    return recipes;
  }

function displayData(recipes) {
  const recipesSection = document.querySelector(".recipes-section");
  const noRecipesMessage = document.querySelector(".no-recipes-message");
  const recipeCount = document.querySelector(".recipe-count");
  
  if (recipes.length === 0) {
    noRecipesMessage.textContent = `Aucune recette ne contient "${mainSearch.value}".`;
    recipesSection.innerHTML = "";
  } else {
    noRecipesMessage.textContent = "";
    recipesSection.innerHTML = "";
    recipes.forEach(recipe => {
      const recipesModel = recipesFactory(recipe);
      const recipeCardDOM = recipesModel.getRecipeCardDOM();
      recipesSection.appendChild(recipeCardDOM);
    });
    recipeCount.textContent = `${recipes.length} recettes`;
  }
}


function init() {
    const recipes = getRecipes();
    displayData(recipes);
    filterRecipes();
    displayFilters();
}

init();
