Short Description
A full-stack Employee Management System (EMS) built using:

Frontend: React

Backend: Node.js + Express

Database: MySQL

Features
Employee CRUD (Create, Read, Update, Delete)

Client- and server-side validation

Unique email per employee with friendly duplicate-email message

Search by name or email

Sorting on multiple columns (name, email, department, salary)

Pagination

Department-wise summary (total employees, number of departments)

Department icons (IT, HR, Finance, Marketing, Sales)

Export employees to Excel

Bulk upload employees from Excel/CSV

Light/Dark mode theme with animated stat cards

Company footer with registered and corporate office details

Screenshots
Place your screenshots in docs/images/ and update the filenames below.

Dashboard / Employee List
![Home Page] ems\images\docs\HomePage.png

![Reports Page](ems\images\docs\ReportsPage.png

![Bulk Upload screenshot](docs/images/bulk_upload.png / Summary

![Employee Table](ems\images\docs\EmployeeTable.png

Repository Structure (Top Level)
text
ems-application/
  backend/              → Node/Express API (MySQL)
  frontend/             → React frontend
  docs/
    images/             → Screenshots used by README
  README.md             → Project documentation
Backend (inside backend/)
text
backend/
  app.js                → Express app entry
  db.js                 → MySQL connection pool
  models/
    employee.js         → Employee model & queries
  controllers/
    employeeController.js → CRUD, search, bulk upload, validation
  routes/
    employeeRoutes.js   → /employees routes
  package.json
Frontend (inside frontend/)
text
frontend/
  src/
    App.js              → Routing & theme toggle
    components/
      NavBar.js
      SearchBar.js
      EmployeeTable.js
      Pagination.js
      DepartmentChart.js
    pages/
      Dashboard.js
      EmployeeListPage.js
      AddEmployeePage.js
      AddEditEmployeePage.js
      ReportsPage.js
    assets/
      logo.png
  package.json
Quick Start (Development)
1. Start the Backend
bash
cd backend
npm install
Configure MySQL in backend/db.js:

js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",          // your MySQL user
  password: "password",  // your MySQL password
  database: "ems",       // created DB
});

module.exports = pool;
Create database and table:

sql
CREATE DATABASE ems;
USE ems;

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  department VARCHAR(50) NOT NULL,
  salary DECIMAL(15,2) NOT NULL
);
Run the backend:

bash
npm start
Backend will run at:

text
http://localhost:5000
2. Start the Frontend
bash
cd frontend
npm install
npm start
Frontend will run at:

text
http://localhost:3000
Make sure API URLs in the React code (for example in EmployeeListPage.js, AddEmployeePage.js, AddEditEmployeePage.js) point to http://localhost:5000.

Important Notes
The backend is the source of truth for:

Employee data

Email uniqueness

Salary values and validation

The frontend handles:

Form UI and basic validation (lengths, formats)

Theme toggle and animations

UX features like checkmark for valid email and smooth scrolling

Bulk upload:

Accepts .xlsx, .xls, .csv

Skips invalid or duplicate rows and continues with valid ones

Duplicate email:

Backend checks MySQL error ER_DUP_ENTRY

Returns a custom message like:
“Please enter a valid email ID. The given email ID already exists.”

Future Improvements
Add authentication and role-based access (Admin / HR)

Add profile photos for employees

More detailed reports and charts (salary ranges, department trends)

Export filtered results only

Docker setup for easier deployment

Author
Aishwarya
GitHub: https://github.com/Aishwarya-I