import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

type User = {
  first_name: string;
  last_name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Fetch user profile if token exists but user is missing
  useEffect(() => {
    if (token && !user) {
      api<User>("/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          logout(); // Token might be invalid
        });
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const data = await api<{
        access: string;
        refresh: string;
        user: User;
      }>("/users/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setToken(data.access);
      setUser(data.user);
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      await api("/users/signup/", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });
      return true;
    } catch (err) {
      console.error("Signup error:", err);
      return false;
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem("refresh");
    if (token && refresh) {
      try {
        await api("/users/logout/", {
          method: "POST",
          body: JSON.stringify({ refresh }),
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Logout backend error:", err);
      }
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);