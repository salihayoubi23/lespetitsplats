//methode avec la boucle for
const ingredientList = document.querySelector(".ingredient-list");
const applianceList = document.querySelector(".appliance-list");
const utensilList = document.querySelector(".utensil-list");
const filterSection = document.querySelector(".filter-section");
const filtersAdded = document.querySelector(".filters-added");
const filtersDiv = document.querySelector(".filter-container");
const mainSearch = document.querySelector(".main-search");
const clearSearchIcon = document.querySelector(".clear-search");
const recipesSection = document.querySelector(".recipes-section");
const recipesPlaceholder = document.querySelector(".recipes-placeholder");
const searchMessage = document.querySelector(".search-message");
const uniqueIngredients = new Set();
const uniqueAppliances = new Set();
const uniqueUtensils = new Set();
const filteredIngredients = new Set();
const filteredAppliances = new Set();
const filteredUtensils = new Set();

function textNormalize(word) {
  return word.toLowerCase();
}

for (const recipe of recipes) {

  //Les ingrédients sont dans un tableau, on extrait la valeur "ingredient" de "ingredients" avec une boucle for
  for (const recipeIngredient of recipe.ingredients) {
    const { ingredient } = recipeIngredient;
    const uniqueIngredient = textNormalize(ingredient);
    uniqueIngredients.add(uniqueIngredient);
  }

  //Les appareils sont directement accessibles
  const uniqueAppliance = textNormalize(recipe.appliance);
  uniqueAppliances.add(uniqueAppliance);

  //Les ustensiles sont également dans un tableau, on utilise une boucle for pour les récupérer
  for (const utensil of recipe.ustensils) {
    const uniqueUtensil = textNormalize(utensil);
    uniqueUtensils.add(uniqueUtensil);
  }
}

//filtrages des recettes
//Tableau pour stocker les filtres qui seront sélectionnés
const selectedFilters = {
  ingredients: [],
  appliances: [],
  utensils: []
};


//Fonction pour mettre à jour et afficher la liste des recettes mise à jour lorsqu'une recherche est effectuée
function filterRecipes() {
  const searchValue = textNormalize(mainSearch.value);
  //On créé une boucle for pour que la recherche démarre uniquement lorsque 3 caractères sont entrés
  const searchWords = [];
  const words = searchValue.split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length >= 3) {
      searchWords.push(word);
    }
  }
  //On créé un tableau pour contenir nos recettes filtrées
  const filteredRecipes = [];

  for (const recipe of recipes) {
    const lowerCaseName = textNormalize(recipe.name);
    const lowerCaseDescription = textNormalize(recipe.description);

    let matchesSearchWords = true;
    for (const word of searchWords) {
      if (!lowerCaseName.includes(word) && !lowerCaseDescription.includes(word) && !recipe.ingredients.some(ingredient =>
          textNormalize(ingredient.ingredient).includes(word)
        )
      ) {
        matchesSearchWords = false;
        break;
      }
    }

    const selectedIngredients = [];
    for (const ingredient of selectedFilters.ingredients) {
      selectedIngredients.push(textNormalize(ingredient));
    }

    const selectedAppliances = [];
    for (const appliance of selectedFilters.appliances) {
      selectedAppliances.push(textNormalize(appliance));
    }
    const selectedUtensils = [];
    for (const utensil of selectedFilters.utensils) {
      selectedUtensils.push(textNormalize(utensil));
    }

    let hasSelectedIngredients = true;
    for (const ingredient of selectedIngredients) {
      if (!recipe.ingredients.some(item => textNormalize(item.ingredient) === ingredient)) {
        hasSelectedIngredients = false;
        break;
      }
    }

    let hasSelectedAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(textNormalize(recipe.appliance));

    let hasSelectedUtensils = true;
    for (const utensil of selectedUtensils) {
      if (!recipe.ustensils.some(item => textNormalize(item) === utensil)) {
        hasSelectedUtensils = false;
        break;
      }
    }

    //Si la recette correspond aux informations données, on l'inclut dans le tableau et on l'affiche sur la page
    if (matchesSearchWords && hasSelectedIngredients && hasSelectedAppliance && hasSelectedUtensils) {
      filteredRecipes.push(recipe);
    }
  }

  if (filteredRecipes.length === 0) {
    displayData([]);
    return;
  }

  //On remet à jour la liste des recettes
  displayData(filteredRecipes);
  filterDropdownLists(filteredRecipes); 
}


