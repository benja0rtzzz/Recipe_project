import {
  collection,
  where,
  getDocs,
  query,
  setDoc,
  doc,
} from "firebase/firestore";
import { getUserUserName } from "@/services/userService";
import { db } from "@/services/firebaseConfig";
import type { Review } from "@/types/Review";
import type { User } from "firebase/auth";

export const addAReview = async (
  user: User,
  recipeId: number,
  reviewText: string
): Promise<void> => {
  try {
    // Get the user username
    const userName = await getUserUserName(user.email || "");
    console.log("User Name:", userName);
    const userReviewsRef = collection(db, "reviews");
    const newReview = {
      userUID: user.uid,
      recipeId: recipeId,
      userDisplayName: userName,
      review: reviewText,
      createdAt: new Date(),
    };
    await setDoc(doc(userReviewsRef), newReview);
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const getReviewsByRecipeId = async (
  recipeId: number
): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("recipeId", "==", recipeId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];
  } catch (error) {
    console.error("Error fetching reviews by recipe ID:", error);
    throw error;
  }
};
