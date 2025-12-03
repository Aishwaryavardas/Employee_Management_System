// frontend/src/components/EmployeeTable.js
import React from 'react';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      onDelete(id);
    }
  };
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Department</th>
        <th>Salary</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {employees.length === 0 ? (
        <tr>
          <td colSpan="6">No records found</td>
        </tr>
      ) : (
        employees.map(emp => (
          <tr key={emp.id}>
            <td>{emp.name}</td>
            <td>{emp.email}</td>
            <td>{emp.phone}</td>
            <td>{emp.department}</td>
            <td>{emp.salary}</td>
            <td>
              <button onClick={() => onEdit(emp.id)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.id)}>Delete</button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
};

export default EmployeeTable;