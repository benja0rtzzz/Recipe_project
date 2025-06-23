import type { Ingredient, Equipment, IngredientForStep } from "@/types/Ingredient";

export type RecipeResult = {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
    healthScore: number;
    pricePerServing: number;
    userLiked: boolean;
};

export type SpoonacularResponse = {
    results: RecipeResult[];
    offset: number;
    number: number;
    totalResults: number;
}
export type AnalyzedInstructionResponse = {
    name: string;
    steps: {
        number: number;
        step: string;
        ingredients: IngredientForStep[];
        equipment: Equipment[];
    }[];
}

export type SpoonacularRecipeDetailsResponse = {
    id: number;
    title: string;
    image: string;
    imageType: string;
    servings: number;
    readyInMinutes: number;
    cookingMinutes: number;
    aggregateLikes: number;
    preparationMinutes: number;
    license: string;
    sourceName: string;
    sourceUrl: string;
    spoonacularSourceUrl: string;
    healthScore: number;
    spoonacularScore: number;
    pricePerServing: number;
    analyzedInstructions: AnalyzedInstructionResponse[]; // You might want to create a more specific type for this
    cheap: boolean;
    creditsText: string;
    cuisines: string[];
    dairyFree: boolean;
    diets: string[];
    gaps: string;
    glutenFree: boolean;
    instructions: string;
    ketogenic: boolean;
    lowFodmap: boolean;
    occasions: string[];
    sustainable: boolean;
    vegan: boolean;
    vegetarian: boolean;
    veryHealthy: boolean;
    veryPopular: boolean;
    whole30: boolean;
    weightWatcherSmartPoints: number;
    dishTypes: string[];
    extendedIngredients: {
        aisle: string;
        amount: number;
        consistency: string;
        id: number;
        image: string;
        measures: {
            metric: {
                amount: number;
                unitLong: string;
                unitShort: string;
            };
            us: {
                amount: number;
                unitLong: string;
                unitShort: string;
            };
        };
        meta: string[];
        name: string;
        original: string;
        originalName: string;
        unit: string;
    }[];
    summary: string;
    winePairing: {
        pairedWines: string[];
        pairingText: string;
        productMatches: {
            id: number;
            title: string;
            description: string;
            price: string;
            imageUrl: string;
            averageRating: number;
            ratingCount: number;
            score: number;
            link: string;
        }[];
    };
}

export type RecipeSearchResponse = {
    id: number;
    title: string;
    imageType: string;
}

export type RecipeSearchFormatted = {
    id: number;
    title: string;
    image: string;
}

export type RecipeDetails = {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
    healthScore: number;
    pricePerServing: number;
    summary: string;
    sourceUrl: string;
    extendedIngredients: Ingredient[];
    analyzedInstructions?: AnalyzedInstructionResponse[];
    userLiked?: boolean;
}