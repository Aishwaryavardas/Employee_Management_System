// frontend/src/pages/EmployeeListPage.js

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaLaptopCode,
  FaUserTie,
  FaMoneyBillWave,
  FaDownload,
  FaMoon,
  FaSun,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import logo from "../assets/logo.png";
import Navbar from "../components/NavBar";

const PRIMARY = "#0b1120"; // deep navy
const ACCENT = "#06b6d4";  // teal

const EmployeeListPage = ({ onToggleTheme, isDark }) => {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [byDepartment, setByDepartment] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);

  // theme variables
  const bgColor = isDark ? PRIMARY : "#f3f4f6";
  const surfaceColor = isDark ? "#020617" : "#ffffff";
  const textPrimary = isDark ? "#f9fafb" : "#000000";
  const textSecondary = isDark ? "#9ca3af" : "#374151";
  const borderColor = isDark ? "rgba(148,163,184,0.5)" : "#d1d5db";
  const tableHeaderBg = isDark ? PRIMARY : "#e5f6f9";
  const inputBg = isDark ? "#020617" : "#ffffff";
  const labelColor = isDark ? "#e5e7eb" : "#000000";
  const helperColor = isDark ? textSecondary : "#4b5563";

  const navigate = useNavigate();
  const tableRef = useRef(null);

  const scrollToTable = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, [search, page, sort, order]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/employees", {
        params: { search, page, limit, sort, order },
      });
      setEmployees(res.data.employees || []);
      setTotal(res.data.total || 0);
      setByDepartment(res.data.byDepartment || {});
    } catch (err) {
      console.error(err);
      setEmployees([]);
      setTotal(0);
      setByDepartment({});
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
  };

  const getDeptIcon = (dept) => {
    if (dept === "IT") return <FaLaptopCode color={ACCENT} />;
    if (dept === "HR") return <FaUserTie color={ACCENT} />;
    if (dept === "Finance") return <FaMoneyBillWave color={ACCENT} />;
    return <FaUsers color={ACCENT} />;
  };

  const handleExport = () => {
    if (!employees.length) return;
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "employees.xlsx");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      await fetchEmployees();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error deleting employee");
    }
  };

  const totalDepartments = Object.keys(byDepartment).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor,
        color: textPrimary,
        display: "flex",
        flexDirection: "column",
        fontSize: 15,
      }}
    >
      {/* Blended fixed header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 32px",
          background:
            "linear-gradient(90deg, rgba(11,17,32,0.96) 0%, rgba(6,182,212,0.92) 70%)",
          boxShadow: "0 10px 26px rgba(15,23,42,0.45)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Left: logo + title and tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: 40,
              objectFit: "contain",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
            }}
          />

          <div
            style={{
              borderLeft: "1px solid rgba(226,232,240,0.55)",
              height: 34,
            }}
          />

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#f9fafb",
              }}
            >
              Employee Management
            </h1>
            <p
              style={{
                margin: 0,
                marginTop: 2,
                fontSize: 13,
                color: "rgba(226,232,240,0.92)",
              }}
            >
              Empowering Acquant HR to manage people with clarity, speed and
              confidence.
            </p>
          </div>
        </div>

        {/* Right: navbar + theme toggle + add employee */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Navbar />

          <button
            onClick={onToggleTheme}
            style={{
              border: "1px solid rgba(148,163,184,0.75)",
              borderRadius: 999,
              backgroundColor: "rgba(15,23,42,0.55)",
              color: "#e5e7eb",
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {isDark ? <FaSun /> : <FaMoon />}
            <span>{isDark ? "Light" : "Dark"} mode</span>
          </button>

          <button
            onClick={() => setShowAddOptions((prev) => !prev)}
            style={{
              borderRadius: 999,
              border: "none",
              backgroundColor: "#f9fafb",
              color: "#0b1120",
              padding: "9px 20px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 15,
              boxShadow: "0 4px 10px rgba(15,23,42,0.35)",
            }}
          >
            + Add Employee
          </button>

          {showAddOptions && (
            <div
              style={{
                position: "absolute",
                top: 72,
                right: 32,
                backgroundColor: "#020617",
                borderRadius: 12,
                boxShadow: "0 10px 25px rgba(15,23,42,0.8)",
                padding: 8,
                zIndex: 30,
              }}
            >
              <button
                onClick={() => navigate("/employees/add")}
                style={menuItemStyle}
              >
                Add manually
              </button>
              <button
                onClick={() => navigate("/employees/add-csv")}
                style={menuItemStyle}
              >
                Upload CSV / Excel
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content (pushed down for fixed header) */}
      <main
        style={{
          padding: "24px 32px",
          maxWidth: 1200,
          margin: "90px auto 0",
          width: "100%",
          flex: 1,
        }}
      >
        {/* Summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <StatCard
            icon={<FaUsers />}
            label="Total Employees"
            value={total}
            helper="Across all departments"
            surfaceColor={surfaceColor}
            borderColor={borderColor}
            textPrimary={textPrimary}
            textSecondary={helperColor}
            labelColor={labelColor}
            isDark={isDark}
          />

          <StatCard
            icon={<FaLaptopCode />}
            label="Departments"
            value={totalDepartments}
            helper="Active departments in system"
            surfaceColor={surfaceColor}
            borderColor={borderColor}
            textPrimary={textPrimary}
            textSecondary={helperColor}
            labelColor={labelColor}
            isDark={isDark}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            whileHover={{
              y: -3,
              boxShadow: isDark
                ? "0 16px 36px rgba(0,0,0,0.9)"
                : "0 14px 30px rgba(15,23,42,0.16)",
            }}
            style={{
              borderRadius: 20,
              padding: 18,
              backgroundColor: surfaceColor,
              border: `1px solid ${borderColor}`,
              boxShadow: isDark
                ? "0 10px 25px rgba(15,23,42,0.6)"
                : "0 8px 18px rgba(15,23,42,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 14, color: textSecondary }}>
                Export
              </span>
              <FaDownload color={ACCENT} />
            </div>
            <button
              onClick={handleExport}
              style={{
                marginTop: 4,
                padding: "7px 12px",
                borderRadius: 999,
                border: `1px solid ${borderColor}`,
                backgroundColor: bgColor,
                color: textPrimary,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Download Excel
            </button>
          </motion.div>
        </div>

        {/* Search and scroll controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            style={{
              flex: "1 1 260px",
              minWidth: 0,
              padding: "9px 14px",
              borderRadius: 999,
              border: `1px solid ${borderColor}`,
              backgroundColor: inputBg,
              color: textPrimary,
              fontSize: 14,
            }}
          />

          <button
            onClick={scrollToTable}
            style={{
              borderRadius: 999,
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              color: textPrimary,
              padding: "9px 16px",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Jump to table
          </button>
        </div>

        {/* Table */}
        <section
          ref={tableRef}
          style={{
            borderRadius: 16,
            backgroundColor: surfaceColor,
            border: `1px solid ${borderColor}`,
            boxShadow: isDark
              ? "0 12px 30px rgba(15,23,42,0.7)"
              : "0 10px 25px rgba(15,23,42,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 14,
              borderBottom: `1px solid ${borderColor}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 15,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 17, color: textPrimary }}>
              Employees
            </h2>
            <span style={{ fontSize: 13, color: textSecondary }}>
              Page {page} • {employees.length} records
            </span>
          </div>

          {loading ? (
            <div style={{ padding: 24, textAlign: "center", fontSize: 15 }}>
              Loading employees...
            </div>
          ) : employees.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", fontSize: 15 }}>
              No employees found.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: tableHeaderBg,
                      borderBottom: `2px solid ${ACCENT}`,
                    }}
                  >
                    <th
                      style={{ ...thStyle, color: textPrimary }}
                      onClick={() => handleSort("name")}
                    >
                      Name
                    </th>
                    <th
                      style={{ ...thStyle, color: textPrimary }}
                      onClick={() => handleSort("email")}
                    >
                      Email
                    </th>
                    <th style={{ ...thStyle, color: textPrimary }}>Phone</th>
                    <th
                      style={{ ...thStyle, color: textPrimary }}
                      onClick={() => handleSort("department")}
                    >
                      Department
                    </th>
                    <th
                      style={{ ...thStyle, color: textPrimary }}
                      onClick={() => handleSort("salary")}
                    >
                      Salary
                    </th>
                    <th
                      style={{ ...thStyle, color: textPrimary, cursor: "default" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      style={{
                        borderTop: `1px solid ${borderColor}`,
                        backgroundColor: isDark
                          ? "transparent"
                          : index % 2 === 0
                          ? "#f5fbfd"
                          : "#ffffff",
                      }}
                    >
                      <td
                        style={{
                          ...tdStyle,
                          color: textPrimary,
                          fontWeight: 600,
                        }}
                      >
                        {emp.name}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: textPrimary,
                          fontSize: 14,
                        }}
                      >
                        {emp.email}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: textPrimary,
                          fontSize: 14,
                        }}
                      >
                        {emp.phone}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: textPrimary,
                          fontSize: 14,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {getDeptIcon(emp.department)}
                          <span>{emp.department}</span>
                        </div>
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: textPrimary,
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        ₹ {Number(emp.salary).toLocaleString()}
                      </td>
                      <td style={{ ...tdStyle, color: textPrimary }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Link
                            to={`/employees/edit/${emp.id}`}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 999,
                              backgroundColor: ACCENT,
                              color: PRIMARY,
                              fontSize: 13,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <FaEdit />
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(emp.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 999,
                              border: "1px solid rgba(248,113,113,0.9)",
                              backgroundColor: "transparent",
                              color: "#b91c1c",
                              fontSize: 13,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              cursor: "pointer",
                            }}
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Simple pagination */}
          <div
            style={{
              padding: 14,
              borderTop: `1px solid ${borderColor}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                padding: "7px 12px",
                borderRadius: 999,
                border: `1px solid ${borderColor}`,
                backgroundColor: bgColor,
                color: textPrimary,
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.5 : 1,
                fontSize: 14,
              }}
            >
              Previous
            </button>
            <span style={{ color: textSecondary, fontSize: 14 }}>
              Page {page}
            </span>
            <button
              disabled={employees.length < limit}
              onClick={() =>
                setPage((p) => (employees.length < limit ? p : p + 1))
              }
              style={{
                padding: "7px 12px",
                borderRadius: 999,
                border: `1px solid ${borderColor}`,
                backgroundColor: bgColor,
                color: textPrimary,
                cursor: employees.length < limit ? "not-allowed" : "pointer",
                opacity: employees.length < limit ? 0.5 : 1,
                fontSize: 14,
              }}
            >
              Next
            </button>
          </div>
        </section>
      </main>

      {/* Footer with clickable links */}
      <footer
        style={{
          marginTop: 16,
          background: "linear-gradient(90deg, #0b1120 0%, #06b6d4 80%)",
          color: "#f9fafb",
          padding: "10px 24px 12px",
          fontSize: 12,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              rowGap: 4,
              columnGap: 16,
            }}
          >
            <strong style={{ fontSize: 13 }}>
              Acquant HR Services Private Limited
            </strong>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span>CIN: U74909KA2025PTC201756</span>

              <a
                href="mailto:info@acquanthr.com"
                style={{ color: "#f9fafb", textDecoration: "underline" }}
              >
                info@acquanthr.com
              </a>

              <a
                href="https://www.acquanthr.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#f9fafb", textDecoration: "underline" }}
              >
                www.acquanthr.com
              </a>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: 2,
            }}
          >
            <span>
              <strong>Registered Office:</strong> #156, 'Sampige', 1st Block,
              Sir M Vishweshwariaha Layout, Kengeri Satellite Town, Bengaluru –
              560060
            </span>
            <span>
              <strong>Corporate Office:</strong> No.170, Manish Arcade, 1st
              Floor, 1st Stage, 3rd Block, Nagarabhavi, Bengaluru – 560072
            </span>
          </div>

          <div
            style={{
              marginTop: 4,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              rowGap: 4,
            }}
          >
            <span>
              © {new Date().getFullYear()} Acquant HR Services Private Limited
            </span>
            <span style={{ opacity: 0.9 }}>All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  helper,
  surfaceColor,
  borderColor,
  textPrimary,
  textSecondary,
  labelColor,
  isDark,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{
      y: -4,
      boxShadow: isDark
        ? "0 18px 40px rgba(0,0,0,0.95)"
        : "0 16px 36px rgba(15,23,42,0.16)",
    }}
    transition={{ duration: 0.22 }}
    style={{
      position: "relative",
      overflow: "hidden",
      borderRadius: 20,
      padding: 20,
      background: isDark
        ? "linear-gradient(135deg, #020617, #0b1120)"
        : "linear-gradient(135deg, #ffffff, #e5f6f9)",
      border: `1px solid ${borderColor}`,
      boxShadow: isDark
        ? "0 16px 40px rgba(15,23,42,0.8)"
        : "0 14px 35px rgba(15,23,42,0.10)",
      backdropFilter: "blur(8px)",
      cursor: "pointer",
    }}
  >
    <div
      style={{
        position: "absolute",
        right: -30,
        top: -30,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: `radial-gradient(circle at center, ${ACCENT}33, transparent 60%)`,
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 6,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontSize: 13,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            color: labelColor, // stronger in light mode
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: textPrimary,
            lineHeight: 1.1,
          }}
        >
          {value}
        </span>
      </div>

      <div
        style={{
          minWidth: 42,
          minHeight: 42,
          borderRadius: 999,
          background: isDark ? "#020617" : "#dbeafe",
          border: `1px solid ${ACCENT}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: ACCENT,
          boxShadow: isDark
            ? "0 8px 18px rgba(15,23,42,0.9)"
            : "0 8px 18px rgba(15,23,42,0.15)",
        }}
      >
        <div style={{ fontSize: 20 }}>{icon}</div>
      </div>
    </div>

    <p
      style={{
        margin: 0,
        fontSize: 13,
        color: textSecondary,
      }}
    >
      {helper}
    </p>
  </motion.div>
);

const menuItemStyle = {
  display: "block",
  width: "100%",
  padding: "8px 12px",
  background: "transparent",
  border: "none",
  color: "#e5e7eb",
  textAlign: "left",
  cursor: "pointer",
  fontSize: 14,
};

const thStyle = {
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "10px 12px",
  fontSize: 14,
  whiteSpace: "nowrap",
};

export default EmployeeListPage;
