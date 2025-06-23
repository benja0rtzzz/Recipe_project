import { useNavigate } from "react-router-dom";
import type { RecipeResult } from "@/types/Recipe";
import { AlarmClock, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { likeRecipe, unlikeRecipe } from "@/services/recipeService";
import { useState } from "react";
type RecipeCardProps = {
  recipe: RecipeResult;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userLiked, setUserLiked] = useState<boolean>(
    recipe.userLiked ?? false
  );
  const [isProcessing, setIsProcessing] = useState(false);

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

  return (
    <div className="flex flex-col w-full max-h-[360px] md:max-h-[420px] border-2 rounded-lg ">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-1/2 md:h-6/10 object-cover rounded-t-lg"
      />
      <div className="p-2 flex flex-col gap-2 md:text-xl">
        <p className="text-xl font-bold md:text-2xl">{recipe.title}</p>
        <div className="w-full flex flex-row justify-between items-center ">
          <div className="flex flex-row items-center gap-2">
            <AlarmClock /> {recipe.readyInMinutes} minutes.
          </div>
          <p>${recipe.pricePerServing.toFixed(2)} per serving.</p>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <p>Health Score: {recipe.healthScore}</p>
          <div
            className="flex flex-row items-center gap-2 cursor-pointer"
            onClick={handleClick}
          >
            {userLiked ? (
              <Star className="text-yellow-500" />
            ) : (
              <Star className="text-gray-400" />
            )}
          </div>
        </div>
        <button
          className="p-1 rounded-lg bg-mainGreen hover:bg-mainGreenHover text-white cursor-pointer"
          onClick={() => navigate(`/recipeDetails/${recipe.id}`)}
        >
          See full recipe!
        </button>
      </div>
    </div>
  );
}
