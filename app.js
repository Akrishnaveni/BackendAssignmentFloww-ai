const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const dbpath = path.join(__dirname, "expenseTracker.db");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let db = null;

const intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is running at http://localhost:3000/`);
    });
  } catch (e) {
    console.log(`DbError:${e.message}`);
    process.exit(1);
  }
};
intializeDbAndServer();

const mySecretToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNocmlzdG9waGVyX3BoaWxsaXBzIiwiaWF0IjoxNjkwMDA5OTE4fQ.aSRABmvktCwSSui4_NY45CLmnRY1wX7x5_1irPqx4zc";
const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, mySecretToken, async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  }
};

app.post("/register/", async (request, response) => {
  try {
    const { username, password } = request.body;
    console.log("Username:", username); // Log username for debugging
    const getUserQuery = `select * from user where username='${username}'`;
    const userDBDetails = await db.get(getUserQuery);

    if (userDBDetails !== undefined) {
      response.status(400);
      response.send("User already exists");
    } else {
      if (password.length < 6) {
        response.status(400);
        response.send("Password is too short");
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUserQuery = `insert into user(username,password) values 
            ('${username}','${hashedPassword}')`;
        await db.run(createUserQuery);
        response.send("User created successfully");
      }
    }
  } catch (error) {
    console.error("Error in registration:", error.message);
    response.status(500).send("Server error");
  }
});

// login api
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const dbuser = await db.get(selectUserQuery);
  if (dbuser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbuser.password);
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      };
      let jwtToken = jwt.sign(payload, "mySecretToken");
      response.status(200);
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

//adding new transaction
app.post("/transactions", authenticateToken, (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const addNewTransactionQuery = `INSERT INTO transactions (user_id, type, category, amount, date, description) 
                 VALUES (4, 'expense', 'Entertainment', 500.00, '2024-10-03', 'park visit')`;
  const dnResponse = db.run(addNewTransactionQuery);
  const transactionId = dbresponse.lastId;
});

// get all transactions
app.get("/transactions/user", authenticateToken, async (req, res) => {
  const getTransactionsQuery = `SELECT * FROM transactions`;
  const transactionsArray = await db.all(getTransactionsQuery);
  res.send(transactionsArray);
});

// Get a transaction by ID
app.get("/transactions/:id", authenticateToken, async (req, res) => {
  const sql = `SELECT * FROM transactions WHERE id = ? AND user_id = ?`;
  db.get(sql, [req.params.id, req.user.id], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send("Transaction not found.");
    res.status(200).send(row);
  });
});

// Update a transaction by ID
app.put("/transactions/:id", authenticateToken, (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const sql = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ?
                 WHERE id = ? AND user_id = ?`;
  db.run(
    sql,
    [type, category, amount, date, description, req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      if (this.changes === 0)
        return res.status(404).send("Transaction not found.");
      res.status(200).send("Transaction updated.");
    }
  );
});

// Delete a transaction by ID
app.delete("/transactions/:id", authenticateToken, (req, res) => {
  const sql = `DELETE FROM transactions WHERE id = ? AND user_id = ?`;
  db.run(sql, [req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).send(err.message);
    if (this.changes === 0)
      return res.status(404).send("Transaction not found.");
    res.status(200).send("Transaction deleted.");
  });
});

// Get summary of transactions
app.get("/summary", authenticateToken, (req, res) => {
  const sql = `
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
            (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
             SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) AS balance
        FROM transactions WHERE user_id = ?`;

  db.get(sql, [req.user.id], (err, row) => {
    if (err) return res.status(500).send(err.message);
    res.status(200).send(row);
  });
});
