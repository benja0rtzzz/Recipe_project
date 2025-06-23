import type { RecipeResult } from "@/types/Recipe";
import { useEffect, useState } from "react";
import { fetchRecipes } from "@/utility/recipeControllers";
import { useAuth } from "@/context/AuthContext";
import { getUserLikedRecipes } from "@/services/recipeService";
// Components
import Filters from "@/components/home/Filters";
import RecipeCard from "@/components/home/RecipeCard";

export default function Home() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<RecipeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        setLoading(true);

        // Fetch all recipes
        const allRecipes = await fetchRecipes();

        // If user is logged in, fetch their liked recipes
        if (user) {
          const likedRecipes = await getUserLikedRecipes(user.uid);

          // Create set of recipe IDs (numbers) instead of recipe objects
          const likedRecipeIds = new Set(
            likedRecipes.map((recipe) => recipe.id || recipe)
          );

          const mergedRecipes = allRecipes.map((recipe) => ({
            ...recipe,
            userLiked: likedRecipeIds.has(recipe.id),
          }));

          setRecipes(mergedRecipes);
        } else {
          setRecipes(allRecipes);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setError("Oops, something went wrong fetching the recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchInformation();
  }, [user]); 

  
  return (
    <div className="flex flex-col w-full h-full p-4">
      {/* Recipes Display */}
      <div className="w-full h-full">
        {loading ? (
          <div className="text-center text-lg text-gray-500">
            Loading recipes...
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="overflow-y-scroll max-h-full">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
