// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmployeeListPage from "./pages/EmployeeListPage";
import AddEditEmployeePage from "./pages/AddEditEmployeePage";
import AddEmployeePage from "./pages/AddEmployeePage";
import ReportsPage from "./pages/ReportsPage"; // ADD THIS

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    // this .dark class drives all your dark styles
    <div className={darkMode ? "dark" : ""}>
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
          <Route path="/employees/edit/:id" element={<AddEditEmployeePage />} />
          <Route path="/edit/:id" element={<AddEditEmployeePage />} />
          <Route path="/employees/add" element={<AddEmployeePage />} />
          <Route path="/employees/add-csv" element={<AddEmployeePage />} />
          {/* NEW: reports with dark mode */}
          <Route
            path="/reports"
            element={<ReportsPage isDark={darkMode} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
