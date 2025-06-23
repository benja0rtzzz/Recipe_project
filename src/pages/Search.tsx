import { useState } from "react";
import type { RecipeSearchFormatted } from "@/types/Recipe";

import { autoCompleteSearch } from "@/utility/recipeControllers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SpinningLoader from "@/components/ui/loading";
import RecipeSearchCard from "@/components/search/RecipeSearchCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RecipeSearchFormatted[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await autoCompleteSearch(query);
      setResults(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-4 items-center justify-center">
      <div className="w-full lg:w-1/2">
        <div className="w-full flex flex-row gap-2">
          <Input
            type="text"
            placeholder="Search for recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-mainGreen hover:bg-mainGreenHover"
            onClick={() => handleSearch()}
          >
            Submit
          </Button>
        </div>
      </div>
      <div className="w-full lg:w-3/4 max-h-full overflow-y-auto">
        {loading ? (
          <SpinningLoader />
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 max-w-full">
            {results.map((recipe) => (
              <RecipeSearchCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No results found.</div>
        )}
      </div>
    </div>
  );
}
