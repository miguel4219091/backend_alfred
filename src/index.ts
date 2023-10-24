import express from 'express';
import mysql from 'mysql';

const app = express();

// middleware
app.use(express.json());

// MySQL connection configuration
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// API endpoint for ping
app.get('/ping', (_req, res) => {
  // Perform a simple query to the MySQL database
  connection.query('SELECT * from users', (err, rows) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const result = rows[0].result;
      res.send(`Ping successful. Result: ${result}`);
    }
  });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
