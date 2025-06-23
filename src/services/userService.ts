import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { deleteUser as deleteFirebaseUser } from "firebase/auth";
import { auth, db } from "@/services/firebaseConfig";
import type { StoreUser } from "@/types/User";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export const reauthenticateUser = async (email: string, password: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser || !email || !password) {
    throw new Error("Missing user credentials");
  }

  const credential = EmailAuthProvider.credential(email, password);
  await reauthenticateWithCredential(currentUser, credential);
};

export const getUserUserName = async (email: string): Promise<string> => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return "";
    }

    const userData = querySnapshot.docs[0].data();
    return (userData as StoreUser).userName || "";
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

export const getUserInformation = async (
  userId: string
): Promise<StoreUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as StoreUser;
    } else {
      console.warn("No user found with ID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    throw error;
  }
};

export const deleteUserAccount = async (
  email: string,
  password: string
): Promise<void> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No user is currently signed in.");
  }

  try {
    // 🔐 Re-authenticate
    await reauthenticateUser(email, password);

    // 🗑️ Delete Firestore document
    const userDoc = doc(db, "users", currentUser.uid);
    await deleteDoc(userDoc);

    // ❌ Delete from Auth
    await deleteFirebaseUser(currentUser);

    console.log("User account and data deleted successfully.");
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};
