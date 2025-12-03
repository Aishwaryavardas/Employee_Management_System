import React from 'react';
import { Bar } from 'react-chartjs-2';

const DepartmentChart = ({ byDepartment }) => {
  const data = {
    labels: Object.keys(byDepartment),
    datasets: [
      {
        label: 'Employees per Department',
        data: Object.values(byDepartment),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  };

  return <Bar data={data} />;
};

export default DepartmentChart;