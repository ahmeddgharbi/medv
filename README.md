# Firebase Cloud Functions Session Backend

This project implements a scalable session management backend using **Firebase Cloud Functions** and **Firestore**. It is built with **TypeScript** and follows a Clean Architecture approach to ensure code quality and maintainability.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project created in the [Firebase Console](https://console.firebase.google.com/)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone <your-github-repo-url>
    cd firbasesetup
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Firebase Initialization**:
    - Login to Firebase: `firebase login`
    - Connect to your project: `firebase use <your-project-id>`

### Local Development (Emulator)
To run the functions locally without deploying:

```bash
# Start the emulator
firebase emulators:start
```

> **⚠️ Security & Testing**:
> This project uses a secure environment variable approach for testing without a frontend.
>
> **1. Local Development**:
> Create a `.env` file in the root directory (this file is gitignored):
> ```env
> DEMO_TOKEN=your-secret-token
> ```
> When running locally, you can use `Authorization: Bearer your-secret-token` to bypass Firebase Auth.
>
> **2. Production**:
> Verification is strictly enforced. However, if you need to enable the demo access in production temporarily, ensure the environment variable is set in the Cloud Console, otherwise, it defaults to strict real-user verification only.

## 🛠 Deployment

To deploy the functions to your live Firebase project:

1.  **Build the project**:
    ```bash
    npm run build
    ```
2.  **Deploy**:
    ```bash
    firebase deploy --only functions
    ```

## 📚 API Documentation

All endpoints require a valid Firebase Auth ID Token in the `Authorization` header (Format: `Bearer <token>`) when deployed.

### 1. Create Session
Creates a new session.

- **Endpoint**: `POST /createSession`
- **Body**:
  ```json
  {
    "region": "us-east"
  }
  ```
- **Response**:
  ```json
  {
    "sessionId": "uuid-string",
    "region": "us-east",
    "status": "pending",
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```

### 2. Get Session
Retrieves details of a specific session.

- **Endpoint**: `GET /getSession?sessionId=<id>`
- **Query Params**: `sessionId` (required)

### 3. Update Session Status
Updates the status of an existing session.

- **Endpoint**: `POST /updateSessionStatus`
- **Body**:
  ```json
  {
    "sessionId": "uuid-string",
    "status": "active" 
  }
  ```
- **Valid Statuses**: `pending`, `active`, `completed`, `failed`

### 4. List Sessions (⭐ Bonus Feature)
I have included this extra endpoint to allow listing sessions with optional filtering.

- **Endpoint**: `GET /listSessions`
- **Query Params**:
  - `status`: Filter by status (e.g., `completed`)
  - `region`: Filter by region (e.g., `us-east`)

## 📝 Design Decisions

- **Architecture**: Used a Clean Architecture approach where business logic is decoupled from Firebase triggers.
- **Validation**: Lightweight manual validation to improve performance (cold starts).
- **TypeScript**: Strictly typed implementation for reliability.
