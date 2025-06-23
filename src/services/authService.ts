import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/services/firebaseConfig";
import type { StoreUser } from "@/types/User";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase Auth error:", error.code, error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};

export const registerWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  userName: string,
  bio: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const newUser: StoreUser = {
      uid: user.uid,
      email: user.email ?? "",
      firstName,
      lastName,
      userName,
      bio: bio || "",
    };

    await setDoc(doc(db, "users", user.uid), newUser);

    return user;
  } catch (error) {
    console.error("Error registering with email:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChanged = (
  callback: (user: StoreUser | null) => void
) => {
  return auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        callback(userDoc.data() as StoreUser);
      } else {
        // Handle case where user auth exists but not in Firestore
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
