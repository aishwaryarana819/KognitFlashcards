# Kognit Flashcards

## Introduction
Welcome to **Kognit Flashcards** — a powerful, beautifully designed spaced-repetition learning platform. Built for students, lifelong learners, and knowledge workers, Kognit leverages advanced cognitive science algorithms to help you retain information permanently. 

Unlike basic flashcard apps, Kognit acts as a "Sanctuary for Scattered Memory," bringing an elegant, distraction-free interface to the rigorous demands of active recall.

## Features
- **Fully Responsive across Web & Mobile**
- **Complete & Free Sync** 
- **FSRS v6 Integration:** Powered by the cutting-edge Free Spaced Repetition Scheduler (FSRS v6.3.1) algorithm to optimize your learning intervals and minimize study time.
- **Hierarchical Organization:** Organize your knowledge seamlessly using Shelves, Decks, and Cards.
- **Dynamic Review Sessions:** A distraction-free study environment featuring an adaptive floating review palette and performance tracking.
- **Analytics & Heatmaps:** Track your 30-day memory heatmap, daily streaks, and detailed learning states (New, Learning, Mastered).
- **Responsive UI & Theming:** A fluid, glassmorphic interface that seamlessly adapts between light and dark modes.
- **Cross-Platform Readiness:** Built as a Progressive Web App (PWA) using Expo and React Native Web.

## Tech Stack
- **Frontend:** React Native Web (Expo).
- **Backend:** Django, Django REST Framework.
- **Database:** PostgreSQL (via Supabase).
- **Authentication:** Supabase JWT Auth (Email/Password, Google, HackClub).
- **Algorithm:** `fsrs` Python library.
- **Deployment:** Vercel and Render

## Known Bugs
- Light logo icon doesn't appear in Safari.
- Fonts appear about 40% uglier (but still fine) on Firefox & Safari due to varying browser rendering engines.
- Google Login currently does not work (OAuth callback routing issue).

## Coming Soon
Currently, Dashboard & Library is functional. 
Everything else will be released in version 2.0

## The Build Journey
Kognit Flashcards started as a personal project born out of frustration with clunky, outdated UI or expensive spaced-repetition software.

The most challenging part of the journey was integrating the FSRS v6 algorithm. 
FSRS is incredibly powerful, but v6 introduced a complex state-machine requirement (the step field) that broke traditional Leitner-system logic. 
Getting the frontend queue to perfectly sync with the backend scheduler took weeks of debugging and refactoring.

Another massive milestone was backend optimization. 
Initially, the dashboard would take 40-60 seconds to load because it iteratively queried the database to calculate streaks and averages. 
By writing complex, grouped Django database aggregates, I brought the load time down to a much shorter time. 

Building this app taught me the delicate balance between beautiful UI design and hardcore database optimization.

## AI Usage Declaration
To maintain transparency, I want to clarify my use of AI during the development of Kognit. 
Overall, AI tools accounted for about 20-30% of the development process.

I hand-coded the core architecture, the complex FSRS algorithm integration, state management, and the overall UI/UX design logic. 
I utilized AI to speed up repetitive tasks, optimize for speed and write the README file.

## Contributing
Pull requests are welcome! 

If you're interested in tackling any of the items in the Known Bugs section (especially the Safari rendering issues), feel free to fork the repository and submit a PR.