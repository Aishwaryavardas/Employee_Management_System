import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaLaptopCode,
  FaUserTie,
  FaMoneyBillWave,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [byDepartment, setByDepartment] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  // ✅ FIXED with useCallback
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/employees", {
        params: { search, page, limit, sort, order },
      });

      const data = Array.isArray(res.data.employees)
        ? res.data.employees
        : [];

      setEmployees(data);
      setTotal(res.data.total || 0);

      const deptCounts = {};
      data.forEach((emp) => {
        deptCounts[emp.department] =
          (deptCounts[emp.department] || 0) + 1;
      });

      setByDepartment(deptCounts);
    } catch (err) {
      console.error(err);
      setEmployees([]);
      setTotal(0);
      setByDepartment({});
    }
    setLoading(false);
  }, [search, page, limit, sort, order]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
  };

  const getDeptIcon = (dept) => {
    if (dept === "IT") return <FaLaptopCode size={28} color="#007bff" />;
    if (dept === "HR") return <FaUserTie size={28} color="#28a745" />;
    if (dept === "Finance")
      return <FaMoneyBillWave size={28} color="#ffc107" />;
    return <FaUsers size={24} />;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold" style={{ letterSpacing: "2px" }}>
        Employee Dashboard
      </h2>

      {/* ========== DASHBOARD CARDS ========== */}
      <div className="row g-4 mb-4 justify-content-center">

        {/* TOTAL CARD */}
        <motion.div
          className="col-md-4"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="card dashboard-card total-card text-white text-center border-0 shadow-lg">
            <div className="card-body py-4">
              <FaUsers size={45} />
              <h5 className="mt-2">Total Employees</h5>
              <h1 className="fw-bold">{total}</h1>
            </div>
          </div>
        </motion.div>

        {/* DEPT CARDS */}
        {Object.entries(byDepartment).map(([dept, count], i) => (
          <motion.div
            className="col-md-2"
            key={dept}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 * i, duration: 0.4 }}
          >
            <div className={`card dashboard-card dept-card border-0 shadow-lg dept-${dept.toLowerCase()}`}>
              <div className="card-body text-center">
                {getDeptIcon(dept)}
                <h6 className="mt-2">{dept}</h6>
                <h2 className="fw-bold text-primary">{count}</h2>
              </div>
            </div>
          </motion.div>
        ))}

      </div>

      {/* SEARCH + ADD BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          className="form-control w-50 shadow-sm"
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <Link to="/add" className="btn btn-success shadow">
          + Add Employee
        </Link>
      </div>


      {/* ========== TABLE ========== */}
      <div className="table-responsive rounded shadow-lg p-2 bg-white">
        <table className="table table-hover align-middle text-center">
          <thead
            style={{
              background: "linear-gradient(135deg,#0052D4,#4364F7,#6FB1FC)",
              color: "white",
            }}
          >
            <tr>
              <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                Name {sort === "name" && (order === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>

              <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                Email {sort === "email" && (order === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>

              <th>Phone</th>

              <th onClick={() => handleSort("department")} style={{ cursor: "pointer" }}>
                Department {sort === "department" && (order === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>

              <th onClick={() => handleSort("salary")} style={{ cursor: "pointer" }}>
                Salary {sort === "salary" && (order === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-5">
                  <div className="spinner-border text-primary"></div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-muted">
                  No data found
                </td>
              </tr>
            ) : (
              employees.map((emp, index) => (
                <motion.tr
                  key={emp._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="fw-bold">{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>
                    <span className="badge bg-dark p-2 px-3">
                      {emp.department}
                    </span>
                  </td>
                  <td className="text-success fw-bold">
                    ₹ {Number(emp.salary).toLocaleString()}
                  </td>
                  <td>
                    <Link to={`/edit/${emp._id}`} className="btn btn-primary btn-sm me-2">
                      Edit
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm("Delete this employee?")) {
                          axios
                            .delete(`http://localhost:5000/employees/${emp._id}`)
                            .then(fetchEmployees);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========== PAGINATION ========== */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${page === 1 && "disabled"}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>
              Previous
            </button>
          </li>

          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
            <li
              key={i}
              className={`page-item ${page === i + 1 && "active"}`}
            >
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              page === Math.ceil(total / limit) && "disabled"
            }`}
          >
            <button className="page-link" onClick={() => setPage(page + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* ========== EXTRA STYLES ========== */}
      <style>{`
        .dashboard-card {
          border-radius: 20px;
          transition: 0.3s ease-in-out;
        }

        .dashboard-card:hover {
          transform: translateY(-8px) scale(1.03);
        }

        .total-card {
          background: linear-gradient(135deg,#11998e,#38ef7d);
        }

        .dept-card {
          background: #f8f9fa;
        }

        tbody tr:hover {
          background: rgba(13,110,253,0.06);
          transform: scale(1.01);
          transition: 0.2s;
        }
      `}</style>

    </div>
  );
};

export default EmployeeListPage;
