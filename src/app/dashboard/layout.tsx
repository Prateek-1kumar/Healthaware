"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Home", path: "/dashboard", icon: "🏠" },
  { name: "New Assessment", path: "/dashboard/assessment", icon: "📋" },
  { name: "Results", path: "/dashboard/results", icon: "📊" },
  { name: "Profile", path: "/dashboard/profile", icon: "👤" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-[100dvh] bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 glass-card rounded-none shadow-lg h-[100dvh] sticky top-0">
        <div className="p-4 border-b border-neutral-200">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">Neurosync</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.path
                  ? "neu-pressed text-blue-600"
                  : "neu-flat hover:text-blue-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div>
              <div className="font-medium">{user?.name || "User"}</div>
              <div className="text-sm text-gray-700 truncate max-w-[160px]">
                {user?.email || ""}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="skeu-btn w-full py-2 rounded-lg text-neutral-700 hover:text-red-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header and navigation */}
      <div className="flex flex-col flex-1">
        <header className="md:hidden glass-sm sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              Neurosync
            </Link>

            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-2 rounded-lg neu-flat"
            >
              {isMobileNavOpen ? "✕" : "☰"}
            </button>
          </div>

          {isMobileNavOpen && (
            <nav className="p-4 border-t border-neutral-200 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    pathname === item.path
                      ? "neu-pressed text-blue-600"
                      : "neu-flat"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              <div className="pt-2 mt-2 border-t border-neutral-200">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left skeu-btn"
                >
                  <span className="text-xl">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          )}
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
