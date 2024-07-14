const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection pool setup
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'refer_info_db'
});

// Test the database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the MySQL database.');
    connection.release(); 
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

// post refer info to database
app.post("/refer_info", async (req, res) => {
    console.log(req.body);
    const { name, email, refereeName, refereeEmail } = req.body;
  
    try {
      const [result] = await pool.query(
        "INSERT INTO refer_info (Name, Email, refereeName, refereeEmail) VALUES (?, ?, ?, ?)",
        [name, email, refereeName, refereeEmail]
      );
  
      res.status(201).json({ message: "Data inserted successfully", id: result.insertId });
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Database query failed' });
    }
  });



// query the database from refer_info table
app.get("/refer-info", async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM refer_info');
    res.json(rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = pool;
