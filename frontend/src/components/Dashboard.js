// frontend/src/components/Dashboard.js
import React from 'react';

const Dashboard = ({ total, byDepartment }) => (
  <div>
    <h2>Total Employees: {total}</h2>
    <ul>
      {Object.entries(byDepartment).map(([dept, count]) => (
        <li key={dept}>{dept}: {count}</li>
      ))}
    </ul>
  </div>
);

export default Dashboard;