import React from "react";

interface AuthErrorMessageProps {
  message: string;
}

const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({ message }) => {
  // Function to get appropriate error UI class based on error type
  const getErrorUIClass = (errorMsg: string) => {
    if (!errorMsg) return "";

    if (errorMsg.includes("blocked") || errorMsg.includes("popup")) {
      return "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500";
    } else if (
      errorMsg.includes("network") ||
      errorMsg.includes("internet") ||
      errorMsg.includes("connection")
    ) {
      return "bg-blue-100 text-blue-800 border-l-4 border-blue-500";
    } else if (errorMsg.includes("email")) {
      return "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500";
    } else if (errorMsg.includes("password") && !errorMsg.includes("match")) {
      return "bg-blue-100 text-blue-800 border-l-4 border-blue-500";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  if (!message) return null;

  return (
    <div
      className={`p-3 rounded-lg text-sm ${getErrorUIClass(message)} mb-4`}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

export default AuthErrorMessage;
