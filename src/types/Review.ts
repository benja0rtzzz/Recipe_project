export type Review = {
  id: string;
  userUID: string;
  userDisplayName: string;
  recipeId: number;
  review: string;
  createdAt: Date;
};