function displayFilters() {
  filtersAdded.appendChild(filtersDiv);
  filtersDiv.innerHTML = "";

  for (const filterType in selectedFilters) {

    const filterValues = selectedFilters[filterType];
    let updatedFilterValues = [];

    for (let filterIndex = 0; filterIndex < filterValues.length; filterIndex++) {

      const value = filterValues[filterIndex];
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

        for (let i = 0; i < selectedFilters[filterType].length; i++) {
          const item = selectedFilters[filterType][i];
          if (item !== value) {
            updatedFilterValues.push(item);
          }
        }

        const dropdownMenus = filterSection.querySelectorAll(".dropdown-menu");
        for (let dropdownIndex = 0; dropdownIndex < dropdownMenus.length; dropdownIndex++) {
          const dropdownMenu = dropdownMenus[dropdownIndex];
          const filterItems = dropdownMenu.querySelectorAll("li");
          for (let itemIndex = 0; itemIndex < filterItems.length; itemIndex++) {
            const item = filterItems[itemIndex];
            if (item.textContent === value) {
              item.classList.remove("selected");
            }
          }
        }

        selectedFilters[filterType] = updatedFilterValues;
        filterRecipes();
        displayFilters();
      });
    }
  }
}

// Création des listes 

function createListItem(text, isSelected) {
  const li = document.createElement("li");
  li.textContent = text;
  if (isSelected) {
    li.classList.add("selected");
  }
  return li;
}

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
    
    const listItems = dropdownMenu.querySelectorAll("li");

    for (let i = 0; i < listItems.length; i++) {
      const li = listItems[i];
      
      li.addEventListener("click", () => {
        const selectedValue = li.textContent;
        const isSelected = li.classList.contains("selected");

        if (isSelected) {
          li.classList.remove("selected");
          const updatedFilterValues = [];
          for (let j = 0; j < selectedFilters[dropdownId].length; j++) {
            const item = selectedFilters[dropdownId][j];
            if (item !== selectedValue) {
              updatedFilterValues.push(item);
            }
          }
          selectedFilters[dropdownId] = updatedFilterValues;
        } else {
          li.classList.add("selected");
          selectedFilters[dropdownId].push(selectedValue);
        }

        filterRecipes();
        displayFilters();
      });
    }
    
    searchInput.addEventListener("input", () => {
      const searchValue = textNormalize(searchInput.value);
      const items = dropdownMenu.querySelectorAll("li");

      const filteredSet =
      dropdownId === "ingredients"
        ? filteredIngredients
        : dropdownId === "appliances"
        ? filteredAppliances
        : filteredUtensils;
      
      items.forEach(item => {
        const text = textNormalize(item.textContent);
        if (text.includes(searchValue) && filteredSet.has(textNormalize(text))) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
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

function filterDropdownLists(filteredRecipes) {

  const ingredientItems = ingredientList.querySelectorAll("li");
  const applianceItems = applianceList.querySelectorAll("li");
  const utensilItems = utensilList.querySelectorAll("li");

  filteredIngredients.clear();
  filteredAppliances.clear();
  filteredUtensils.clear();

  //Boucle for pour parcourir les recettes filtrées pour ajouter les éléments de liste aux ensembles filtrés
  for (const recipe of filteredRecipes) {
    filteredAppliances.add(textNormalize(recipe.appliance));
    for (const utensil of recipe.ustensils) {
      filteredUtensils.add(textNormalize(utensil));
    }
    for (const ingredientData of recipe.ingredients) {
      filteredIngredients.add(textNormalize(ingredientData.ingredient));
    }
  }

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



// Ecouteur d'évènements 
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