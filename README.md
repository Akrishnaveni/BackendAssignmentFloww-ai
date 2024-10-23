# Personal Expense Tracker

## Project Overview

The Personal Expense Tracker is a RESTful API built using Node.js and Express.js, designed to help users manage their financial records. This API allows users to record their income and expenses, retrieve past transactions, and get summaries by category or time period. The data is stored in a SQLite database for simplicity.

## Features

- User registration and authentication using JWT (JSON Web Token).
- CRUD operations for managing transactions.
- Summary of transactions to view total income, total expenses, and balance.

## Technologies Used

- Node.js
- Express.js
- SQLite
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

## Setup Instructions

1. Clone the repository:

   git clone <repository-url>
   cd expense-tracker

2. Install dependencies:
   npm install

3. Start the server::
   node app.js

4. The server will run on http://localhost:3000 .

Response
[
{
playerId: 1,
playerName: "Lakshman",
jerseyNumber: 5,
role: "All-rounder"
},

...
]

## API Endpoints

# User Registration

path:"/register"
Description: Register a new user.
Request Body:
{
"username": "your_username",
"password": "your_password"
}
Response: Returns the user ID upon successful registration.

# User Login

path: "/login"
Description: Log in a user and receive a JWT token for authentication.
Request Body:
{
"username": "your_username",
"password": "your_password"
}
Response: Returns a token that must be included in subsequent requests.

# Add a New Transaction

path: "/transactions"
Description: Add a new income or expense transaction.
Headers:
Authorization: Bearer <token>
Request Body:

{
"type": "income" or "expense",
"category": "category_name",
"amount": 100.00,
"date": "YYYY-MM-DD",
"description": "Transaction description"
}
Response: Returns the ID of the newly created transaction.

# Get All Transactions

path: "/transactions"
Description: Retrieve all transactions for the authenticated user.
Headers:
Authorization: Bearer <token>
Response: Returns an array of transactions.

# Get a Transaction by ID

path: "/transactions/:id"
Description: Retrieve a specific transaction by its ID.
Headers:
Authorization: Bearer <token>
Response: Returns the transaction details.

# Update a Transaction

Endpoint: "/transactions/:id"
Description: Update an existing transaction by its ID.
Headers:
Authorization: Bearer <token>
Request Body:
{
"type": "income" or "expense",
"category": "category_name",
"amount": 100.00,
"date": "YYYY-MM-DD",
"description": "Updated transaction description"
}
Response: Returns a success message.

# Delete a Transaction

Endpoint: DELETE /transactions/:id
Description: Delete a specific transaction by its ID.
Headers:
Authorization: Bearer <token>
Response: Returns a success message.

# Get Summary of Transactions

Endpoint: GET /summary
Description: Retrieve a summary of transactions including total income, total expenses, and balance.
Headers:
Authorization: Bearer <token>
Response: Returns an object with total income, total expenses, and balance.
