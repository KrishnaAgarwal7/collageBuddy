import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, userApi } from "../api/auth";
import { tokenStorage } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true); // checking for existing session on app start
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // On app start: if a token is stored, try to fetch the current user.
  useEffect(() => {
    (async () => {
      try {
        const token = await tokenStorage.get();
        if (token) {
          const { user } = await userApi.getMe();
          setUser(user);
        }
      } catch (e) {
        // Stored token is invalid/expired — clear it silently.
        await tokenStorage.remove();
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await authApi.login({ email, password });
      if (res.token) await tokenStorage.set(res.token);
      const { user } = await userApi.getMe();
      setUser(user);
      return user;
    } catch (e) {
      setAuthError(e.message);
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await authApi.signup({ name, email, password });
      if (res.token) await tokenStorage.set(res.token);
      // Signup doesn't return full user object from backend, so log in
      // implicitly by fetching the freshly created profile.
      if (res.token) {
        const { user } = await userApi.getMe();
        setUser(user);
        return user;
      }
      return null;
    } catch (e) {
      setAuthError(e.message);
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const completeProfile = async (payload) => {
    const { user } = await userApi.completeProfile(payload);
    setUser(user);
    return user;
  };

  const refreshUser = async () => {
    const { user } = await userApi.getMe();
    setUser(user);
    return user;
  };

  const logout = async () => {
    await tokenStorage.remove();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      booting,
      authLoading,
      authError,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      signup,
      logout,
      completeProfile,
      refreshUser,
    }),
    [user, booting, authLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
