// MySQL connection configuration
import mysql from 'mysql';

const connection_alfred = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // Convert the port to a number
    user: process.env.DB_USER_ALFRED,
    password: process.env.DB_PASSWORD_ALFRED,
    database: process.env.DB_DATABASE_ALFRED
  });

// Connect to MySQL database
connection_alfred.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database ALFRED:', err);
  } else {
    console.log('Connected to MySQL database ALFRED');
  }
});

export default connection_alfred