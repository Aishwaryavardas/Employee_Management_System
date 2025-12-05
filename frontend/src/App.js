// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeListPage from './pages/EmployeeListPage';
import AddEditEmployeePage from './pages/AddEditEmployeePage';
import AddEmployeePage from './pages/AddEmployeePage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    // this class is what your .dark CSS in EmployeeListPage is using
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <EmployeeListPage
                onToggleTheme={() => setDarkMode((prev) => !prev)}
                isDark={darkMode}
              />
            }
          />
          <Route
            path="/employees"
            element={
              <EmployeeListPage
                onToggleTheme={() => setDarkMode((prev) => !prev)}
                isDark={darkMode}
              />
            }
          />
          <Route path="/add" element={<AddEditEmployeePage />} />
          <Route path="/edit/:id" element={<AddEditEmployeePage />} />
          <Route path="/employees/add" element={<AddEmployeePage />} />
          <Route path="/employees/add-csv" element={<AddEmployeePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
