"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { SignupCredentials, SocialProvider } from "@/types/auth";
import AuthErrorMessage from "@/components/AuthErrorMessage";
import SocialLoginButton from "@/components/SocialLoginButton";
import OrDivider from "@/components/OrDivider";

export default function Signup() {
  const { signup, loginWithSocial, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<SignupCredentials>({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [socialLoginProvider, setSocialLoginProvider] =
    useState<SocialProvider | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error message when user starts typing after an error
    if (errorMessage) {
      setErrorMessage("");
    }

    // Check password match if confirm password field is changing
    if (name === "password") {
      setPasswordMatchError(
        confirmPassword !== "" && confirmPassword !== value
      );
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatchError(value !== credentials.password);

    // Clear error message when user is fixing their input
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateForm = () => {
    // Name validation
    if (!credentials.name?.trim()) {
      setErrorMessage("Please enter your name");
      return false;
    }

    // Email validation
    if (!credentials.email?.trim()) {
      setErrorMessage("Please enter your email address");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (!credentials.password) {
      setErrorMessage("Please enter a password");
      return false;
    }

    if (credentials.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return false;
    }

    // Password match validation
    if (credentials.password !== confirmPassword) {
      setPasswordMatchError(true);
      setErrorMessage("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      await signup(credentials);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to create account. Please try again.");
      }
    }
  };

  const handleGoogleSignup = async () => {
    setErrorMessage("");
    setSocialLoginProvider("google");

    try {
      // Show feedback message
      const feedbackEl = document.getElementById("signup-feedback");
      if (feedbackEl) {
        feedbackEl.textContent = "Signing up with Google...";
        feedbackEl.classList.remove("hidden", "bg-red-100", "text-red-700");
        feedbackEl.classList.add("bg-blue-100", "text-blue-700");
      }

      await loginWithSocial("google");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Error signing up with Google. Please try again.");
      }
      setSocialLoginProvider(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full my-8">
        {/* Glassmorphism card */}
        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/">
              <h2 className="text-2xl font-bold text-blue-600">Healthaware</h2>
            </Link>
            <h1 className="text-3xl font-bold mt-4 mb-2">Create Account</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Sign up to get started with mental health assessment
            </p>
          </div>

          <div className="space-y-4 mb-4">
            <SocialLoginButton
              provider="google"
              onClick={handleGoogleSignup}
              isLoading={isLoading && socialLoginProvider === "google"}
            />
          </div>

          <OrDivider />

          <form onSubmit={handleSignup} className="space-y-6">
            {errorMessage ? (
              <AuthErrorMessage message={errorMessage} />
            ) : (
              socialLoginProvider && (
                <div
                  id="signup-feedback"
                  className="p-3 bg-blue-100 text-blue-700 rounded-lg text-sm mb-4"
                >
                  Signing up with Google...
                </div>
              )
            )}

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={credentials.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg glass-sm"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg glass-sm"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg glass-sm"
                placeholder="••••••••"
                minLength={8}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full p-3 rounded-lg glass-sm ${
                  passwordMatchError
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
                placeholder="••••••••"
              />
              {passwordMatchError && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading || passwordMatchError}
                className="w-full rounded-lg py-3 px-4 text-center font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70 shadow-lg backdrop-blur-sm"
              >
                {isLoading && !socialLoginProvider
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
