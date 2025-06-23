import { useNavigate } from "react-router-dom";

import type { RecipeSearchFormatted } from "@/types/Recipe";
import { capitalizeWords } from "@/utility/formatting";

export default function RecipeSearchCard({
  recipe,
}: {
  recipe: RecipeSearchFormatted;
}) {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col w-full h-full p-4 bg-white rounded-lg shadow-md border-1 border-gray-300 cursor-pointer"
      onClick={() => navigate(`/recipeDetails/${recipe.id}`)}
    >
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h2 className="text-xl font-semibold mb-2">
        {capitalizeWords(recipe.title)}
      </h2>
    </div>
  );
}
