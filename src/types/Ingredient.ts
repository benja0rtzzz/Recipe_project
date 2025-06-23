type Measure = {
    amount: number;
    unit: string;
}

export type Ingredient = {
    id: number;
    name: string;
    aisle: string;
    measure: Measure;
}

export type IngredientForStep = {
    id: number;
    name: string;
}
export type Equipment = {
    id: number;
    name: string;
}