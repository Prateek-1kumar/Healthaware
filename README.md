# Neurosync - Mental Health Assessment Platform

Neurosync is a web application for mental health assessment and tracking. It provides users with personalized insights into their mental well-being through AI-powered analysis.

## Features

- **User Authentication:** Secure signup and login system with Google and Apple social logins
- **Mental Health Assessment:** Comprehensive questionnaire covering key mental health factors
- **Personalized Analysis:** AI-powered insights based on user responses
- **Results Dashboard:** Intuitive visualization of assessment results
- **Responsive Design:** Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Authentication
- **Design Patterns:** Neumorphism, Glassmorphism, and Skeuomorphism
- **Animation:** Framer Motion
- **Icons:** React Icons

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager
- Firebase project (for authentication)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/Neurosync.git
   cd Neurosync
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create Firebase project:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Set up Authentication and enable Email/Password, Google, and Apple sign-in methods
   - Get your Firebase configuration keys

4. Set up environment variables:

   - Create a `.env.local` file in the root directory
   - Add your Firebase configuration:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
     ```

5. Start the development server:

```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` - Next.js App Router structure
- `src/app/page.tsx` - Landing page
- `src/app/login/` - Login page with social logins
- `src/app/signup/` - Signup page
- `src/app/dashboard/` - Protected dashboard area
- `src/contexts/` - React contexts (Auth)
- `src/components/` - Reusable components
- `src/lib/` - Firebase and other utilities
- `src/types/` - TypeScript type definitions

## Setting Up Social Logins

### Google Authentication

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Google provider
3. Configure OAuth consent screen in Google Cloud Console
4. Add your domain to authorized domains

### Apple Authentication

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Apple provider
3. Configure your Apple Developer account:
   - Register an App ID
   - Enable "Sign in with Apple" capability
   - Create a Services ID
   - Configure domains and redirect URLs
   - Generate a private key

## Future Enhancements

- Integration with OpenAI API for more advanced analysis
- User data history and trend visualization
- Appointment scheduling with mental health professionals
- Community support features

## License

This project is licensed under the MIT License.

## Acknowledgments

- This project is for educational purposes and is not a substitute for professional mental health advice
- Icons and illustrations from various free sources
- Design inspiration from modern health applications
