import React from "react";

export default function OrDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-neutral-300 dark:border-neutral-700 shadow-sm"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium neu-flat rounded-full">
          or
        </span>
      </div>
    </div>
  );
}
