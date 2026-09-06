# 🎥 MeetHub

**MeetHub** is a real-time video conferencing web application that allows users to communicate through **video, audio, screen sharing, and real-time chat**.

The application is built using the **MERN stack concepts**, **WebRTC**, and **Socket.IO**, with authentication and meeting-history functionality backed by MongoDB.

---

## 🔗 Project Links

* **GitHub Repository:** `<your-github-repository-link>`
* **Live Project:** `<your-live-project-link>`
* **Backend API:** `<your-deployed-backend-url>`

> The links above can be replaced with the actual URLs after deployment.

---

# ✨ Features

## 👤 User Authentication

* User registration
* User login
* Password hashing using `bcrypt`
* Token-based authentication
* User-specific meeting history
* Authentication state handled using React Context API

## 🎥 Video Conferencing

* Real-time video calling
* Real-time audio communication
* Multiple participants
* Camera on/off
* Microphone on/off
* End meeting functionality

## 🖥️ Screen Sharing

Users can share their screen with other participants using the browser's:

```javascript
navigator.mediaDevices.getDisplayMedia()
```

API.

## 💬 Real-Time Chat

Participants can communicate using a real-time chat system powered by **Socket.IO**.

Messages are exchanged through the Socket.IO server between users inside the same meeting room.

## 📜 Meeting History

When a logged-in user joins a meeting, the meeting code is stored in MongoDB.

The History page displays:

* Meeting code
* Meeting date

Each user can see **their own meeting history**.

## 📱 Responsive Interface

The frontend is built with React and Material UI, along with custom CSS, to provide a user-friendly interface.

---

# 🛠️ Technologies Used

## Frontend

| Technology            | Purpose                                     |
| --------------------- | ------------------------------------------- |
| **React.js**          | Building the user interface                 |
| **Vite**              | Frontend development and build tool         |
| **Material UI (MUI)** | UI components and icons                     |
| **React Router**      | Client-side routing                         |
| **Axios**             | Communication with backend APIs             |
| **Socket.IO Client**  | Real-time communication                     |
| **WebRTC**            | Peer-to-peer audio/video communication      |
| **CSS / CSS Modules** | Styling                                     |
| **React Context API** | Authentication and shared application state |

## Backend

| Technology        | Purpose                                      |
| ----------------- | -------------------------------------------- |
| **Node.js**       | Backend runtime                              |
| **Express.js**    | REST API framework                           |
| **MongoDB**       | Database                                     |
| **MongoDB Atlas** | Cloud-hosted MongoDB database                |
| **Mongoose**      | MongoDB object modeling                      |
| **Socket.IO**     | Real-time communication and signaling        |
| **bcrypt**        | Password hashing                             |
| **crypto**        | Authentication token generation              |
| **dotenv**        | Environment variable management              |
| **CORS**          | Cross-origin resource sharing                |
| **Nodemon**       | Automatic backend restart during development |

---

# 🏗️ Architecture

MeetHub follows an **MVC-inspired architecture** on the backend.

```text
                    MeetHub
                       │
           ┌───────────┴───────────┐
           │                       │
       Frontend                 Backend
        React                   Node.js
           │                    Express
           │                       │
           │              ┌────────┼────────┐
           │              │        │        │
           │           Routes   Controllers Models
           │                         │        │
           │                         └────────┘
           │                              │
           └──────────────────────────────┤
                                          │
                                      MongoDB
                                          │
                                    MongoDB Atlas
```

### MVC Structure

### Model

The `models` directory contains Mongoose schemas for database collections.

```text
backend/models/
├── meeting.model.js
└── user.model.js
```

### View

The application view is handled by the React frontend.

```text
frontend/src/
```

React components and pages are responsible for displaying the application UI.

### Controller

Business logic is handled inside:

```text
backend/controllers/
```

For example:

```text
user.controller.js
```

contains logic for:

* Registration
* Login
* Getting meeting history
* Adding meetings to history

### Routes

API routes are defined inside:

```text
backend/routes/users.route.js
```

Routes connect incoming HTTP requests to their corresponding controller functions.

---

# 📂 Project Structure

