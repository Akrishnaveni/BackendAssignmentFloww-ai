const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./expenseTracker.db");
const bcrypt = require("bcryptjs");

// Create tables
db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);

  db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            type TEXT,
            category TEXT,
            amount REAL,
            date TEXT,
            description TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);

  db.run(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            type TEXT
        )
    `);

  const hashedPassword = bcrypt.hashSync("password123", 8); // Simple password hash for testing
  db.run(`
        INSERT INTO users (username, password)
        VALUES ('Krishna',${hashedPassword})`);

  // Insert sample data into Categories table
  db.run(`INSERT INTO categories (name, type) VALUES ('Salary', 'income')`);
  db.run(`INSERT INTO categories (name, type) VALUES ('Food', 'expense')`);
  db.run(
    `INSERT INTO categories (name, type) VALUES ('Entertainment', 'expense')`
  );
  db.run(`INSERT INTO categories (name, type) VALUES ('Freelance', 'income')`);

  // Insert sample data into Transactions table
  db.run(`
        INSERT INTO transactions (user_id, type, category, amount, date, description)
        VALUES (1, 'income', 'Salary', 3000.00, '2024-10-01', 'October Salary')
    `);
  db.run(`
        INSERT INTO transactions (user_id, type, category, amount, date, description)
        VALUES (2, 'expense', 'Food', 50.00, '2024-10-02', 'Lunch with colleagues')
    `);
  db.run(`
        INSERT INTO transactions (user_id, type, category, amount, date, description)
        VALUES (3, 'expense', 'Entertainment', 100.00, '2024-10-03', 'Movie tickets')
    `);
  db.run(`
        INSERT INTO transactions (user_id, type, category, amount, date, description)
        VALUES (4, 'income', 'Freelance', 1500.00, '2024-10-04', 'Freelance project payment')
    `);
});

module.exports = db;
