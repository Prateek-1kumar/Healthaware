# Firebase Setup Guide for Healthaware

This guide will help you set up Firebase authentication for the Healthaware application, including Google and Apple sign-in methods.

## Creating a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new project
3. Give your project a name (e.g., "Healthaware")
4. Configure Google Analytics (optional but recommended)
5. Click "Create project"

## Setting up Firebase Authentication

1. In your Firebase project, navigate to "Authentication" in the left sidebar
2. Click "Get Started"
3. Enable the following sign-in providers:

### Email/Password Authentication

1. Click on "Email/Password" in the list of providers
2. Toggle "Enable" to turn it on
3. Click "Save"

### Google Authentication

1. Click on "Google" in the list of providers
2. Toggle "Enable" to turn it on
3. Add your support email
4. Click "Save"

### Apple Authentication

1. Click on "Apple" in the list of providers
2. Toggle "Enable" to turn it on
3. Follow the instructions to configure your Apple Developer account:
   - You'll need an Apple Developer account ($99/year)
   - Register an App ID in the Apple Developer Console
   - Enable "Sign in with Apple" capability
   - Create a Services ID
   - Configure domains and redirect URLs
   - Generate a private key
4. Enter the required information in the Firebase console
5. Click "Save"

## Adding Firebase to Your Web App

1. In your Firebase project, click on the gear icon (⚙️) next to "Project Overview" and select "Project settings"
2. Scroll down to "Your apps" section and click the web icon (`</>`)
3. Register your app with a nickname (e.g., "Healthaware Web")
4. Click "Register app"
5. Copy the Firebase configuration object

## Setting Up Environment Variables

1. Create a `.env.local` file in the root directory of your project
2. Add your Firebase configuration values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

3. Replace the placeholder values with your actual Firebase configuration values

## Testing Your Configuration

1. Start your development server:
   ```bash
   yarn dev
   ```
2. Navigate to the login page
3. Try signing in with email/password, Google, and Apple (if configured)

## Troubleshooting

### Google Sign-In Issues

- Make sure you have enabled the Google Identity Platform API in Google Cloud Console
- Check that your OAuth consent screen is properly configured
- Ensure your app domain is added to authorized domains in Firebase Authentication

### Apple Sign-In Issues

- Verify that your Apple Developer account is active
- Check that the Service ID and private key are configured correctly
- Ensure your domain is properly set up in your Apple Developer account
- Apple sign-in requires a secure context (HTTPS) in production

## Security Considerations

- Never commit your `.env.local` file to version control
- In production, set appropriate security rules for your Firebase resources
- Consider implementing additional security measures like rate limiting
- Regularly review authentication logs in Firebase Console

## Next Steps

After setting up authentication, you may want to:

1. Configure Firebase Firestore for user data storage
2. Set up Firebase Security Rules
3. Implement user profile management
4. Add email verification and password reset functionality
