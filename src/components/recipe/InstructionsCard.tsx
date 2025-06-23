import type { AnalyzedInstructionResponse } from "@/types/Recipe";
import { capitalizeWords } from "@/utility/formatting";

export default function InstructionsCard({
  instructions,
}: {
  instructions: AnalyzedInstructionResponse[];
}) {
  return (
    <div className="flex flex-col w-full gap-6">
      {instructions.map((instruction, idx) => (
        <div
          key={idx}
          className="flex flex-col w-full border border-gray-300 shadow-md rounded-lg p-4 gap-4"
        >
          {instruction.name && (
            <h2 className="text-xl font-bold text-gray-800">
              {instruction.name}
            </h2>
          )}
          <ol className="list-decimal pl-5 space-y-4 text-sm md:text-base">
            {instruction.steps.map((step) => (
              <li key={step.number} className="space-y-2">
                <p className="text-gray-800">{step.step}</p>

                {(step.ingredients.length > 0 || step.equipment.length > 0) && (
                  <div className="flex flex-col gap-2 text-gray-600 text-sm bg-gray-50 p-3 rounded-md border border-gray-200">
                    {step.ingredients.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">🧂 Ingredients used:</p>
                        <ul className="list-disc list-inside ml-2">
                          {step.ingredients.map((ingredient) => (
                            <li key={ingredient.id}>
                              {capitalizeWords(ingredient.name)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.equipment.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">
                          🛠️ Equipment required:
                        </p>
                        <ul className="list-disc list-inside ml-2">
                          {step.equipment.map((equip) => (
                            <li key={equip.id}>
                              {capitalizeWords(equip.name)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
