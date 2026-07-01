// import React, { createContext, useContext, useState, ReactNode } from "react";
// import { useNavigate } from "react-router-dom";

// export type UserRole = "sales" | "finance" | "vendor";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string, role: UserRole) => void;
//   signup: (name: string, email: string, password: string, role: UserRole) => void;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login: (email, _password, role) => {
//           setUser({ id: `${role[0]}1`, name: email.split("@")[0], email, role });
//         },
//         signup: (name, email, _password, role) => {
//           setUser({ id: `${role[0]}${Date.now()}`, name, email, role });
//         },
//         logout: () => setUser(null),
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }






import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "sales" | "finance" | "vendor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  signup: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper: build User from localStorage (set by LoginPage after API response)
function getUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const stored = JSON.parse(raw);

    // Ensure all required fields exist
    if (!stored || !stored.user_id || !stored.usertype) {
      return null;
    }

    return {
      id: stored.user_id,
      name: stored.name || "User",
      email: stored.email || "",
      role: stored.usertype as UserRole,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Initialize synchronously from storage to avoid flicker/loops
  React.useLayoutEffect(() => {
    const stored = getUserFromStorage();
    if (stored) {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, _password: string, role: UserRole) => {
    // localStorage is already written by LoginPage before this is called
    // Just sync the in-memory state from what's stored
    const stored = getUserFromStorage();
    setUser(stored ?? { id: "", name: email.split("@")[0], email, role });
  };

  const signup = (name: string, email: string, _password: string, role: UserRole) => {
    // localStorage is already written by SignupPage before this is called
    const stored = getUserFromStorage();
    setUser(stored ?? { id: "", name, email, role });
  };

  const logout = () => {
    // ✅ Clear everything from localStorage on logout
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
