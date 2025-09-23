# Blog Platform

This is a full-stack blog platform with authentication, post management, comments, likes, and a rich text editor.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Test Coverage](#test-coverage)
- [Performance Report](#performance-report)

## Features

- User authentication (login, register, logout)
- Full CRUD functionality for posts
- Rich text editor with image upload support
- Nested comments with create, edit, and delete functionality
- "Like" system for posts
- "My Account" page for users to view and manage their own posts
- Filtering and view options (grid/list) for posts on the home and my account pages
- Secure routes on the frontend and backend
- Centralized error handling on the frontend
- Full-text search for posts by title, content, and author name
- Infinite scroll with skeleton loading for the blog feed

## Technologies

**Backend:**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT for authentication
- `ts-node-dev` for development

**Frontend:**

- React
- Vite
- TypeScript
- Tailwind CSS
- Zustand for global state
- SWR for data fetching

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm
- Docker (optional, for running MongoDB and Redis)

### Backend Installation

1.  Navigate to the `backend` directory:
    ```
    cd backend
    ```
2.  Install the dependencies:
    ```
    npm install
    ```

### Frontend Installation

1.  Navigate to the `frontend` directory:
    ```
    cd frontend
    ```
2.  Install the dependencies:
    ```
    npm install
    ```

### Configuration

1.  Create a `.env` file in the root directory.
2.  Add the following environment variables to the `.env` file:

    ```
    # Backend
    MONGO_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    BASE_URL=http://localhost:3001

    # Frontend
    VITE_API_BASE_URL=http://localhost:3001
    ```

### Running the Application

1.  **Start the backend server:**
    - Navigate to the `backend` directory.
    - Run the following command:
      ```
      npm run dev
      ```
2.  **Start the frontend development server:**
    - Navigate to the `frontend` directory.
    - Run the following command:
      ```
      npm run dev
      ```

## Test Coverage

There are no tests in this project yet.

## Performance Report

A Lighthouse audit was run on the frontend application, and the following scores were obtained:

- **Performance:** 80
- **Accessibility:** 85
- **Best Practices:** 96
- **SEO:** 72

### Optimization Summary

- **Performance:** The performance score is good, but it can be improved by optimizing the images and reducing the amount of JavaScript that is loaded on the initial page load.
- **Accessibility:** The accessibility score is good, but it can be improved by adding ARIA attributes to some of the elements.
- **Best Practices:** The best practices score is excellent.
- **SEO:** The SEO score is good, but it can be improved by adding a meta description and other SEO-related meta tags.
