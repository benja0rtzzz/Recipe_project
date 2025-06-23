import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebaseConfig";
import { getUserUserName } from "@/services/userService";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  displayName: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  displayName: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userUserName = await getUserUserName(user.uid);
        setDisplayName(userUserName);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading, displayName }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
