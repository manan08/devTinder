# DevTinder API Documentation

A Node.js/Express-based dating application API with user authentication, profile management, and connection request handling.

## Project Structure

```
src/
├── app.js                          # Main application entry point
├── config/
│   └── database.js                # MongoDB database configuration
├── middlewares/
│   └── auth.js                    # Authentication middleware
├── models/
│   ├── user.js                    # User schema and methods
│   └── connectionRequest.js       # Connection request schema
├── routes/
│   ├── authRouter.js              # Authentication endpoints
│   ├── profileRouter.js           # User profile endpoints
│   ├── userRouter.js              # User feed and connections
│   └── connectionRequestRouter.js # Connection request endpoints
└── utils/
    └── validations.js             # Data validation utilities
```

## Installation

```bash
npm install
```

### Required Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `validator` - Data validation
- `cookie-parser` - Cookie parsing
- `cors` - Cross-origin resource sharing
- `morgan` - HTTP request logger

## Configuration

The server runs on **Port 3000** by default and connects to MongoDB. CORS is configured to allow requests from `http://localhost:5173`.

## API Endpoints

### Authentication Routes (`/`)

#### 1. Sign Up
- **Method:** `POST`
- **Route:** `/signup`
- **Description:** Register a new user account
- **Body:**
  ```json
  {
    "firstName": "string (required, min 4 chars)",
    "lastName": "string (required)",
    "emailId": "string (required, valid email)",
    "password": "string (required, strong password)"
  }
  ```
- **Response:** User object with JWT token set in cookies
- **Status Codes:** 200 (Success), 400 (Validation Error)

#### 2. Login
- **Method:** `POST`
- **Route:** `/login`
- **Description:** Authenticate user and receive JWT token
- **Body:**
  ```json
  {
    "emailId": "string",
    "password": "string"
  }
  ```
- **Response:** User object with JWT token set in cookies
- **Status Codes:** 200 (Success), 400 (Invalid Credentials)

#### 3. Logout
- **Method:** `POST`
- **Route:** `/logout`
- **Description:** Clear JWT token cookie
- **Response:** "Logout Successful!!"
- **Status Codes:** 200 (Success)

---

### Profile Routes (`/`)

#### 1. Get Profile
- **Method:** `GET`
- **Route:** `/profile`
- **Auth:** Required (JWT token)
- **Description:** Fetch current user's profile
- **Response:**
  ```json
  {
    "status": "OK",
    "message": "User fetched",
    "data": { user object }
  }
  ```
- **Status Codes:** 200 (Success), 500 (Error)

#### 2. Update Profile
- **Method:** `PATCH`
- **Route:** `/profile/edit`
- **Auth:** Required (JWT token)
- **Description:** Update user profile fields
- **Body:** Any of these fields:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "emailId": "string",
    "photoUrl": "string (valid URL)",
    "gender": "male|female|other",
    "age": "number (min 18)",
    "about": "string",
    "skills": "array of strings"
  }
  ```
- **Response:** Updated user object
- **Status Codes:** 200 (Success), 400 (Invalid Data), 500 (Error)

#### 3. Update Password
- **Method:** `PATCH`
- **Route:** `/profile/password`
- **Auth:** Required (JWT token)
- **Description:** Update user password
- **Body:**
  ```json
  {
    "password": "string (strong password required)"
  }
  ```
- **Response:** `{ "status": "success", "message": "Password Updated Successfully" }`
- **Status Codes:** 200 (Success), 500 (Error)

---

### Connection Request Routes (`/`)

#### 1. Send Connection Request
- **Method:** `POST`
- **Route:** `/request/send/:status/:toUserId`
- **Auth:** Required (JWT token)
- **Description:** Send a connection request (interested or ignored)
- **Parameters:**
  - `status`: `interested` or `ignored`
  - `toUserId`: ID of target user
- **Response:** 
  ```json
  {
    "status": "success",
    "message": "User firstName is/has interested/ignored User lastName",
    "data": { connection request object }
  }
  ```
- **Status Codes:** 200 (Success), 400 (Invalid Status/User Not Found/Request Already Exists), 500 (Error)

#### 2. Review Connection Request
- **Method:** `POST`
- **Route:** `/request/review/:status/:requestId`
- **Auth:** Required (JWT token)
- **Description:** Accept or reject a received connection request
- **Parameters:**
  - `status`: `accepted` or `rejected`
  - `requestId`: ID of connection request
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Connection Request has been accepted/rejected!",
    "data": { updated connection request object }
  }
  ```
- **Status Codes:** 200 (Success), 400 (Invalid Status), 404 (Request Not Found), 500 (Error)

---

### User Routes (`/`)

#### 1. Get Received Requests
- **Method:** `GET`
- **Route:** `/user/requests/received`
- **Auth:** Required (JWT token)
- **Description:** Fetch all pending connection requests received by user
- **Response:**
  ```json
  {
    "message": "Data fetched successfully",
    "data": [ { connection request objects with fromUser details } ]
  }
  ```
- **Status Codes:** 200 (Success), 400 (Error)

#### 2. Get Connections
- **Method:** `GET`
- **Route:** `/user/connections`
- **Auth:** Required (JWT token)
- **Description:** Fetch all accepted connections
- **Response:**
  ```json
  {
    "data": [ { user objects of connections } ]
  }
  ```
- **Status Codes:** 200 (Success), 400 (Error)

#### 3. Get Feed
- **Method:** `GET`
- **Route:** `/feed`
- **Auth:** Required (JWT token)
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10, max: 50)
- **Description:** Fetch paginated list of users excluding self and those with existing connection requests
- **Response:**
  ```json
  {
    "data": [ { user objects with safe data } ]
  }
  ```
- **Status Codes:** 200 (Success), 400 (Error)

---

## Data Models

### User Model
- `firstName` (String, required, 4-50 chars)
- `lastName` (String)
- `emailId` (String, required, unique, valid email)
- `password` (String, required, strong password)
- `age` (Number, min 18)
- `gender` (String: "male", "female", "other")
- `isPremium` (Boolean, default: false)
- `membershipType` (String)
- `photoUrl` (String, valid URL, default provided)
- `about` (String, default text)
- `skills` (Array of Strings)
- `timestamps` (createdAt, updatedAt)

### Connection Request Model
- `fromUserId` (ObjectId, reference to User)
- `toUserId` (ObjectId, reference to User)
- `status` (String: "interested", "ignored", "accepted", "rejected")

---

## Authentication

All protected endpoints require a JWT token passed via cookies. The token:
- Expires in 7 days
- Contains user ID
- Is set automatically on signup/login
- Is cleared on logout

---

## Safe Data Fields

When returning user data in responses (especially in feed and connections), the following fields are exposed:
`firstName`, `lastName`, `photoUrl`, `age`, `gender`, `about`, `skills`

Sensitive fields like `emailId`, `password`, `isPremium` are excluded.

---

## Error Handling

All errors are returned with appropriate HTTP status codes:
- **400:** Bad Request (validation errors, invalid credentials)
- **404:** Not Found (resource not found)
- **500:** Internal Server Error

---

## Running the Server

```bash
npm start
```

The server will:
1. Connect to MongoDB
2. Start listening on Port 3000
3. Log "Connected to Database..."
4. Log "Server listening on Port: 3000..."

---

## Notes

- Passwords are hashed using bcrypt before storage
- JWT secret: `DEV@Tinder$790` (should be moved to environment variables in production)
- CORS is enabled for frontend development
- Morgan middleware logs all HTTP requests in dev format
