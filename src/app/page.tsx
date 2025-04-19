"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Format member since date - use current date as fallback
  const memberSince = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  // Display profile image or initials
  const renderProfileImage = (size: "small" | "large") => {
    const dimensions = size === "small" ? "w-10 h-10" : "w-16 h-16";
    const fontSize = size === "small" ? "text-lg" : "text-2xl";

    // Check if user has a valid photo URL
    const hasValidPhotoURL =
      user?.photoURL && typeof user.photoURL === "string";

    if (hasValidPhotoURL) {
      return (
        <div
          className={`${dimensions} rounded-full overflow-hidden relative shadow-sm`}
        >
          <Image
            src={user.photoURL as string} // Cast to string since we've already validated it
            alt={`${user.name || "User"}'s profile`}
            fill
            className="object-cover"
            onError={(e) => {
              // If image fails to load, replace with initials
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              console.error(
                "Failed to load profile image, falling back to initials"
              );
            }}
          />
          {/* Fallback initial in case image fails to load but error isn't caught */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-blue-100 text-blue-600 ${fontSize} font-semibold`}
            style={{ zIndex: -1 }}
          >
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={`${dimensions} rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ${fontSize} font-semibold shadow-sm`}
        >
          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center glass-sm">
        <div className="flex items-center gap-2">
          <div className="text-blue-600 font-bold text-2xl">Healthaware</div>
        </div>
        <div className="flex gap-4 items-center">
          {!mounted || isLoading ? (
            // Show loading skeleton when authentication state is loading
            <div className="flex gap-4">
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          ) : isAuthenticated && user ? (
            // Show user info and dashboard link when authenticated
            <>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3"
              >
                {renderProfileImage("small")}
                <div className="hidden md:block">
                  <p className="font-medium text-gray-800">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                </div>
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg skeu-btn"
              >
                Dashboard
              </Link>
            </>
          ) : (
            // Show login/signup when not authenticated
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full text-blue-600 hover:bg-blue-50 transition-all neu-flat"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg skeu-btn"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="max-w-4xl w-full">
          {isAuthenticated && user && mounted ? (
            // Welcome card for authenticated users
            <div className="glass-card p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center mb-8">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Welcome back, {user.name?.split(" ")[0] || "there"}!
                </h1>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    {renderProfileImage("large")}
                    <div>
                      <h2 className="text-xl font-semibold">
                        {user?.name || "User"}
                      </h2>
                      <p className="text-gray-700">{user?.email}</p>
                      <p className="text-sm text-gray-600">
                        Member since {memberSince}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-center skeu-btn"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/dashboard/assessment"
                    className="px-6 py-3 rounded-full bg-white text-blue-600 font-medium hover:bg-gray-50 transition-all shadow-sm hover:shadow-md border border-gray-200 text-center neu-flat"
                  >
                    New Assessment
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-2/5 aspect-square relative">
                <div className="w-full h-full rounded-2xl neu-flat flex items-center justify-center p-6">
                  {/* Brain illustration */}
                  <div className="w-4/5 h-4/5 rounded-full neu-pressed flex items-center justify-center relative overflow-hidden">
                    <Image
                      src="/brain.png"
                      alt="Cartoon brain illustration"
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Default hero for non-authenticated users
            <div className="glass-card p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Your Mental Health Matters
                </h1>
                <p className="text-lg text-gray-800 mb-6">
                  Get personalized mental health assessments with AI-powered
                  insights to help you understand your well-being better.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleGetStarted}
                    className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-center skeu-btn"
                  >
                    Get Started
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-full bg-white text-blue-600 font-medium hover:bg-gray-50 transition-all shadow-sm hover:shadow-md border border-gray-200 text-center neu-flat"
                  >
                    Explore Dashboard
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-2/5 aspect-square relative">
                <div className="w-full h-full rounded-2xl neu-flat flex items-center justify-center p-6">
                  {/* Brain illustration */}
                  <div className="w-4/5 h-4/5 rounded-full neu-pressed flex items-center justify-center relative overflow-hidden">
                    <Image
                      src="/brain.png"
                      alt="Cartoon brain illustration"
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Analysis",
                description:
                  "Get insights from advanced AI algorithms trained on mental health data",
                icon: "🤖",
              },
              {
                title: "Private & Secure",
                description:
                  "Your data is encrypted and never shared with third parties",
                icon: "🔒",
              },
              {
                title: "Actionable Insights",
                description:
                  "Receive personalized recommendations to improve your well-being",
                icon: "💡",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-sm rounded-xl p-6 hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-800">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 glass-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-700 text-sm">
            © {new Date().getFullYear()} Healthaware. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
