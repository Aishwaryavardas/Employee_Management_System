// backend/config/db.js
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // your MySQL username
  password: 'Aishui@123', // your MySQL password
  database: 'ems'
});
module.exports = pool.promise();