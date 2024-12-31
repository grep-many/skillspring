
# SkillSpring

**SkillSpring** is a comprehensive full-stack platform designed for online skill development and learning. It enables instructors to create courses and manage students while providing students with the ability to browse, enroll, and track progress in courses.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)

---

## Features

1. **Responsive Design**: Works seamlessly across devices, providing a great user experience on both mobile and desktop.
2. **User Roles**: Distinct functionalities for:
   - Students: Browse, enroll in, and track courses.
   - Instructors: Create, update, and manage courses.
3. **Authentication**: Secure login with JWT-based authentication.
4. **Media Management**: Cloudinary integration for storing and managing media files.
5. **Payments**: PayPal integration for processing course payments.
6. **Database**: MongoDB for secure and scalable data storage.

---

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Vite, Tailwind CSS
- **File Storage**: Cloudinary
- **Payment Gateway**: PayPal
- **Authentication**: JWT (JSON Web Tokens)

---

## Project Structure

### 1. **Server (Backend)**

- **Key Features**:
  - Handles authentication, data storage, and business logic.
  - Integrates with Cloudinary for media and PayPal for payments.

- **Important Directories**:
  - `/config`: Configuration files for the environment, database, and third-party services.
  - `/controllers`: Handles application logic (e.g., user actions, course creation).
  - `/models`: Defines database schemas for MongoDB.
  - `/routes`: API endpoints for handling authentication, course management, and more.

---

### 2. **Client (Frontend)**

- **Key Features**:
  - Built with React for a dynamic and responsive interface.
  - Implements Context API for global state management.

- **Important Directories**:
  - `/components`: Reusable UI components.
  - `/pages`: Pages representing various parts of the application (e.g., dashboard, course details).
  - `/context`: Context providers for managing app state.
  - `/services`: API functions for interacting with the backend.

---

## Getting Started

### Prerequisites

Ensure the following tools are installed on your system:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (running locally or on a cloud service)

---

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/grep-many/skillspring.git
   ```

2. **Install Dependencies**:

   Navigate to the respective folders and install dependencies:
   
   - **Backend**:
     ```bash
     cd server
     npm install
     ```
   - **Frontend**:
     ```bash
     cd client
     npm install
     ```

---

### Environment Variables

You need to configure the environment variables in `.env.local` files for both the server and client.

1. **Backend Configuration** (`server/.env.local`):

   ```plaintext
   PORT=5000 #<port number for backend server>
   CLIENT_URL=<frontend URL>
   MONGO_URI=<your MongoDB connection string>
   CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
   CLOUDINARY_API_KEY=<your Cloudinary API key>
   CLOUDINARY_API_SECRET=<your Cloudinary API secret>
   PAYPAL_CLIENT_ID=<your PayPal client ID>
   PAYPAL_SECRET_ID=<your PayPal secret ID>
   JWT_SECRET=<your JWT secret key>
   ```

2. **Frontend Configuration** (`client/.env.local`):

   ```plaintext
   VITE_BASEURL=<backend API URL>
   ```

---

## Development

1. **Run the Backend**:
   ```bash
   cd server
   npm run dev
   ```

2. **Run the Frontend**:
   ```bash
   cd client
   npm run dev
   ```

3. Access the application:
   - Backend: [http://localhost:5000](http://localhost:5000)
   - Frontend: [http://localhost:5173/skillspring](http://localhost:5173/skillspring)

---

## Deployment

1. Build the client for production:
   ```bash
   cd client
   npm run build
   ```

2. Configure the backend to serve the frontend and run in production mode.

--- 
