# URL Shortener Service

This project is a URL Shortener Service built with Node.js, Express, TypeScript, MongoDB, and Redis. The service allows users to shorten URLs and manage them efficiently. The project is Dockerized for easy deployment and scalability.

## Table of Contents

- [URL Shortener Service](#url-shortener-service)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Running the Project](#running-the-project)
  - [Project Structure :](#project-structure-)
  - [Routes](#routes)
    - [Authentication Routes](#authentication-routes)
    - [URL Routes](#url-routes)
    - [User Routes](#user-routes)
  - [Contributing](#contributing)

## Features

- Shorten long URLs
- Manage shortened URLs
- User authentication and authorization
- Rate limiting to prevent abuse
- Email notifications
- Cache middleware using Redis
- Unit testing with Jest

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:

- Node.js
- Docker
- Docker Compose

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/BigBr41n/url-shortener-service.git
   cd url-shortener-service
   ```
2. Create a .env file in the root directory and add the following environment variables:

   ```
   DB_URI=mongodb://mongo:27017/database
   DOMAIN=example.com
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_SERVICE=gmail
   IP_TOKEN=your_ip_token
   REDIS_PORT=6379
   ```

   - and don't forget to generate public key and private key for each of access tokens and refresh tokens :

   ```
   openssl req -newkey rsa:2048 -nodes -keyout private.key -x509 -days 365 -out public.key
   ```

   ```
   openssl req -newkey rsa:2048 -nodes -keyout refTokenPrivate.key -x509 -days 365 -out refTokenPublic.key
   ```

## Running the Project

1. Build and start the Docker containers:
   ```
   docker-compose up
   ```
2. Access the application at `http://localhost:${PORT}`

## Project Structure :

```
.
├── docker-compose.yml
├── jest.config.ts
├── package.json
├── package-lock.json
├── private.key
├── public.key
├── refTokenPrivate.key
├── refTokenPublic.key
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── auth.Controllers.ts
│   │   ├── url.Controllers.ts
│   │   └── user.Controllers.ts
│   ├── middlewares
│   │   ├── cacheMidd.ts
│   │   ├── checkAuth.ts
│   │   ├── rateLimitter.ts
│   │   ├── upload.ts
│   │   └── validateResource.ts
│   ├── models
│   │   ├── admin.model.ts
│   │   ├── CustomError.ts
│   │   ├── shortUrl.model.ts
│   │   └── user.model.ts
│   ├── routes
│   │   ├── auth.route.ts
│   │   ├── url.routes.ts
│   │   └── user.routes.ts
│   ├── routes.ts
│   ├── schema
│   │   ├── auth
│   │   │   ├── activateAccount.schema.ts
│   │   │   ├── changePassword.schema.ts
│   │   │   ├── forgotPassword.schema.ts
│   │   │   ├── login.schema.ts
│   │   │   └── register.schema.ts
│   │   ├── url
│   │   │   └── urlSchema.ts
│   │   └── user
│   │       ├── deleteUser.schema.ts
│   │       ├── refreshToken.schema.ts
│   │       └── updateUser.schema.ts
│   ├── server.ts
│   ├── services
│   │   ├── url.services.ts
│   │   └── user.service.ts
│   ├── __tests__
│   │   └── user.test.ts
│   └── utils
│       ├── connect.db.ts
│       ├── jwt.ts
│       ├── logger.ts
│       └── mailer.ts
├── tsconfig.json
└── uploads
    └── avatar

```

## Routes

### Authentication Routes

- Register User
  ```
  POST /api/v1/auth/register
  ```
- Login User
  ```
  POST /api/v1/auth/login
  ```
- Logout User
  ```
  GET /api/v1/auth/logout
  ```
- Activate Account
  ```
  GET /api/v1/auth/activate
  ```
- Forgot Password
  ```
  POST /api/v1/auth/forgot-password
  ```
- Change Password
  ```
  POST /api/v1/auth/change-password
  ```
- Refresh Token
  ```
  POST /api/v1/auth/token
  ```

### URL Routes

- Create Short Url
  ```
  POST /api/v1/url/shorten
  ```
- Redirect to Long Url
  ```
  GET /api/v1/url/redirect/:shortCode
  ```
- Get Url Analytics
  ```
  GET /api/v1/url/:shortCode/analytics
  ```
- Update Short Url
  ```
  PATCH /api/v1/url/:shortCode/update
  ```
- Delete Short Url
  ```
  DELETE /api/v1/url/:shortCode/delete
  ```
- List User's Short URLs
  ```
  GET /api/v1/url/my-short-urls
  ```
- Generate QR Code
  ```
  GET /api/v1/url/qr-code
  ```

### User Routes

- Upload Avatar
  ```
  POST /api/v1/user/upload-avatar/:id
  ```
- Get User Profile
  ```
  GET /api/v1/user/:id
  ```
- Update User Profile
  ```
  PATCH /api/v1/user/update/
  ```
- Delete User Account
  ```
  DELETE /api/v1/user/delete
  ```

## Contributing

- Fork the repository.
- Create your feature branch (git checkout -b feature/AmazingFeature).
- Commit your changes (git commit -m 'Add some AmazingFeature').
- Push to the branch (git push origin feature/AmazingFeature).
- Open a pull request.
