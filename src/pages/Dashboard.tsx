import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getUserLikedRecipes,
  getCookedRecipes,
  getUserToCookRecipes,
} from "@/services/recipeService";
import type { RecipeSearchFormatted } from "@/types/Recipe";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [liked, setLiked] = useState<RecipeSearchFormatted[]>([]);
  const [toCook, setToCook] = useState<RecipeSearchFormatted[]>([]);
  const [cooked, setCooked] = useState<RecipeSearchFormatted[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [likedRecipes, toCookRecipes, cookedRecipes] = await Promise.all([
          getUserLikedRecipes(user.uid),
          getUserToCookRecipes(user.uid),
          getCookedRecipes(user.uid),
        ]);
        setLiked(likedRecipes);
        setToCook(toCookRecipes);
        setCooked(cookedRecipes);
      } catch (error) {
        console.error("Failed to load user recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center overflow-auto">
        <h1 className="text-2xl font-bold text-center">
          Login to save and keep track of your favorite recipes.
        </h1>
        <button
          className="text-xl p-2 rounded-lg bg-mainGreen hover:bg-mainGreenHover text-white mt-4"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-12 h-12 border-4 border-mainGreen border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderSection = (
    title: string,
    recipes: RecipeSearchFormatted[],
    emptyMessage: string
  ) => (
    <div className="w-full max-w-6xl mb-10">
      <h2 className="text-xl font-semibold mb-2 text-mainGreen">{title}</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-600">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-2 w-max">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="min-w-[220px] max-w-[250px] flex-shrink-0 border rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 flex flex-col gap-2">
                  <h3 className="font-semibold text-md truncate">
                    {recipe.title}
                  </h3>
                  <button
                    className="w-full p-1 rounded-lg bg-mainGreen hover:bg-mainGreenHover text-white cursor-pointer"
                    onClick={() => navigate(`/recipeDetails/${recipe.id}`)}
                  >
                    See full recipe!
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="px-4 py-8 w-full h-full flex flex-col items-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-mainGreen 1/10">
        My Dashboard
      </h1>
      <div className="overflow-auto w-9/10">
        {renderSection(
          "❤️ Liked Recipes",
          liked,
          "You haven't liked any recipes yet."
        )}
        {renderSection(
          "📝 To Cook",
          toCook,
          "Add some recipes to your cooking list!"
        )}
        {renderSection("✅ Cooked Recipes", cooked, "No recipes cooked yet.")}
      </div>
    </div>
  );
}
