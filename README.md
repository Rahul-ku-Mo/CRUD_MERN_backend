Sure! Here's a `README.md` for the backend of your Task Manager project.

# Task Manager Backend

This project is the backend for the Task Manager application. It provides RESTful APIs for user authentication and task management. The backend is built using Node.js, Express, Prisma, and MongoDB.

## Features

- User Authentication (Sign Up, Log In, Log Out)
- Task Management (Create, Read, Update, Delete tasks)
- JWT-based Authentication
- Google OAuth Integration
- Secure Password Storage with bcrypt

## Technologies Used

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT implementation for Node.js
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js/) - Library for hashing passwords
- [passport](http://www.passportjs.org/) - Authentication middleware for Node.js
- [passport-google-oauth20](https://github.com/jaredhanson/passport-google-oauth2) - Google OAuth 2.0 authentication strategy for Passport

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- Prisma (ORM)
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/task-manager-backend.git
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

The server will start on [http://localhost:5000](http://localhost:5000).

### Building for Production

```bash
npm run build
# or
yarn build
```

### Starting the Production Server

```bash
npm start
# or
yarn start
```

## Project Structure

```plaintext
.
├── controllers
│   ├── authController.js
│   └── taskController.js
├── middlewares
│   ├── authMiddleware.js
├── models
│   ├── User.js
│   └── Task.js
├── routes
│   ├── authRoutes.js
│   └── taskRoutes.js
├── .env
├── .gitignore
├── server.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication

- **POST /api/v1/auth/register**: Register a new user
- **POST /api/v1/auth/login**: Log in a user
- **GET /api/v1/auth/google**: Google OAuth login
- **GET /api/v1/auth/google/callback**: Google OAuth callback
- **GET /api/v1/auth/google/exchangeCode**: Google Code Exchange

### Columns

- **GET /api/v1/columns**: Get all columns for the authenticated user
- **POST /api/v1/columns**: Create a new column
- **DELETE /api/v1/columns/:id**: Delete a column by ID
  
### Tasks

- **GET /api/v1/tasks**: Get all tasks for the authenticated user
- **POST /api/v1/tasks**: Create a new task
- **PUT /api/v1/tasks/:id**: Update a task by ID
- **DELETE /api/v1/tasks/:id**: Delete a task by ID

## Usage

### Authentication

- **Sign Up**: Users can register by providing their name, email, and password.
- **Log In**: Users can log in using their email and password or via Google OAuth.
- **Log Out**: Users can log out to end their session.

### Task Management

- **Create Task**: Users can create new tasks.
- **Read Tasks**: Users can view their tasks.
- **Update Task**: Users can update existing tasks.
- **Delete Task**: Users can delete tasks.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js/)
- [passport](http://www.passportjs.org/)
- [passport-google-oauth20](https://github.com/jaredhanson/passport-google-oauth2)

---

Happy coding! 🚀
