
# QuickPoll MERN MVP

A minimal real-time polling app built with the MERN stack (MongoDB, Express, React, Node.js) and Vite.

## Features

- Create polls with multiple options
- Vote on options in real-time (using Socket.IO)
- See live updates of poll results
- Environment variables support for backend and frontend

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB running locally or a MongoDB URI

### Installation

1. **Clone the repo:**

    ```bash
    git clone https://github.com/ardidrizi/quickpoll-mern-mvp.git
    cd quickpoll-mern-mvp
    ```

2. **Setup and start the backend:**

    ```bash
    cd server
    npm install
    ```

    Create a `.env` file in the `server` directory with the following variables:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/quickpoll
    ```

    Start the backend server:

    ```bash
    node index.js
    ```

3. **Setup and start the frontend:**

    Open a new terminal window/tab, then:

    ```bash
    cd client
    npm install
    ```

    Create a `.env` file in the `client` directory with the following variable:

    ```env
    VITE_API_URL=http://localhost:5000
    ```

    Start the frontend development server:

    ```bash
    npm run dev
    ```

4. **Access the app:**

    Open your browser and go to [http://localhost:5173](http://localhost:5173)

## Usage

- Create a poll by entering a question and multiple options.
- Share the poll URL with others.
- Vote and watch the results update live for all connected clients.

## License

MIT
