import type { Ingredient } from "@/types/Ingredient";
import { capitalizeWords } from "@/utility/formatting";

export default function IngredientCard({
  ingredient,
}: {
  ingredient: Ingredient;
}) {
  return (
    <div className="flex flex-col justify-between 
                  border-gray-300 border-1 rounded-md shadow-sm 
                    p-4 hover:shadow-lg transition-shadow 
                    w-full max-h-[140px]">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-gray-800 md:text-xl">
          {capitalizeWords(ingredient.name)}
        </p>
        <p className="text-sm text-gray-500">Aisle: {ingredient.aisle}</p>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Amount:</span>{" "}
          {ingredient.measure.amount} {ingredient.measure.unit}
        </p>
      </div>
    </div>
  );
}