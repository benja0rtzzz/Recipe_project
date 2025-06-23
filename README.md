# RecipeApp

A full-featured recipe web application built with Bun, TypeScript, and React, featuring user authentication, likes, reviews, "to cook" and "cooked" lists, and a personalized dashboard.

---

## Features

- User Authentication: Sign up and log in to access personalized features.
- Browse Recipes: Fetch and display recipes from the Spoonacular API.
- Like Recipes: Mark recipes as favorites.
- Reviews: Leave and view reviews for each recipe.
- To Cook List: Add recipes you plan to cook.
- Cooked History: Track recipes you've cooked.
- Dashboard: View categorized lists of liked, to-cook, and cooked recipes.
- Optimistic UI Updates: Instant UI feedback on likes, saves, and cooking actions.

## Technologies

- Bun: Runtime and package manager
- TypeScript: Strongly typed JavaScript
- React: UI library
- Tailwind CSS: Utility-first styling
- React Router: Client-side routing
- Firebase Firestore: Backend data storage
- Spoonacular API: Recipe data source

## Installation

1. Clone the repo:
   git clone https://github.com/yourusername/recipe-app.git
   cd recipe-app

2. Install dependencies:
   bun install

3. Create a .env file based on .env.example:
   VITE_SPOONACULAR_API_KEY=your_spoonacular_api_key

4. Start the development server:
   bun dev

## Environment Variables

Required environment variables include:

- VITE_SPOONACULAR_API_KEY: Your Spoonacular API key
- Firebase environment variables (example):
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID

## Folder Structure

recipe-app/
├── public/
├── src/
│   ├── components/        Reusable UI components
│   ├── context/           React Context for auth
│   ├── services/          API and Firestore service functions
│   ├── types/             TypeScript type definitions
│   ├── utility/           Helpers/controllers
│   ├── pages/             Route components (Home, RecipeDetails, Dashboard)
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── bun.lockb
├── tsconfig.json
├── tailwind.config.js
└── README.md

## Usage

1. Browse recipes on the homepage.
2. Click a recipe card to view details, like, review, or add to your lists.
3. Sign in to manage your favorites, to-cook list, and cooked history.
4. Dashboard shows all your saved recipes in categorized sections.

## Scripts

- bun dev: Run development server
- bun build: Build for production
- bun start: Start production server

## Deployment

1. Build the app:
   bun build

2. Deploy to your preferred hosting platform (e.g., Vercel, Netlify).
   Make sure environment variables are set up correctly on the platform.

## Contributing

1. Fork the repo
2. Create a new branch: git checkout -b feature/YourFeature
3. Commit your changes: git commit -m 'feat: Add YourFeature'
4. Push to the branch: git push origin feature/YourFeature
5. Open a pull request

## License

MIT License © Your Name