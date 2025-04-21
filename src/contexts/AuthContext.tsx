"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User as AuthUser,
  AuthContextType,
  LoginCredentials,
  SignupCredentials,
  SocialProvider,
} from "../types/auth";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  AuthError as FirebaseAuthError,
  AuthErrorCodes,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { handleAuthError } from "@/lib/errorHandler";
import { logUserIdToken } from "@/lib/authUtils";

// Initialize with default values
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => null,
  signup: async () => null,
  loginWithSocial: async () => null,
  logout: () => {},
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Convert Firebase user to app user
  const formatUser = (firebaseUser: FirebaseUser): AuthUser => {
    const providerData = firebaseUser.providerData[0];
    let provider: "email" | "google" = "email";

    if (providerData && providerData.providerId === "google.com") {
      provider = "google";
    }

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "",
      provider: provider,
      photoURL: firebaseUser.photoURL || undefined,
    };
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          // Log ID token whenever auth state changes to authenticated
          await logUserIdToken(firebaseUser);

          const formattedUser = formatUser(firebaseUser);
          setUser(formattedUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Login with email and password
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { email, password } = credentials;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Log the user's ID token after successful login
      await logUserIdToken(userCredential.user);

      const formattedUser = formatUser(userCredential.user);
      setUser(formattedUser);
      router.push("/dashboard");
      return formattedUser;
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = handleAuthError(error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Signup with email and password
  const signup = async (credentials: SignupCredentials) => {
    setIsLoading(true);
    try {
      const { email, password, name } = credentials;

      // Validate password strength
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with name if provided
      if (name && userCredential.user) {
        try {
          await updateProfile(userCredential.user, {
            displayName: name,
          });
        } catch (profileError) {
          console.error("Error updating user profile:", profileError);
          // Continue anyway, this is not critical
        }
      }

      // Log the user's ID token after successful signup
      await logUserIdToken(userCredential.user);

      const formattedUser = formatUser(userCredential.user);
      setUser(formattedUser);
      router.push("/dashboard");
      return formattedUser;
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = handleAuthError(error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const loginWithSocial = async (provider: SocialProvider) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);

      // Log the user's ID token after successful social login
      await logUserIdToken(userCredential.user);

      const formattedUser = formatUser(userCredential.user);
      setUser(formattedUser);

      router.push("/dashboard");
      return formattedUser;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      const errorMessage = handleAuthError(error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error(handleAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    loginWithSocial,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