```text
MeetHub/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── socketManager.js
│   │   └── user.controller.js
│   │
│   ├── models/
│   │   ├── meeting.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   └── users.route.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── app.js
│   ├── package-lock.json
│   └── package.json
│
└── frontend/
    │
    ├── public/
    │   └── logo.jpg
    │
    ├── src/
    │   │
    │   ├── assets/
    │   │   ├── background.png
    │   │   ├── logo3.png
    │   │   └── mobile.png
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   │
    │   ├── pages/
    │   │   ├── body/
    │   │   │   ├── HomeComponent.css
    │   │   │   ├── HomeComponent.jsx
    │   │   │   ├── LandingPage.jsx
    │   │   │   └── Login.png
    │   │   │
    │   │   ├── utils/
    │   │   │   └── withAuth.jsx
    │   │   │
    │   │   ├── Authentication.jsx
    │   │   └── history.jsx
    │   │
    │   ├── styles/
    │   │   └── VideoComponent.module.css
    │   │
    │   ├── App.css
    │   ├── App.jsx
    │   ├── environment.js
    │   ├── index.css
    │   ├── main.jsx
    │   └── VideoComponent.jsx
    │
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    └── vite.config.js
```

---

# 🔐 Authentication Flow

MeetHub uses a token-based authentication system.

The authentication process works as follows:

```text
                    Registration
                         │
                         ▼
                  User enters data
                         │
                         ▼
                  Express API
                         │
                         ▼
                user.controller.js
                         │
                         ▼
              Password hashed using bcrypt
                         │
                         ▼
                    MongoDB
```

## Registration

The user provides:

```text
Name
Username
Password
```

The backend receives the data through:

```http
POST /api/v1/user/register
```

Before storing the password, it is hashed using `bcrypt`.

The original password is never stored directly in the database.

---

# 🔑 Login Flow

When a user logs in:

```text
User
  │
  ▼
React Login Page
  │
  ▼
AuthContext
  │
  ▼
Axios
  │
  ▼
POST /api/v1/user/login
  │
  ▼
Express Route
  │
  ▼
User Controller
  │
  ▼
MongoDB
  │
  ▼
bcrypt.compare()
  │
  ▼
Password Valid?
  │
  ▼
Generate Token
  │
  ▼
Return Token to Frontend
  │
  ▼
localStorage
```

After successful login, the backend generates a random token using Node.js `crypto`.

The token is stored with the user.

The frontend receives the token and stores it in:

```javascript
localStorage
```

The token is then available for authenticated operations.

---

# 🎟️ How the Token Works

The token acts as the identifier for the logged-in user.

For example:

```text
Frontend
   │
   │ token
   ▼
Backend
   │
   ▼
User.findOne({ token })
   │
   ▼
Find logged-in user
```

For example, when retrieving meeting history, the frontend sends:

```text
GET /get_all_activity?token=USER_TOKEN
```

The backend searches for the user:

```javascript
User.findOne({ token })
```

Once the user is found, the backend gets the user's username.

Then it searches the Meeting collection:

```javascript
Meeting.find({
  user_id: user.username
})
```

This ensures that the returned meetings belong to that user.

---

# 🧾 Meeting History Flow

The meeting-history system works like this:

```text
User logs in
     │
     ▼
Token stored in localStorage
     │
     ▼
User joins meeting
     │
     ▼
Meeting code is sent to backend
     │
     ▼
Backend validates token
     │
     ▼
Find user using token
     │
     ▼
Create Meeting document
     │
     ▼
MongoDB
```

A meeting document contains:

```javascript
{
  user_id: String,
  meeting_id: String,
  date: Date
}
```

The `date` field is automatically generated when the meeting is saved.

---

# 👥 User-Specific History

Meeting history is associated with the logged-in user.

For example:

```text
User A
   │
   ├── Meeting 101
   ├── Meeting 102
   └── Meeting 103

User B
   │
   ├── Meeting 201
   └── Meeting 202
```

When User A requests history, the backend only retrieves meetings where:

```javascript
user_id === User A's username
```

Therefore, users do not receive another user's meeting history.

---

# 🎥 Video Meeting Flow

MeetHub uses **WebRTC** for real-time audio and video communication.

Socket.IO is used for communication and WebRTC signaling.

The basic flow is:

```text
User A
  │
  │ Socket.IO
  ▼
Socket Server
  │
  │ Signaling
  ▼
User B
  │
  └──── WebRTC Peer Connection ────┐
                                  │
                                  ▼
                            Audio / Video
```

---

# 🔄 WebRTC Signaling

Before two browsers can communicate directly using WebRTC, they need to exchange connection information.

MeetHub uses Socket.IO to exchange:

* SDP Offers
* SDP Answers
* ICE Candidates

The flow is:

