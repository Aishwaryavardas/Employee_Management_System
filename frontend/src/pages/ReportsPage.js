// frontend/src/pages/ReportsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ReportsPage = ({ isDark }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/employees", {
          params: { limit: 10000 }, // pull all for reports
        });
        setEmployees(res.data.employees || []);
      } catch (err) {
        console.error(err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Aggregate by department
  const departmentStats = employees.reduce((acc, emp) => {
    const dept = emp.department || "Other";
    const salary = Number(emp.salary) || 0;

    if (!acc[dept]) {
      acc[dept] = {
        count: 0,
        totalSalary: 0,
        maxSalary: 0,
      };
    }
    acc[dept].count += 1;
    acc[dept].totalSalary += salary;
    if (salary > acc[dept].maxSalary) acc[dept].maxSalary = salary;

    return acc;
  }, {});

  const deptNames = Object.keys(departmentStats);
  const counts = deptNames.map((d) => departmentStats[d].count);
  const avgSalaries = deptNames.map((d) =>
    departmentStats[d].count
      ? Math.round(departmentStats[d].totalSalary / departmentStats[d].count)
      : 0
  );

  const headcountData = {
    labels: deptNames,
    datasets: [
      {
        label: "Employees",
        data: counts,
        backgroundColor: "rgba(6, 182, 212, 0.7)",
        borderColor: "rgba(6, 182, 212, 1)",
        borderWidth: 1,
      },
    ],
  };

  const avgSalaryData = {
    labels: deptNames,
    datasets: [
      {
        label: "Average Salary (₹)",
        data: avgSalaries,
        backgroundColor: "rgba(37, 99, 235, 0.7)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // bar raising animation
  const barAnimation = {
    animation: {
      duration: 900,
      easing: "easeOutQuart",
      delay: (ctx) => (ctx.dataIndex || 0) * 80,
    },
  };

  // colors depending on theme
  const cardBg = isDark ? "#0b1120" : "#ffffff";
  const cardBorder = isDark ? "#111827" : "#e5e7eb";
  const titleColor = isDark ? "#e5e7eb" : "#111827";
  const textMuted = isDark ? "#9ca3af" : "#6b7280";
  const tableHeaderBg = isDark ? "#020617" : "#e5f6f9";
  const tableBorder = isDark ? "#1f2937" : "#d1d5db";

  return (
  <div
  style={{
    padding: "12px 24px",
    maxWidth: 1100,
    margin: "60px auto 80px",
  }}
>


  <h2
  style={{
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
    color: isDark ? "#000000" : "#000000",
  }}
>
  Employee Reports
</h2>


<p
  style={{
    fontSize: 13,
    color: isDark ? "#000000" : "#000000",
    marginBottom: 16,
  }}
>
  Quick analytics of headcount and salary trends across departments.
</p>




      {loading ? (
        <p style={{ fontSize: 14, color: textMuted }}>Loading reports...</p>
      ) : employees.length === 0 ? (
        <p style={{ fontSize: 14, color: textMuted }}>
          No employee data available for reports.
        </p>
      ) : (
        <>
          {/* Charts row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
              marginBottom: 16,
            }}
          >
            {/* Headcount chart */}
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 14,
                boxShadow: isDark
                  ? "0 12px 28px rgba(0,0,0,0.8)"
                  : "0 8px 18px rgba(15,23,42,0.06)",
                border: `1px solid ${cardBorder}`,
                height: 230,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  marginBottom: 6,
                  fontWeight: 600,
                  color: titleColor,
                }}
              >
                Employees per Department
              </h3>
              <Bar
                data={headcountData}
                height={185}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  ...barAnimation,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      ticks: {
                        font: { size: 10 },
                        color: textMuted,
                      },
                      grid: { display: false },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                        font: { size: 10 },
                        color: textMuted,
                      },
                      grid: {
                        color: isDark ? "#1f2937" : "#e5e7eb",
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Average salary chart */}
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 14,
                boxShadow: isDark
                  ? "0 12px 28px rgba(0,0,0,0.8)"
                  : "0 8px 18px rgba(15,23,42,0.06)",
                border: `1px solid ${cardBorder}`,
                height: 230,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  marginBottom: 6,
                  fontWeight: 600,
                  color: titleColor,
                }}
              >
                Average Salary by Department
              </h3>
              <Bar
                data={avgSalaryData}
                height={185}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  ...barAnimation,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      ticks: {
                        font: { size: 10 },
                        color: textMuted,
                      },
                      grid: { display: false },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: { size: 10 },
                        color: textMuted,
                        callback: (value) =>
                          "₹ " + Number(value).toLocaleString("en-IN"),
                      },
                      grid: {
                        color: isDark ? "#1f2937" : "#e5e7eb",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Summary table */}
          <div
            style={{
              backgroundColor: cardBg,
              borderRadius: 16,
              padding: 14,
              boxShadow: isDark
                ? "0 12px 28px rgba(0,0,0,0.8)"
                : "0 8px 18px rgba(15,23,42,0.06)",
              border: `1px solid ${cardBorder}`,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = isDark
                ? "0 16px 36px rgba(0,0,0,0.95)"
                : "0 10px 22px rgba(15,23,42,0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = isDark
                ? "0 12px 28px rgba(0,0,0,0.8)"
                : "0 8px 18px rgba(15,23,42,0.06)";
            }}
          >
            <h3
              style={{
                fontSize: 14,
                marginBottom: 6,
                fontWeight: 600,
                color: titleColor,
              }}
            >
              Department Summary
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
                color: titleColor,
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: tableHeaderBg,
                    borderBottom: `1px solid ${tableBorder}`,
                  }}
                >
                  <th style={thCell}>Department</th>
                  <th style={thCell}>Employees</th>
                  <th style={thCell}>Average Salary (₹)</th>
                  <th style={thCell}>Highest Salary (₹)</th>
                </tr>
              </thead>
              <tbody>
                {deptNames.map((dept) => (
                  <tr key={dept}>
                    <td style={tdCell}>{dept}</td>
                    <td style={tdCell}>{departmentStats[dept].count}</td>
                    <td style={tdCell}>
                      ₹{" "}
                      {Math.round(
                        departmentStats[dept].totalSalary /
                          departmentStats[dept].count
                      ).toLocaleString("en-IN")}
                    </td>
                    <td style={tdCell}>
                      ₹{" "}
                      {departmentStats[dept].maxSalary.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const thCell = {
  textAlign: "left",
  padding: "8px 10px",
  fontWeight: 600,
};

const tdCell = {
  textAlign: "left",
  padding: "8px 10px",
  borderTop: "1px solid #e5e7eb",
};

export default ReportsPage;
