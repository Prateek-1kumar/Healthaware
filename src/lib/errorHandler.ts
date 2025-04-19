import { AuthError, AuthErrorCode } from "@/types/auth";

/**
 * Gets a user-friendly error message from a Firebase Auth error code
 */
export const getAuthErrorMessage = (errorCode: AuthErrorCode): string => {
  switch (errorCode) {
    // Email/password errors
    case "auth/invalid-email":
      return "The email address is badly formatted.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No account exists with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "An account already exists with this email address.";
    case "auth/weak-password":
      return "The password is too weak. Please use a stronger password.";
    case "auth/operation-not-allowed":
      return "This login method is not enabled. Please contact support.";

    // Social login errors
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email but different sign-in credentials. Try signing in using a different method.";
    case "auth/invalid-credential":
      return "The authentication credential is invalid. Please try again.";
    case "auth/operation-not-supported-in-this-environment":
      return "This operation is not supported in your current environment.";
    case "auth/timeout":
      return "The operation has timed out. Please try again.";
    case "auth/popup-blocked":
      return "The authentication popup was blocked by your browser. Please enable popups and try again.";
    case "auth/popup-closed-by-user":
      return "The authentication popup was closed before completing the sign-in process. Please try again.";

    // Generic errors
    case "auth/network-request-failed":
      return "A network error has occurred. Please check your internet connection and try again.";
    case "auth/internal-error":
      return "An internal error has occurred. Please try again later.";
    case "auth/cancelled-popup-request":
      return "The authentication process was cancelled. Please try again.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for OAuth operations. Please contact support.";
    default:
      return "An unexpected error occurred. Please try again later.";
  }
};

/**
 * Processes an error from Firebase Auth and returns a user-friendly error message
 */
export const handleAuthError = (error: any): string => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const authError = error as AuthError;
    return getAuthErrorMessage(authError.code);
  }

  return "An unexpected error occurred. Please try again later.";
};
