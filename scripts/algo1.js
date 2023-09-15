
const ingredientList = document.querySelector(".ingredient-list");
const applianceList = document.querySelector(".appliance-list");
const utensilList = document.querySelector(".utensil-list");
const filterSection = document.querySelector(".filter-section");
const filtersAdded = document.querySelector(".filters-added");
const filtersDiv = document.querySelector(".filter-container");
const mainSearch = document.querySelector(".main-search");
const clearSearchIcon = document.querySelector(".clear-search");
const recipesSection = document.querySelector(".recipes-section");


//Sets pour stocker les valeurs uniques des ingrédients, appareils et ustensiles
const uniqueIngredients = new Set();
const uniqueAppliances = new Set();
const uniqueUtensils = new Set();

//Sets pour stocker les valeurs filtrées des ingrédients, appareils et ustensiles
const filteredIngredients = new Set();
const filteredAppliances = new Set();
const filteredUtensils = new Set();

//// Fonction pour normaliser le texte en minuscules
function textNormalize(word) {
  return word.toLowerCase();
}

// Boucle sur les recettes pour extraire et stocker les valeurs uniques d'ingrédients, appareils et ustensiles

recipes.forEach(recipe => {
  recipe.ingredients.map(recipeIngredient => recipeIngredient.ingredient)
    .forEach(ingredient => uniqueIngredients.add(textNormalize(ingredient)));
});


recipes.map(recipe => textNormalize(recipe.appliance))
  .forEach(appliance => uniqueAppliances.add(appliance));

recipes.map(recipe => recipe.ustensils.map(utensil => textNormalize(utensil)))
  .forEach(utensils => utensils.forEach(utensil => uniqueUtensils.add(utensil)));

// Fonction pour filtrer les recettes en fonction des critères de recherche et des filtres

function filterRecipes() {
  const searchValue = textNormalize(mainSearch.value);
   // Utilisation de la méthode filter pour que la recherche démarre uniquement lorsque 3 caractères sont entrés

    const searchWords = searchValue.split(/\s+/).filter(word => word.length >= 3);
    const filteredRecipes = recipes.filter(recipe => {
    const lowerCaseName = textNormalize(recipe.name);
    const lowerCaseDescription = textNormalize(recipe.description);
    const matchesSearchWords = searchWords.every(word =>
      lowerCaseName.includes(word) ||
      lowerCaseDescription.includes(word) ||
      recipe.ingredients.some(ingredient =>
        textNormalize(ingredient.ingredient).includes(word)
      )
    );
    
    const selectedIngredients = selectedFilters.ingredients.map(textNormalize);
    const selectedAppliances = selectedFilters.appliances.map(textNormalize);
    const selectedUtensils = selectedFilters.utensils.map(textNormalize);

    const hasSelectedIngredients = selectedIngredients.every(ingredient =>
      recipe.ingredients.some(item => textNormalize(item.ingredient) === ingredient)
    );
    
    const hasSelectedAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(textNormalize(recipe.appliance));

    const hasSelectedUtensils = selectedUtensils.every(utensil =>
      recipe.ustensils.some(item => textNormalize(item) === utensil)
    );
    
    return matchesSearchWords && hasSelectedIngredients && hasSelectedAppliance && hasSelectedUtensils;
  });

  if (filteredRecipes.length === 0) {
    displayData([]);
    return;
  }

  displayData(filteredRecipes);
  filterDropdownLists(filteredRecipes);
}

const selectedFilters = {
  ingredients: [],
  appliances: [],
  utensils: []
};

// Fonction pour afficher les filtres sélectionnés

function displayFilters() {
  filtersAdded.appendChild(filtersDiv);
  filtersDiv.innerHTML = "";

  Object.entries(selectedFilters).forEach(([filterType, filterValues]) => {

    const activeFilters = filterValues.filter(value => value);

    activeFilters.map(value => {
      const filterContainer = document.createElement("div");
      filterContainer.classList.add("new-filter");
      filtersDiv.appendChild(filterContainer);

      const filterValueSpan = document.createElement("span");
      filterValueSpan.textContent = value;
      filterContainer.appendChild(filterValueSpan);

      const removeFilterButton = document.createElement("i");
      removeFilterButton.classList.add("fa-solid", "fa-xmark");
      filterContainer.appendChild(removeFilterButton);

      removeFilterButton.addEventListener("click", () => {
        const updatedFilterValues = selectedFilters[filterType].filter(item => item !== value);
        selectedFilters[filterType] = updatedFilterValues;

        const dropdownMenus = filterSection.querySelectorAll(".dropdown-menu");
        dropdownMenus.forEach((dropdownMenu) => {
          const filterItems = dropdownMenu.querySelectorAll("li");
          filterItems.forEach((item) => {
            if (item.textContent === value) {
              item.classList.remove("selected");
            }
          });
        });

        filterRecipes();
        displayFilters();
      });
    });
  });
}



//Création des listes

function createListItem(text, isSelected) {
  const li = document.createElement("li");
  li.textContent = text;
  if (isSelected) {
    li.classList.add("selected");
  }
  return li;
}
// Création des listes déroulantes pour ingrédients, appareils et ustensiles

