// Cette fonction renvoie la liste des recettes (stockées dans la variable globale "recipes").
function getRecipes() {
  return recipes;
}

// Cette fonction affiche les données des recettes dans l'interface utilisateur.
function displayData(recipes) {
  // Sélectionnez des éléments HTML en fonction de leurs classes.
  const recipesSection = document.querySelector(".recipes-section");
  const noRecipesMessage = document.querySelector(".no-recipes-message");
  const recipeCount = document.querySelector(".recipe-count");
  
  // Vérifiez s'il y a des recettes à afficher.
  if (recipes.length === 0) {
    // S'il n'y a pas de recettes, affichez un message approprié et videz la section des recettes.
    noRecipesMessage.textContent = `Aucune recette ne contient "${mainSearch.value}".`;
    recipesSection.innerHTML = "";
  } else {
    // S'il y a des recettes, supprimez le message précédent (s'il y en avait un) et ajoutez chaque recette à la section des recettes.
    noRecipesMessage.textContent = "";
    recipesSection.innerHTML = "";
    recipes.forEach(recipe => {
      // Pour chaque recette, créez un modèle de recette à partir de la fonction "recipesFactory".
      const recipesModel = recipesFactory(recipe);
      // Récupérez le DOM de la carte de recette à partir du modèle.
      const recipeCardDOM = recipesModel.getRecipeCardDOM();
      // Ajoutez la carte de recette au conteneur de la section des recettes.
      recipesSection.appendChild(recipeCardDOM);
    });
    // Affichez le nombre total de recettes.
    recipeCount.textContent = `${recipes.length} recettes`;
  }
}

// Cette fonction est appelée lors de l'initialisation de la page.
function init() {
  // Obtenez la liste des recettes.
  const recipes = getRecipes();
  // Affichez les données des recettes.
  displayData(recipes);
  // Filtrez les recettes en fonction des filtres .
  filterRecipes();
  // Affichez les filtres dans l'interface utilisateur .
  displayFilters();
}

// Appelez la fonction d'initialisation pour démarrer l'application.
init();
