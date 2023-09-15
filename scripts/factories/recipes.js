/* Cette fonction "recipesFactory" prend un objet de données "data" 
(représentant une recette) en entrée et retourne un objet avec une 
méthode "getRecipeCardDOM" qui génère le DOM d'une carte de recette.
*/
function recipesFactory(data) {
    // Destructurer l'objet de données "data" pour extraire les propriétés nécessaires.
    const { id, image, name, servings, ingredients, time, description, appliance, ustensils } = data;
    const parsedIngredients = [];
  
    // Convertir les ingrédients en un format plus lisible.
    for (let i = 0; i < ingredients.length; i++) {
      const { ingredient, quantity, unit } = ingredients[i];
      parsedIngredients.push({ ingredient, quantity, unit });
    }
  
    // Créer le chemin d'accès à l'image de la recette.
    const images = `assets/recipes/${image} `;
  
    // Définir la méthode "getRecipeCardDOM".
    function getRecipeCardDOM() {
      // Créer un élément "article" pour représenter la carte de recette.
      const article = document.createElement("article");
      article.setAttribute("id", id);
      article.className = "recipe-article";
  
      // Créer un élément "img" pour afficher l'image de la recette.
      const img = document.createElement("img");
      img.dataset.id = id;
      img.className = "recipe-image";
      img.setAttribute("src", images);
      img.setAttribute("alt", name);
      article.appendChild(img);
  
      // Créer un élément "div" pour afficher les informations de la recette.
      const recipeInfo = document.createElement("div");
      recipeInfo.className = "recipe-info";
      article.appendChild(recipeInfo);
  
      // Créer un élément "h2" pour afficher le nom de la recette.
      const recipeName = document.createElement("h2");
      recipeName.textContent = name;
      recipeInfo.appendChild(recipeName);
  
      // Créer un élément "p" pour afficher le temps de préparation de la recette.
      const recipeTime = document.createElement("p");
      recipeTime.textContent = time + "min";
      recipeTime.className = "recipe-time";
      article.appendChild(recipeTime);
  
      // Créer un élément "div" pour afficher la description et les ingrédients de la recette.
      const recipeDescription = document.createElement("div");
      recipeDescription.className = "recipe-container";
  
      // Créer un élément "p" pour afficher le titre de la description.
      const recipeDescriptionTitle = document.createElement("p");
      recipeDescriptionTitle.textContent = "Recette";
      recipeDescriptionTitle.className = "recipe-ingredients-title";
      recipeDescription.appendChild(recipeDescriptionTitle);
  
      // Créer un élément "p" pour afficher la description de la recette.
      const recipeDescriptionText = document.createElement("p");
      recipeDescriptionText.className = "recipe-description-text";
      recipeDescriptionText.textContent = description;
      recipeDescription.appendChild(recipeDescriptionText);
  
      // Créer un élément "section" pour afficher la liste des ingrédients.
      const recipeIngredients = document.createElement("section");
      recipeIngredients.className = "ingredients-container";
  
      // Créer un élément "p" pour afficher le titre des ingrédients.
      const recipeIngredientsTitle = document.createElement("p");
      recipeIngredientsTitle.textContent = "Ingrédients";
      recipeIngredientsTitle.className = "recipe-ingredients-title";
      recipeDescription.appendChild(recipeIngredientsTitle);
  
      // Fonction pour créer un élément d'ingrédient.
      function createIngredientElement(ingredient, quantity, unit) {
        const ingredientQuantityUnit = document.createElement("div");
        ingredientQuantityUnit.className = "ingredient-block";
  
        // Élément pour afficher le nom de l'ingrédient.
        const ingredientNameElement = document.createElement("p");
        ingredientNameElement.textContent = ingredient;
        ingredientNameElement.className = "ingredient-name";
        ingredientQuantityUnit.appendChild(ingredientNameElement);
  
        // Élément pour afficher la quantité et l'unité de l'ingrédient.
        const quantityUnitElement = document.createElement("p");
        quantityUnitElement.className = "ingredient-quantity";
  
        // Si la quantité et l'unité sont disponibles, les afficher ensemble.
        if (quantity && unit) {
          quantityUnitElement.textContent = `${quantity} ${unit}`;
        } else if (quantity) {
          quantityUnitElement.textContent = quantity.toString();
        } else {
          // Sinon, afficher "-" pour indiquer que les informations ne sont pas disponibles.
          quantityUnitElement.textContent = "-";
        }
  
        ingredientQuantityUnit.appendChild(quantityUnitElement);
  
        return ingredientQuantityUnit;
      }
  
      // Pour chaque ingrédient, créer un élément correspondant et l'ajouter à la liste des ingrédients.
      ingredients.forEach((ingredient) => {
        const ingredientElement = createIngredientElement(
          ingredient.ingredient,
          ingredient.quantity,
          ingredient.unit
        );
        recipeIngredients.appendChild(ingredientElement);
      });
  
      // Ajouter la liste des ingrédients à la description de la recette.
      recipeDescription.appendChild(recipeIngredients);
      // Ajouter la description complète à la section d'informations de la recette.
      recipeInfo.appendChild(recipeDescription);
  
      // Retourner l'élément "article" représentant la carte de recette.
      return article;
    }
  
    // Retourner un objet avec la méthode "getRecipeCardDOM".
    return { getRecipeCardDOM };
  }
  