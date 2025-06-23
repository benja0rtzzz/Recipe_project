import {
  collection,
  where,
  getDocs,
  query,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import type { RecipeSearchFormatted } from "@/types/Recipe";
import { getRecipesInformation } from "@/utility/recipeControllers";

export const likeRecipe = async (
  userId: string,
  recipeId: number
): Promise<void> => {
  try {
    const userLikedRecipesRef = collection(db, "userLikedRecipes");
    const newLike = {
      userUID: userId,
      recipeId: recipeId,
    };
    await setDoc(doc(userLikedRecipesRef), newLike);
  } catch (error) {
    console.error("Error liking recipe:", error);
    throw error;
  }
};

export const unlikeRecipe = async (
  userId: string,
  recipeId: number
): Promise<void> => {
  try {
    const userLikedRecipesRef = collection(db, "userLikedRecipes");

    // Query the document with matching userId and recipeId fields
    const q = query(
      userLikedRecipesRef,
      where("userUID", "==", userId),
      where("recipeId", "==", recipeId)
    );

    const querySnapshot = await getDocs(q);
    const batchDeletes = querySnapshot.docs.map((docSnap) =>
      deleteDoc(docSnap.ref)
    );
    await Promise.all(batchDeletes);
  } catch (error) {
    console.error("Error unliking recipe:", error);
    throw error;
  }
};

export const isRecipeLikedByUser = async (
  userId: string,
  recipeId: number
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, "userLikedRecipes"),
      where("userUID", "==", userId),
      where("recipeId", "==", recipeId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // If the query returns any documents, the recipe is liked by the user
  } catch (error) {
    console.error("Error checking if recipe is liked by user:", error);
    throw error;
  }
};

export const getUserLikedRecipes = async (
  userId: string
): Promise<RecipeSearchFormatted[]> => {
  try {
    const q = query(
      collection(db, "userLikedRecipes"),
      where("userUID", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const likedIds: number[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.recipeId) {
        likedIds.push(data.recipeId);
      }
    });

    return await getRecipesInformation(likedIds);
  } catch (error) {
    console.error("Error fetching liked recipes:", error);
    throw error;
  }
};

export const getUserToCookRecipes = async (
  userId: string
): Promise<RecipeSearchFormatted[]> => {
  try {
    const q = query(
      collection(db, "recipesToCook"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const toCookIds: number[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.recipeId) {
        toCookIds.push(data.recipeId);
      }
    });

    return await getRecipesInformation(toCookIds);
  } catch (error) {
    console.error("Error fetching recipes to cook:", error);
    throw error;
  }
};

export const getCookedRecipes = async (
  userId: string
): Promise<RecipeSearchFormatted[]> => {
  try {
    const q = query(
      collection(db, "cookedRecipes"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const cookedIds: number[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.recipeId) {
        cookedIds.push(data.recipeId);
      }
    });

    return await getRecipesInformation(cookedIds);
  } catch (error) {
    console.error("Error fetching cooked recipes:", error);
    throw error;
  }
};
export const checkRecipeToCook = async (
  userId: string,
  recipeId: number
): Promise<boolean> => {
  try {
    const recipesToCookRef = collection(db, "recipesToCook");
    // Check if the recipe is already in the user's "to cook" list
    const q = query(
      recipesToCookRef,
      where("userId", "==", userId),
      where("recipeId", "==", recipeId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return true; // Recipe is already in the "to cook" list
    }
    return false; // Recipe is not in the "to cook" list
  } catch (error) {
    console.error("Error adding recipe to cook:", error);
    throw error;
  }
};

export const checkRecipeCooked = async (
  userId: string,
  recipeId: number
): Promise<boolean> => {
  try {
    const cookedRecipesRef = collection(db, "cookedRecipes");
    // Check if the recipe is already in the user's "cooked" list
    const q = query(
      cookedRecipesRef,
      where("userId", "==", userId),
      where("recipeId", "==", recipeId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return true; // Recipe is already in the "cooked" list
    }
    return false; // Recipe is not in the "cooked" list
  } catch (error) {
    console.error("Error checking if recipe is cooked:", error);
    throw error;
  }
};

export const addRecipeToCook = async (
  userId: string,
  recipeId: number
): Promise<void> => {
  try {
    const recipesToCookRef = collection(db, "recipesToCook");
    const newRecipeToCook = {
      userId: userId,
      recipeId: recipeId,
    };
    await setDoc(doc(recipesToCookRef), newRecipeToCook);
  } catch (error) {
    console.error("Error adding recipe to cook:", error);
    throw error;
  }
};

export const removeRecipeToCook = async (
  userId: string,
  recipeId: number
): Promise<void> => {
  try {
    const recipesToCookRef = collection(db, "recipesToCook");
    const q = query(
      recipesToCookRef,
      where("userId", "==", userId),
      where("recipeId", "==", recipeId)
    );

    const querySnapshot = await getDocs(q);
    const batchDeletes = querySnapshot.docs.map((docSnap) =>
      deleteDoc(docSnap.ref)
    );
    await Promise.all(batchDeletes);
  } catch (error) {
    console.error("Error removing recipe from to cook list:", error);
    throw error;
  }
};

export const addRecipeToPreviouslyCooked = async (
  userId: string,
  recipeId: number
): Promise<void> => {
  try {
    const cookedRecipesRef = collection(db, "cookedRecipes");
    const newCookedRecipe = {
      userId: userId,
      recipeId: recipeId,
    };
    await setDoc(doc(cookedRecipesRef), newCookedRecipe);
  } catch (error) {
    console.error("Error adding recipe to previously cooked:", error);
    throw error;
  }
};
