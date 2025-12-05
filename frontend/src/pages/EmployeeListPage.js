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
} from "react-icons/fa";
import * as XLSX from "xlsx";
import logo from "../assets/logo.png";

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

      setEmployees(res.data.employees);
      setTotal(res.data.total);
      setByDepartment(res.data.byDepartment || {});
    } catch (err) {
      setEmployees([]);
      setTotal(0);
      setByDepartment({});
    }
    setLoading(false);
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
    if (dept === "IT") return <FaLaptopCode size={24} />;
    if (dept === "HR") return <FaUserTie size={24} />;
    if (dept === "Finance") return <FaMoneyBillWave size={24} />;
    return <FaUsers size={22} />;
  };

  const handleDownloadExcel = async () => {
    try {
      const res = await axios.get("http://localhost:5000/employees", {
        params: { search, limit: 10000, sort, order },
      });

      const allEmployees = res.data.employees;

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(
        allEmployees.map((emp) => ({
          ID: emp.id,
          Name: emp.name,
          Email: emp.email,
          Phone: emp.phone,
          Department: emp.department,
          Salary: emp.salary,
        }))
      );

      XLSX.utils.book_append_sheet(wb, ws, "Employees");

      ws["!cols"] = [
        { wch: 8 },
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
      ];

      XLSX.writeFile(
        wb,
        `employees_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (err) {
      console.error(err);
      alert("Error downloading file");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="page-shell">
      {/* NAVBAR / HEADER */}
      <header className="navbar-gradient navbar-shadow">
        <div className="container d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center gap-2">
            <img
              src={logo}
              alt="AcquantHR"
              style={{ height: "40px", objectFit: "contain" }}
            />
            <div>
              <div
                className="fw-bold text-white"
                style={{ letterSpacing: "1px" }}
              >
                AcquantHR
              </div>
              <small className="text-white-50">
                Employee Management Dashboard
              </small>
            </div>
          </div>

          {/* CENTER NAV LINKS */}
          <nav className="top-nav d-none d-md-flex">
            <button type="button" className="top-nav-link active">
              Dashboard
            </button>
            <button type="button" className="top-nav-link">
              Employees
            </button>
            <button type="button" className="top-nav-link">
              Reports
            </button>
            <button type="button" className="top-nav-link">
              Settings
            </button>
          </nav>

          {/* Dark mode toggle with icons */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle-btn"
          >
            {isDark ? (
              <>
                <FaSun style={{ marginRight: 6 }} />
                Light mode
              </>
            ) : (
              <>
                <FaMoon style={{ marginRight: 6 }} />
                Dark mode
              </>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <motion.div
        className="main-content container mt-4 mb-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* HEADER row with search + actions */}
        <div className="d-flex justify-content-between align-items-center mb-3 header-row">
          <h5 className="fw-bold mb-0" style={{ letterSpacing: "1px" }}>
            Employee Dashboard
          </h5>

          <div className="d-flex align-items-center gap-2">
            <input
              className="form-control"
              style={{ maxWidth: "260px" }}
              type="text"
              placeholder="Search by name, email, department"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <button
              type="button"
              className="btn btn-download"
              onClick={handleDownloadExcel}
              title="Download all employees as Excel"
            >
              <FaDownload /> Download
            </button>

            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowAddOptions((prev) => !prev)}
                className="btn-add-employee"
              >
                + Add Employee
              </button>

              {showAddOptions && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px rgba(15,23,42,0.18)",
                    zIndex: 10,
                    minWidth: "190px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                    onClick={() => {
                      setShowAddOptions(false);
                      navigate("/employees/add");
                    }}
                  >
                    Enter manually
                  </button>
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                    onClick={() => {
                      setShowAddOptions(false);
                      navigate("/employees/add-csv");
                    }}
                  >
                    Add CSV file
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TOTAL EMPLOYEES card */}
        <div className="row g-3 mb-3">
          <motion.div
            className="col-12 col-md-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card dashboard-card total-card text-white border-0 h-100">
              <div className="card-body d-flex flex-column justify-content-center align-items-start">
                <div className="mb-2" style={{ fontSize: "2.4rem" }}>
                  <FaUsers />
                </div>
                <h6
                  className="text-uppercase mb-1"
                  style={{ letterSpacing: "0.12em", opacity: 0.9 }}
                >
                  Total Employees
                </h6>
                <p
                  className="display-5 fw-bold mb-0"
                  style={{ lineHeight: 1.1 }}
                >
                  {total}
                </p>
                <small className="mt-1" style={{ opacity: 0.9 }}>
                  Across all departments
                </small>
              </div>
            </div>
          </motion.div>
        </div>

        {/* DEPARTMENT CARDS */}
        <div className="row g-3 mb-4">
          {Object.entries(byDepartment).map(([dept, count], idx) => (
            <motion.div
              className="col-6 col-md-3 col-lg-2"
              key={dept}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
            >
              <div
                className={`card dashboard-card dept-card text-center border-0 dept-${dept.toLowerCase()}`}
              >
                <div className="card-body py-3">
                  <div className="mb-1">{getDeptIcon(dept)}</div>
                  <small
                    className="text-uppercase fw-semibold d-block"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {dept}
                  </small>
                  <span className="h5 fw-bold mb-0">{count}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* STYLES (dark driven by .dark wrapper in App.js) */}
        <style>{`
  :root {
    --primary: #2563eb;      /* blue accent */
    --primary-dark: #1d4ed8;
    --bg-light: #f3f4f6;     /* page background light */
    --bg-surface: #ffffff;   /* card/table background light */
    --text-main: #0f172a;
    --text-muted: #6b7280;

    --bg-dark: #020617;      /* page background dark */
    --surface-dark: #0b1120; /* main surface dark */
  }

  .page-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-light);
  }
  .dark .page-shell {
    background-color: var(--bg-dark);
  }

  /* HEADER – hero bar */
  .navbar-gradient {
    background-image: linear-gradient(90deg, #2563eb, #1d4ed8);
    color: #ffffff;
    border-radius: 0 0 24px 24px;
  }
  .navbar-shadow {
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.35);
  }
  .navbar-gradient .fw-bold {
    font-size: 1.05rem;
  }
  .navbar-gradient small {
    font-size: 0.8rem;
    opacity: 0.9;
  }
  .dark .navbar-gradient {
    background-image: linear-gradient(90deg, #020617, #111827);
    color: #e5e7eb;
  }

  /* TOP NAV LINKS IN HEADER */
  .top-nav {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .top-nav-link {
    background: transparent;
    border: none;
    color: #e5e7eb;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 6px 10px;
    border-radius: 999px;
    cursor: pointer;
    transition: background-color 0.16s ease, color 0.16s ease;
  }

  .top-nav-link:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }

  .top-nav-link.active {
    background-color: #ffffff;
    color: #2563eb;
  }

  .dark .top-nav-link {
    color: #e5e7eb;
  }
  .dark .top-nav-link:hover {
    background-color: rgba(148, 163, 184, 0.25);
  }
  .dark .top-nav-link.active {
    background-color: #ffffff;
    color: #2563eb;
  }

  .theme-toggle-btn {
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.7);
    background-color: rgba(255,255,255,0.1);
    color: #ffffff;
    padding: 4px 14px;
    font-size: 0.8rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    backdrop-filter: blur(8px);
  }
  .theme-toggle-btn:hover {
    background-color: rgba(255,255,255,0.18);
  }

  /* MAIN SURFACE */
  .main-content {
    border-radius: 24px;
    margin-top: 18px;
    padding: 20px 24px 28px 24px;
    color: var(--text-main);
    background-color: var(--bg-surface);
    box-shadow: 0 24px 40px rgba(15, 23, 42, 0.16);
  }
  .dark .main-content {
    color: #e5e7eb;
    background-color: var(--surface-dark);
    box-shadow: 0 24px 50px rgba(0,0,0,0.8);
  }

  /* GENERIC CARDS */
  .dashboard-card {
    border-radius: 20px;
    background-color: var(--bg-surface);
    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
  }
  .dark .dashboard-card {
    background-color: #020617;
    border-color: #111827;
    color: #e5e7eb;
    box-shadow: 0 12px 28px rgba(0,0,0,0.8);
  }

  /* Total employees card – strong blue tile */
  .dashboard-card.total-card {
    background-image: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #ffffff;
    border-color: transparent;
    box-shadow: 0 16px 32px rgba(37, 99, 235, 0.45);
  }
  .dark .dashboard-card.total-card {
    background-image: linear-gradient(135deg, #1d4ed8, #22c55e);
  }

  /* Department cards – white tiles */
  .dashboard-card.dept-card {
    background-color: #ffffff;
    border-color: rgba(148, 163, 184, 0.18);
    color: #0f172a;
  }
  .dark .dashboard-card.dept-card {
    background-color: #ffffff;
    border-color: rgba(148, 163, 184, 0.35);
    color: #0f172a;
  }

  .dashboard-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 32px rgba(15, 23, 42, 0.20);
  }
  .dark .dashboard-card:hover {
    box-shadow: 0 18px 40px rgba(0,0,0,0.9);
  }

  /* BUTTONS – flat and clean */
  .btn-download {
    background-color: #eef2ff;
    color: #1d4ed8;
    border-radius: 999px;
    border: 1px solid #e0e7ff;
    padding-inline: 14px;
    font-weight: 500;
  }
  .btn-download:hover {
    background-color: #e0e7ff;
  }
  .dark .btn-download {
    background-color: #111827;
    color: #e5e7eb;
    border-color: #1f2937;
  }
  .dark .btn-download:hover {
    background-color: #1f2937;
  }

  .btn-add-employee {
    padding: 8px 18px;
    border-radius: 999px;
    border: none;
    background-image: linear-gradient(135deg, #22c55e, #16a34a);
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0.02em;
    box-shadow: 0 12px 26px rgba(22, 163, 74, 0.4);
  }
  .btn-add-employee:hover {
    filter: brightness(0.96);
  }

  /* Action buttons */
  .btn-primary.btn-sm {
    background-color: #2563eb;
    border-color: #2563eb;
    border-radius: 999px;
  }
  .btn-primary.btn-sm:hover {
    background-color: #1d4ed8;
    border-color: #1d4ed8;
  }
  .btn-danger.btn-sm {
    background-color: #ef4444;
    border-color: #ef4444;
    border-radius: 999px;
  }
  .btn-danger.btn-sm:hover {
    background-color: #dc2626;
    border-color: #dc2626;
  }

  /* Inputs */
  .form-control {
    border-radius: 999px;
  }
  .dark .form-control,
  .dark .form-select {
    background-color: #020617;
    color: #f9fafb;
    border-color: #4b5563;
  }
  .dark .form-control::placeholder {
    color: #9ca3af;
  }

  /* Table wrapper */
  .table-wrapper {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
    background-color: var(--bg-surface);
  }
  .dark .table-wrapper {
    background-color: #020617;
    box-shadow: 0 18px 40px rgba(0,0,0,0.9);
  }

  .table thead.table-dark {
    background-color: #0f172a;
  }
  .dark .table thead.table-dark {
    background-color: #020617;
  }

  .table thead th {
    border-bottom: none;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 0.78rem;
  }

  .table-hover tbody tr {
    transition: background-color 0.15s ease;
  }
  .table-hover tbody tr:hover {
    background-color: #f1f5f9;
  }
  .dark .table-hover tbody tr:hover {
    background-color: #111827;
  }

  /* Pagination */
  .btn-sm {
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 0.75rem;
  }
  .pagination .page-link {
    border-radius: 999px !important;
    margin: 0 3px;
  }
  .pagination .page-item.active .page-link {
    background-color: var(--primary);
    border-color: var(--primary);
  }
  .dark .pagination .page-link {
    background-color: #020617;
    color: #e5e7eb;
    border-color: #374151;
  }
  .dark .pagination .page-item.active .page-link {
    background-color: var(--primary);
    border-color: var(--primary);
  }

  /* FOOTER – same gradient as header */
  .page-footer {
    margin-top: auto;
    background-image: linear-gradient(90deg, #2563eb, #1d4ed8);
    font-size: 0.8rem;
    color: #ffffff;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    box-shadow: 0 -10px 26px rgba(15, 23, 42, 0.3);
  }
  .page-footer .fw-bold {
    font-size: 0.9rem;
  }
  .page-footer small {
    font-size: 0.78rem;
  }
  .page-footer .footer-pill {
    background-color: #ffffff;
    color: #2563eb;
    border-radius: 999px;
    padding: 6px 16px;
    font-size: 0.8rem;
    white-space: nowrap;
    border: none;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.2);
  }
  .page-footer .footer-pill:hover {
    background-color: #f3f4f6;
  }
  .dark .page-footer {
    background-image: linear-gradient(90deg, #020617, #111827);
    color: #e5e7eb;
  }
  .dark .page-footer .footer-pill {
    background-color: #ffffff;
    color: #0f172a;
  }
        `}</style>

        {/* TABLE */}
        <div className="table-wrapper mt-3" ref={tableRef}>
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort("email")}
                  style={{ cursor: "pointer" }}
                >
                  Email
                </th>
                <th>Phone</th>
                <th
                  onClick={() => handleSort("department")}
                  style={{ cursor: "pointer" }}
                >
                  Department
                </th>
                <th
                  onClick={() => handleSort("salary")}
                  style={{ cursor: "pointer" }}
                >
                  Salary
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
                      width="100"
                      alt="No data"
                    />
                    <p className="mt-3 text-muted">No Employees Found</p>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.department}</td>
                    <td>₹ {Number(emp.salary).toLocaleString()}</td>
                    <td>
                      <Link
                        to={`/edit/${emp.id}`}
                        className="btn btn-primary btn-sm me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this employee?"
                            )
                          ) {
                            axios
                              .delete(
                                `http://localhost:5000/employees/${emp.id}`
                              )
                              .then(fetchEmployees);
                            scrollToTable();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <nav className="d-flex justify-content-center mt-3">
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => {
                  setPage(page - 1);
                  scrollToTable();
                }}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => {
                    setPage(i + 1);
                    scrollToTable();
                  }}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                page === Math.ceil(total / limit) ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => {
                  setPage(page + 1);
                  scrollToTable();
                }}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* FOOTER */}
      <footer className="page-footer">
        <div className="container py-2 d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div className="mb-2 mb-md-0 text-center text-md-start">
            <div className="fw-bold">Acquant HR Services Private Limited</div>
            <small>
              Registered Office: #156, 'Sampige', 1st Block, Sir M
              Vishweshwaraiah Layout, Kengeri Satellite Town, Bengaluru-560060
            </small>
            <br />
            <small>
              Corporate Office: No.170, Manish Arcade, 1st Floor, 1st Stage,
              3rd Block, Nagarabhavi, Bengaluru-560072
            </small>
            <br />
            <small>CIN: U74909KA2025PTC201756</small>
          </div>

          <div className="d-flex flex-column flex-md-row align-items-center gap-2">
            <a
              href="mailto:info@acquanhr.com"
              className="footer-pill text-decoration-none"
            >
              ✉ info@acquanhr.com
            </a>
            <a
              href="https://www.acquanhr.com"
              target="_blank"
              rel="noreferrer"
              className="footer-pill text-decoration-none"
            >
              🌐 www.acquanhr.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmployeeListPage;