```text
User A
   │
   │ SDP Offer
   ▼
Socket.IO Server
   │
   ▼
User B
   │
   │ SDP Answer
   ▼
Socket.IO Server
   │
   ▼
User A
```

After signaling is complete, WebRTC establishes the peer-to-peer connection.

The media itself is handled by WebRTC rather than being sent through the Express server.

---

# 🌐 Meeting Rooms

When a user joins a meeting, the frontend emits:

```text
join-call
```

The current meeting URL is used to identify the meeting room.

For example:

```text
http://localhost:5173/relative
```

The Socket.IO server keeps track of which sockets belong to each meeting.

```text
Room: /relative

├── User A
├── User B
└── User C
```

This allows users in the same meeting room to communicate with each other.

---

# 💬 Chat Flow

Chat uses Socket.IO.

The frontend sends:

```text
chat-message
```

to the Socket.IO server.

The server identifies the meeting room and broadcasts the message to participants in that room.

```text
User A
  │
  │ chat-message
  ▼
Socket.IO Server
  │
  ├──────────► User B
  │
  └──────────► User C
```

Chat messages are maintained in the server's current room state and can be sent to users joining that room.

---

# 🖥️ Screen Sharing Flow

Screen sharing uses the browser API:

```javascript
navigator.mediaDevices.getDisplayMedia()
```

When the user starts screen sharing:

```text
User
 │
 ▼
getDisplayMedia()
 │
 ▼
Screen MediaStream
 │
 ▼
WebRTC Peer Connections
 │
 ▼
Other Participants
```

When screen sharing ends, the application restores the user's normal media stream.

---

# 🗄️ MongoDB

MeetHub uses **MongoDB** as its database.

**Mongoose** is used as the ODM to define schemas and interact with MongoDB.

For production, the project can use **MongoDB Atlas**, MongoDB's cloud database service.

The backend connects to the database using the MongoDB connection string stored in an environment variable.

---

# 🔧 Environment Variables

The backend uses a `.env` file.

Create:

```text
backend/.env
```

The project currently requires:

```env
mongoDB_URL=your_mongodb_connection_string
```

For MongoDB Atlas, the connection string can look like:

```env
mongoDB_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
```

> Never upload your `.env` file or MongoDB credentials to GitHub.

The `.env` file should be included in `.gitignore`.

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone <your-github-repository-link>
```

Move into the project:

```bash
cd MeetHub
```

---

# ⚙️ Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the `.env` file:

```text
backend/.env
```

Add your MongoDB connection string:

```env
mongoDB_URL=your_mongodb_connection_string
```

---

## ▶️ Start Backend

During development, use Nodemon:

```bash
nodemon src/app.js
```

The backend runs on:

```text
http://localhost:8000
```

---

# 💻 Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# ▶️ Running the Complete Application

You need **two terminals**.

### Terminal 1 — Backend

```bash
cd backend
nodemon src/app.js
```

Backend:

```text
http://localhost:8000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔌 API Endpoints

The base API URL is:

```text
/api/v1/user
```

## Register

```http
POST /api/v1/user/register
```

Example request:

```json
{
  "name": "John Doe",
  "username": "john",
  "password": "password123"
}
```

---

## Login

```http
POST /api/v1/user/login
```

Example request:

```json
{
  "username": "john",
  "password": "password123"
}
```

The response contains an authentication token.

---

## Get User History

```http
GET /api/v1/user/get_all_activity
```

The token is sent as a query parameter:

```text
/get_all_activity?token=YOUR_TOKEN
```

---

## Add Meeting to History

```http
POST /api/v1/user/add_to_activity
```

Example request:

```json
{
  "token": "YOUR_TOKEN",
  "meeting_code": "MEETING_CODE"
}
```

---

# 📦 Database Models

## User Model

The User model stores information about registered users, including authentication information.

Conceptually:

```text
User
├── name
├── username
├── password
└── token
```

The password is stored as a bcrypt hash rather than plain text.

---

## Meeting Model

The Meeting model contains:

```javascript
{
  user_id: String,
  meeting_id: String,
  date: Date
}
```

The date is automatically assigned using:

```javascript
Date.now
```

---

# 🧭 Application Flow

The complete application flow can be summarized as:

```text
                         MeetHub
                            │
             ┌──────────────┴──────────────┐
             │                             │
          Frontend                       Backend
           React                         Express
             │                             │
       React Router                   REST API
             │                             │
       AuthContext                       Routes
             │                             │
           Axios                      Controllers
             │                             │
             └──────────────┬──────────────┘
                            │
                         MongoDB
                            │
                      MongoDB Atlas
```

