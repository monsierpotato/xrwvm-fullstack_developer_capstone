# Cars Dealership - Full Stack Cloud Application

A responsive web application for a national car retailer in the US, allowing users to browse dealership branches across all states, view car models and dealer reviews, submit new reviews with sentiment analysis, and manage dealership inventory.

## Technology Stack
- **Frontend**: React.js, HTML5, CSS3, Bootstrap
- **Backend**: Django, Python 3
- **Database & Microservices**: Node.js, Express.js, MongoDB (Mongoose), IBM Cloud Code Engine
- **Sentiment Analysis Microservice**: Flask, NLTK SentimentIntensityAnalyzer
- **DevOps & CI/CD**: Docker, Kubernetes, GitHub Actions
- **Authentication**: Django Authentication System

## Key Features
- **Dealership Directory**: Search and filter dealerships by US state.
- **Reviews & Ratings**: View reviews for each dealership with sentiment analysis (Positive, Neutral, Negative).
- **Post Reviews**: Logged-in users can submit reviews for dealerships and car models purchased.
- **User Authentication**: Secure user registration, login, and logout.
- **Admin Portal**: Django administration portal to manage car makes, models, and dealers.

## Project Structure
- `server/`: Django backend project and React frontend
  - `djangoapp/`: Django application handling authentication, car inventory, dealer proxies, and sentiment integration
  - `djangoproj/`: Main Django settings and root routing
  - `frontend/`: React components and static assets
  - `database/`: Node.js Express server connected to MongoDB
- `.github/workflows/`: GitHub Actions CI/CD workflows