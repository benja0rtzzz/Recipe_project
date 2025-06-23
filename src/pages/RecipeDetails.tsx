import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import IngredientCard from "@/components/recipe/IngredientCard";
import { AlarmClock, Star, ExternalLink } from "lucide-react";
import { fetchRecipeDetails } from "@/utility/recipeControllers";
import DOMPurify from "dompurify";
import type { RecipeDetails } from "@/types/Recipe";
import InstructionsCard from "@/components/recipe/InstructionsCard";
import { useAuth } from "@/context/AuthContext";
import Reviews from "@/components/recipe/Reviews";
import {
  likeRecipe,
  unlikeRecipe,
  isRecipeLikedByUser,
  checkRecipeToCook,
  addRecipeToCook,
  removeRecipeToCook,
  addRecipeToPreviouslyCooked,
  checkRecipeCooked,
} from "@/services/recipeService";
import { useNavigate } from "react-router-dom";

export default function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<RecipeDetails>();
  const [loading, setLoading] = useState(true);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inUserToCook, setInUserToCook] = useState<boolean>(false);
  const [userCooked, setUserCooked] = useState<boolean>(false);

  useEffect(() => {
    const getRecipeDetails = async (id: number) => {
      try {
        setLoading(true);
        setRecipe(undefined);
        const recipe = await fetchRecipeDetails(id);
        const liked = user ? await isRecipeLikedByUser(user.uid, id) : false;
        setUserLiked(liked);
        setRecipe(recipe);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recipe details:", err);
        setError("Oops, something went wrong fetching the recipe details.");
      } finally {
        setLoading(false);
      }
    };
    getRecipeDetails(Number(id));
  }, [id]);

  useEffect(() => {
    const checkIfRecipeInToCook = async () => {
      if (user && recipe) {
        try {
          const inToCook = await checkRecipeToCook(user.uid, recipe.id);
          setInUserToCook(inToCook);
        } catch (error) {
          console.error("Error checking recipe in 'to cook':", error);
        }
      }
    };
    const checkIfRecipeCooked = async () => {
      if (user && recipe) {
        try {
          const cooked = await checkRecipeCooked(user.uid, recipe.id);
          setUserCooked(cooked);
        } catch (error) {
          console.error("Error checking if recipe is cooked:", error);
        }
      }
    };
    checkIfRecipeCooked();
    checkIfRecipeInToCook();
  }, [user, recipe]);

  if (loading) return <div className="p-4">Loading recipe...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!recipe) return <div className="p-4">No recipe found with this ID.</div>;

  const handleClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const recipeId = recipe.id as number;
      const userId = user.uid;

      // Optimistically update UI
      setUserLiked((prev) => !prev);

      if (userLiked) {
        await unlikeRecipe(userId, recipeId);
      } else {
        await likeRecipe(userId, recipeId);
      }
    } catch (error) {
      console.error("Error updating like state:", error);
      // Revert optimistic update on error
      setUserLiked((prev) => !prev);
    } finally {
      setIsProcessing(false);
    }
  };

  // Inside RecipeDetails component
  const handleToggleToCook = async () => {
    if (!user || isProcessing) return;
    setIsProcessing(true);

    try {
      const userId = user.uid;
      const recipeId = recipe!.id;
      if (inUserToCook) {
        await removeRecipeToCook(userId, recipeId);
        setInUserToCook(false);
      } else {
        await addRecipeToCook(userId, recipeId);
        setInUserToCook(true);
      }
    } catch (error) {
      console.error("Error updating 'to cook' state:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDidntCook = async () => {
    if (!user || !inUserToCook || isProcessing) return;
    setIsProcessing(true);
    try {
      await removeRecipeToCook(user.uid, recipe!.id);
      setInUserToCook(false);
    } catch (error) {
      console.error("Error removing recipe:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDidCook = async () => {
    try {
      await addRecipeToPreviouslyCooked(user!.uid, recipe!.id);
    } catch (error) {
      console.error("Error adding to cooked recipes:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full p-5 lg:px-10 gap-4 overflow-y-auto">
      {/* Left panel: Title, Image, Meta Info, Summary, Ingredients */}
      <div className="flex flex-col w-full lg:w-1/2 gap-4">
        {/* Title */}
        <h1 className="text-3xl font-semibold lg:text-4xl">{recipe.title}</h1>

        {/* Image */}
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full max-h-[400px] object-cover rounded-lg"
        />

        {/* Meta Info */}
        <div className="flex flex-wrap justify-between gap-2 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <AlarmClock className="w-5 h-5" />
            {recipe.readyInMinutes} minutes
          </div>
          <p>${recipe.pricePerServing.toFixed(2)} per serving</p>
          <p>Health Score: {recipe.healthScore}</p>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleClick}
          >
            {userLiked ? (
              <Star className="text-yellow-500" />
            ) : (
              <Star className="text-gray-400" />
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-2xl font-semibold mb-1">Summary:</h2>
          <div
            className="text-sm border-gray-300 border-1 rounded-lg p-4 shadow-sm"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(recipe.summary),
            }}
          />
        </div>

        {/* Ingredients */}
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-1">Ingredients:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recipe.extendedIngredients.map((ingredient) => (
              <IngredientCard key={ingredient.id} ingredient={ingredient} />
            ))}
          </div>

          <div className="w-full mt-4 flex flex-col gap-2">
            {user && (
              <>
                {inUserToCook ? (
                  <>
                    {userCooked ? (
                      <div className="w-full flex flex-row justify-between items-center">
                        You've already added this recipe to your previous
                        recipes.
                        <button
                          className="rounded-lg p-2 text-white bg-mainGreen hover:bg-mainGreenHover italic underline"
                          onClick={() => navigate("/dashboard")}
                        >
                          Refer to your Dashboard!
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          className="w-full py-2 px-4 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600"
                          onClick={handleDidntCook}
                          disabled={isProcessing}
                        >
                          Didn’t cook it (Remove)
                        </button>
                        <button
                          className="w-full py-2 px-4 rounded-lg text-white bg-mainGreen hover:bg-mainGreenHover"
                          onClick={handleDidCook}
                          disabled={isProcessing}
                        >
                          Did cook it (Add to previous recipes)
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className={
                      "w-full py-2 px-4 rounded-lg text-white transition-colors bg-mainGreen hover:bg-mainGreenHover"
                    }
                    onClick={handleToggleToCook}
                    disabled={isProcessing}
                  >
                    Add to 'To Cook' List
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right panel placeholder */}
      <div className="w-full lg:w-1/2 lg:flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Instructions:</h2>
        <div className="flex flex-col">
          {recipe.analyzedInstructions ? (
            <InstructionsCard instructions={recipe.analyzedInstructions} />
          ) : (
            <div className="text-sm text-gray-500">
              <p>No instructions available.</p>
              <p className="mt-2">
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mainGreen flex items-center"
                  onClick={(e) => {
                    if (
                      !window.confirm(
                        "You are about to leave this website and visit an external source. Continue?"
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  Please refer to the original source for more details.
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </p>
            </div>
          )}

          {/* Reviews */}
          <div className="w-full">
            <Reviews recipeId={recipe.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