function createDropdownList(container, dropdownId, optionsSet, label) {
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");
    container.appendChild(dropdown);

    const dropdownToggle = document.createElement("div");
    dropdownToggle.classList.add("dropdown-toggle");
    dropdownToggle.tabIndex = 0;
    dropdownToggle.textContent = label;
    dropdown.appendChild(dropdownToggle);

    const dropdownIcon = document.createElement("i");
    dropdownIcon.classList.add("fa-solid", "fa-angle-down");
    dropdownToggle.appendChild(dropdownIcon);

    const dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add("dropdown-menu");
    dropdown.appendChild(dropdownMenu);

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.classList.add("search-input");
    dropdownMenu.appendChild(searchInput);

    const clearSearchIconDropdown = document.createElement("i");
    clearSearchIconDropdown.classList.add("clear-icon", "fa-solid", "fa-xmark");
    searchInput.parentNode.insertBefore(clearSearchIconDropdown, searchInput.nextSibling);

    const searchIcon = document.createElement("i");
    searchIcon.classList.add("fa-solid", "fa-magnifying-glass");
    searchInput.parentNode.insertBefore(searchIcon, searchInput);

    optionsSet.forEach(option => {
      const li = createListItem(option, false);
      dropdownMenu.appendChild(li);
    });
    
    dropdownToggle.addEventListener("click", () => {
      dropdown.classList.toggle("open");
      const dropdownIcon = dropdownToggle.querySelector("i");
      dropdownIcon.classList.toggle("fa-angle-up", dropdown.classList.contains("open"));
      dropdownIcon.classList.toggle("fa-angle-down", !dropdown.classList.contains("open"));
    });
    
    const listItems = Array.from(dropdownMenu.querySelectorAll("li"));

    listItems.forEach(li => {
      li.addEventListener("click", () => {
        const selectedValue = li.textContent;
        const isSelected = li.classList.contains("selected");

        if (isSelected) {
          const updatedFilterValues = selectedFilters[dropdownId].filter(item => item !== selectedValue);
          selectedFilters[dropdownId] = updatedFilterValues;
        } else {
          li.classList.add("selected");
          selectedFilters[dropdownId].push(selectedValue);
        }

        filterRecipes();
        displayFilters();
      });
    });
    
    searchInput.addEventListener("input", () => {
      const searchValue = textNormalize(searchInput.value);

      const filteredSet =
      dropdownId === "ingredients"
        ? filteredIngredients
        : dropdownId === "appliances"
        ? filteredAppliances
        : filteredUtensils;
      
      listItems.forEach(item => {
        const text = textNormalize(item.textContent);
        item.style.display = text.includes(searchValue) && filteredSet.has(textNormalize(text)) ? "" : "none";
      });
      
      clearSearchIconDropdown.style.display = searchInput.value.trim() !== "" ? "block" : "none";
    });

    clearSearchIconDropdown.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input")); 
    });
}

createDropdownList(ingredientList, "ingredients", uniqueIngredients, "Ingrédients");
createDropdownList(applianceList, "appliances", uniqueAppliances, "Appareils");
createDropdownList(utensilList, "utensils", uniqueUtensils, "Ustensiles");

filterSection.appendChild(ingredientList);
filterSection.appendChild(applianceList);
filterSection.appendChild(utensilList);
// Création des listes déroulantes pour ingrédients, appareils et ustensiles

function filterDropdownLists(filteredRecipes) {

  const ingredientItems = ingredientList.querySelectorAll("li");
  const applianceItems = applianceList.querySelectorAll("li");
  const utensilItems = utensilList.querySelectorAll("li");

  filteredIngredients.clear();
  filteredAppliances.clear();
  filteredUtensils.clear();

  filteredRecipes.map(recipe => {
    filteredAppliances.add(textNormalize(recipe.appliance));
    recipe.ustensils.map(utensil => filteredUtensils.add(textNormalize(utensil)));
    recipe.ingredients.map(ingredientData => filteredIngredients.add(textNormalize(ingredientData.ingredient)));
  });

  function shouldDisplayItem(itemText, set) {
    return set.has(itemText);
  }

  ingredientItems.forEach(item => {
    const itemText = textNormalize(item.textContent);
    item.style.display = shouldDisplayItem(itemText, filteredIngredients) ? "" : "none";
  });

  applianceItems.forEach(item => {
    const itemText = textNormalize(item.textContent);
    item.style.display = shouldDisplayItem(itemText, filteredAppliances) ? "" : "none";
  });

  utensilItems.forEach(item => {
    const itemText = textNormalize(item.textContent);
    item.style.display = shouldDisplayItem(itemText, filteredUtensils) ? "" : "none";
  });
}


function toggleClearSearchIcon() {
  clearSearchIcon.style.display = mainSearch.value.trim() !== "" ? "inline-block" : "none";
}

//// Ajout d'écouteurs d'événements pour la recherche et les filtres
document.addEventListener("DOMContentLoaded", () => {
  mainSearch.value = "";
  mainSearch.dispatchEvent(new Event("input"));
});

mainSearch.addEventListener("input", () => {
  toggleClearSearchIcon();
  filterRecipes();
});

clearSearchIcon.addEventListener("click", () => {
  mainSearch.value = "";
  toggleClearSearchIcon();
  filterRecipes();
});

const dropdowns = document.querySelectorAll(".dropdown");

function closeDropdowns() {
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove("open");
  });
}
// Ajout d'un écouteur d'événement pour fermer les listes déroulantes lorsque l'utilisateur clique en dehors

document.addEventListener("mousedown", (event) => {
    const isClickInsideDropdown = event.target.closest(".dropdown");
    if (!isClickInsideDropdown) {
      closeDropdowns();
      const dropdownIcons = document.querySelectorAll(".dropdown-toggle i");
      dropdownIcons.forEach(icon => {
          icon.classList.remove("fa-angle-up");
          icon.classList.add("fa-angle-down");
      });
    }
  });