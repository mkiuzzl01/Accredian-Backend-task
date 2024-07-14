const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // Use promise-based mysql2
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
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

// Handle form submission
app.post('/api/refer_info', async (req, res) => {
    const { Name, Email, refereeName, refereeEmail } = req.body;
    console.log(req.body);
  
    try {
      const [rows] = await pool.query('INSERT INTO refer_info (Name, Email, refereeName, refereeEmail) VALUES (?, ?, ?, ?)', [Name, Email, refereeName, refereeEmail]);
      res.status(201).send({ message: 'Referral submitted successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred while submitting the referral' });
    }
  });



// Example endpoint to query the database
app.get("/api/data", async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM your_table_name'); // Adjust the query as needed
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