For meetings:

```text
                 User joins meeting
                         │
                         ▼
                    React App
                         │
                         ▼
                    Socket.IO
                         │
                         ▼
                  Socket Manager
                         │
                         ▼
                Meeting Room Users
                         │
                         ▼
                 WebRTC Signaling
                         │
                         ▼
                Peer-to-Peer Media
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
           Video                  Audio
              │                     │
              └──────────┬──────────┘
                         ▼
                   Screen Sharing
                         +
                  Real-Time Chat
```

---

# 🔒 Security Considerations

The current application includes password hashing and token-based authentication.

For a production deployment, additional security improvements are recommended:

* Use HTTPS
* Use secure HTTP-only cookies or a more robust token strategy
* Add token expiration
* Validate and sanitize user input
* Add rate limiting
* Restrict CORS to trusted frontend domains
* Keep MongoDB credentials in environment variables
* Never commit `.env` to GitHub
* Use a TURN server for reliable WebRTC connectivity in restrictive networks

---

# 🌍 Deployment

The application can be deployed using separate frontend and backend hosting services.

A possible deployment architecture is:

```text
                    Internet
                       │
             ┌─────────┴─────────┐
             │                   │
        Frontend              Backend
        Hosting               Hosting
             │                   │
             │              Node + Express
             │                   │
             │              Socket.IO
             │                   │
             └──────────┬────────┘
                        │
                   MongoDB Atlas
```

Possible deployment services include:

### Frontend

* Vercel
* Netlify

### Backend

* Render
* Railway
* Other Node.js-compatible hosting platforms

### Database

* MongoDB Atlas

After deployment, update the frontend environment configuration so that the frontend communicates with the deployed backend rather than:

```text
http://localhost:8000
```

---

# 🔗 Deployment Links

After deployment, update these sections:

```text
GitHub Repository:
<your-github-repository-link>

Live Project:
<your-live-project-link>

Backend API:
<your-deployed-backend-url>
```

---

# 🧪 Development Notes

During development, Vite provides Hot Module Replacement (HMR), allowing frontend changes to be reflected quickly in the browser.

Nodemon automatically restarts the backend when backend source files are changed.

Some development-server messages may appear in the terminal. These are normal and do not necessarily indicate errors.

---

# 📝 Important Browser Permissions

MeetHub requires browser permissions for:

* 🎤 Microphone
* 📷 Camera
* 🖥️ Screen sharing

When prompted by the browser, users should allow the required permissions for the meeting features to work correctly.

---

# ⚠️ WebRTC Note

The project currently uses a STUN server for WebRTC:

```text
stun:stun.l.google.com:19302
```

STUN helps browsers discover network information required to establish peer-to-peer connections.

For production environments, a **TURN server** may be required for users who cannot establish a direct peer-to-peer connection because of NAT or firewall restrictions.

---

# 🛣️ Future Improvements

Possible future improvements include:

* 🔐 Improved authentication and token expiration
* 👤 User profiles
* 📅 Meeting scheduling
* 🔗 Meeting invitation links
* 🔒 Meeting passwords
* 👑 Meeting host controls
* 🔇 Mute all participants
* 💾 Persistent chat storage
* 🎥 Meeting recording
* 🖼️ Better participant layouts
* 📱 Improved mobile responsiveness
* 🌐 TURN server integration
* 🗑️ Delete meeting-history entries
* 🔔 Meeting notifications

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

```bash
git clone <your-github-repository-link>
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes and commit:

```bash
git add .
git commit -m "Add your feature"
```

Push your branch:

```bash
git push origin feature/your-feature
```

Then create a Pull Request.

---

# 📄 License

This project is created for educational and development purposes.

If you choose to add a specific open-source license, update this section accordingly.

---

# 👨‍💻 Author

**MeetHub**

Real-time video conferencing application built using React, Node.js, Express, MongoDB, Socket.IO, WebRTC, and Material UI.

---

## ⭐ Project Highlights

The main technologies and concepts demonstrated by this project are:

* React component-based architecture
* React Context API
* REST API development
* MVC-inspired backend architecture
* MongoDB and Mongoose
* MongoDB Atlas
* Password hashing with bcrypt
* Token-based authentication
* WebRTC peer-to-peer communication
* Socket.IO real-time communication
* Real-time chat
* Screen sharing
* Vite development environment
* Material UI
* Responsive frontend development
* Nodemon backend development
