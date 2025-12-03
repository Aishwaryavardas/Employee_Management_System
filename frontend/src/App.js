// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeListPage from './pages/EmployeeListPage';
import AddEditEmployeePage from './pages/AddEditEmployeePage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'bg-dark text-light min-vh-100' : 'bg-light text-dark min-vh-100'}>
      <button
        className="btn btn-outline-secondary m-2"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeListPage />} />
        <Route path="/add" element={<AddEditEmployeePage />} />
        <Route path="/edit/:id" element={<AddEditEmployeePage />} />
      </Routes>
    </Router>
    </div>
  );
}


export default App;