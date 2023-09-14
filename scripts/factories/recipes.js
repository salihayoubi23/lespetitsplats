function recipesFactory(data) {

    const { id, image, name,ingredients, time, description, appliance, ustensils } = data;
    const parsedIngredients = [];

    for (let i = 0; i < ingredients.length; i++) {
        const { ingredient, quantity, unit } = ingredients[i];
        parsedIngredients.push({ ingredient, quantity, unit });
    }   

    const images = `assets/recipes/${image} `;

    function getRecipeCardDOM() {

        const article = document.createElement("article");
        article.setAttribute("id", id);
        article.className = "recipe-article";
        const img = document.createElement("img");
        img.dataset.id = id
        img.className = "recipe-image";
        img.setAttribute("src", images);
        img.setAttribute("alt", name);
        article.appendChild(img);

        const recipeInfo = document.createElement("div");
        recipeInfo.className = "recipe-info";
        article.appendChild(recipeInfo);
        const recipeName = document.createElement("h2");
        recipeName.textContent = name
        recipeInfo.appendChild(recipeName);
        const recipeTime = document.createElement ("p");
        recipeTime.textContent = time + "min";
        recipeTime.className = "recipe-time"
        article.appendChild(recipeTime);
        const recipeDescription = document.createElement("div");
        recipeDescription.className = "recipe-container";
        
        const recipeDescriptionTitle = document.createElement("p");
        recipeDescriptionTitle.textContent = "Recette";
        recipeDescriptionTitle.className = "recipe-ingredients-title";
        recipeDescription.appendChild(recipeDescriptionTitle);
        const recipeDescriptionText = document.createElement("p");
        recipeDescriptionText.className = "recipe-description-text";
        recipeDescriptionText.textContent = description;
        recipeDescription.appendChild(recipeDescriptionText);
        const recipeIngredients = document.createElement("section")
        recipeIngredients.className = "ingredients-container"
        const recipeIngredientsTitle = document.createElement("p");
        recipeIngredientsTitle.textContent = "Ingrédients";
        recipeIngredientsTitle.className = "recipe-ingredients-title";
        recipeDescription.appendChild(recipeIngredientsTitle);


        function createIngredientElement(ingredient, quantity, unit) {
            const ingredientQuantityUnit = document.createElement("div");
            ingredientQuantityUnit.className = "ingredient-block"
            const ingredientNameElement = document.createElement("p");
            ingredientNameElement.textContent = ingredient;
            ingredientNameElement.className = "ingredient-name"
            ingredientQuantityUnit.appendChild(ingredientNameElement);
            const quantityUnitElement = document.createElement("p");
            quantityUnitElement.className = "ingredient-quantity";
            if (quantity && unit) {
                quantityUnitElement.textContent = `${quantity} ${unit}`;
              } else if (quantity) {
                quantityUnitElement.textContent = quantity.toString();
              } else {
                quantityUnitElement.textContent = "-";
              }

            ingredientQuantityUnit.appendChild(quantityUnitElement);
        
            return ingredientQuantityUnit;
        }

        //Pour chaque ingrédient, on créé l'élément correspondant
        ingredients.forEach((ingredient) => {
            const ingredientElement = createIngredientElement(
                ingredient.ingredient,
                ingredient.quantity,
                ingredient.unit
            );
            recipeIngredients.appendChild(ingredientElement);
        });

        recipeDescription.appendChild(recipeIngredients);
        recipeInfo.appendChild(recipeDescription);
    
        return article;

    }

    return { getRecipeCardDOM };
}