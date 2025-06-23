import axios from "axios";
import type {
  RecipeResult,
  SpoonacularResponse,
  SpoonacularRecipeDetailsResponse,
  RecipeDetails,
  RecipeSearchResponse,
  RecipeSearchFormatted,
} from "@/types/Recipe";

export async function fetchRecipes(): Promise<RecipeResult[]> {
  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
  const url = `https://api.spoonacular.com/recipes/complexSearch`;

  try {
    const response = await axios.get<SpoonacularResponse>(url, {
      params: {
        apiKey,
        number: 30,
        addRecipeInformation: true,
      },
    });

    const formattedData: RecipeResult[] = response.data.results.map(
      (recipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        healthScore: recipe.healthScore,
        pricePerServing: recipe.pricePerServing,
        userLiked: false, // Default to false, will be updated later if user is logged in
      })
    );

    return formattedData;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}

export async function fetchRecipeDetails(id: number): Promise<RecipeDetails> {
  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
  const url = `https://api.spoonacular.com/recipes/${id}/information`;

  try {
    const response = await axios.get<SpoonacularRecipeDetailsResponse>(url, {
      params: {
        apiKey,
      },
    });

    const formattedRecipe: RecipeDetails = {
      id: response.data.id,
      title: response.data.title,
      image: response.data.image,
      readyInMinutes: response.data.readyInMinutes,
      healthScore: response.data.healthScore,
      pricePerServing: response.data.pricePerServing,
      userLiked: false, // Default to false, will be updated later if user is logged in

      summary: response.data.summary,
      sourceUrl: response.data.sourceUrl,
      extendedIngredients: response.data.extendedIngredients.map(
        (ingredient) => ({
          id: ingredient.id,
          name: ingredient.name,
          aisle: ingredient.aisle,
          measure: {
            amount: ingredient.measures.metric.amount,
            unit: ingredient.measures.metric.unitShort,
          },
        })
      ),
      analyzedInstructions:
        response.data.analyzedInstructions?.map((instruction) => ({
          name: instruction.name,
          steps: instruction.steps.map((step) => ({
            number: step.number,
            step: step.step,
            ingredients: step.ingredients.map((ingredient) => ({
              id: ingredient.id,
              name: ingredient.name,
            })),
            equipment: step.equipment.map((equip) => ({
              id: equip.id,
              name: equip.name,
            })),
          })),
        })) || [],
    };

    return formattedRecipe;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    throw error;
  }
}

export async function autoCompleteSearch(
  query: string
): Promise<RecipeSearchFormatted[]> {
  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
  const url = `https://api.spoonacular.com/recipes/autocomplete`;

  try {
    const response = await axios.get<RecipeSearchResponse[]>(url, {
      params: {
        apiKey,
        number: 20,
        query,
      },
    });

    // Append image URLs to each recipe
    const recipesWithImages: RecipeSearchFormatted[] = response.data.map(
      (recipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: `https://spoonacular.com/recipeImages/${recipe.id}-556x370.jpg`,
      })
    );

    return recipesWithImages;
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    throw error;
  }
}

export async function getRecipesInformation(
  recipes: number[]
): Promise<RecipeSearchFormatted[]> {
  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

  if (!recipes.length) return [];

  const url = `https://api.spoonacular.com/recipes/informationBulk`;
  const idsParam = recipes.join(",");

  try {
    const response = await axios.get(url, {
      params: {
        ids: idsParam,
        apiKey,
      },
    });

    const data = response.data;

    const formatted: RecipeSearchFormatted[] = data.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
    }));

    return formatted;
  } catch (error) {
    console.error("Error fetching recipe information:", error);
    throw error;
  }
}
