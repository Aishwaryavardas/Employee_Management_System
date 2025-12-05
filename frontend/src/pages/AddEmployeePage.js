// frontend/src/pages/AddEmployeePage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";

const PRIMARY = "#0b1120";

const AddEmployeePage = ({ isDark }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCsvPath = location.pathname.endsWith("add-csv");
  const [mode, setMode] = useState(isCsvPath ? "csv" : "manual"); // "manual" | "csv"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    salary: "",
  });

  const [file, setFile] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const departments = ["IT", "HR", "Finance", "Marketing", "Sales"];

  const bgColor = isDark ? PRIMARY : "#f3f4f6";
  const textPrimary = isDark ? "#f9fafb" : "#000000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(value) && value.length <= 100);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    // extra manual front-end validation (in addition to HTML5)
    const { name, email, phone, department, salary } = formData;
    if (name.trim().length < 2 || name.trim().length > 60) {
      alert("Name must be 2–60 characters long.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 100) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!/^\d{7,15}$/.test(String(phone))) {
      alert("Phone must be 7–15 digits (numbers only).");
      return;
    }
    if (!department) {
      alert("Please select a department.");
      return;
    }
    if (!salary || Number(salary) <= 0) {
      alert("Salary must be a positive number.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/employees", formData);
      alert("Employee added successfully!");
      navigate("/employees");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error adding employee");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file!");

    // basic client-side file validation
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid Excel (.xlsx / .xls) or CSV file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Please upload a file under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const cleaned = jsonData
          .map((row, index) => {
            const name = (row.name || row.Name || row.NAME || "").trim();
            const email = (row.email || row.Email || row.EMAIL || "").trim();
            const phone = String(
              row.phone || row.Phone || row.PHONE || ""
            ).trim();
            const department =
              row.department || row.Department || row.DEPARTMENT || "";
            const salaryRaw = row.salary || row.Salary || row.SALARY || 0;
            const salary = Number(salaryRaw);

            if (!name && !email && !phone && !department && !salaryRaw) {
              console.log("Skipping empty row at index", index, row);
              return null;
            }

            if (
              !name ||
              name.length < 2 ||
              name.length > 60 ||
              !email ||
              !emailRegex.test(email) ||
              email.length > 100 ||
              !phone ||
              !/^\d{7,15}$/.test(phone) ||
              !department ||
              !salary ||
              salary <= 0
            ) {
              console.warn("Skipping invalid row at index", index, row);
              return null;
            }

            return { name, email, phone, department, salary };
          })
          .filter(Boolean);

        if (!cleaned.length) {
          alert(
            "No valid rows found in file. Check headers and data (name, email, phone, department, salary)."
          );
          return;
        }

        await axios.post("http://localhost:5000/employees/bulk", cleaned);
        alert("Employees added successfully!");
        navigate("/employees");
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Error uploading file");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.25 },
    },
    exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 90, // offset for fixed header
      }}
    >
      <div
        className="main-content container mt-3 mb-4"
        style={{ maxWidth: 520 }}
      >
        <h2
          className="mb-4 text-center fw-bold"
          style={{ letterSpacing: "1px", color: textPrimary }}
        >
          Add Employee
        </h2>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="d-flex justify-content-center mb-3">
              <button
                type="button"
                className={`btn me-2 ${
                  mode === "manual" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setMode("manual")}
              >
                Enter manually
              </button>
            <button
                type="button"
                className={`btn ${
                  mode === "csv" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setMode("csv")}
              >
                Add CSV file
              </button>
            </div>

            <style>{`
              .add-card {
                border-radius: 18px;
                border: none;
                background: linear-gradient(135deg, #ffffffee, #f9fafbee);
                box-shadow: 0 14px 32px rgba(15, 23, 42, 0.15);
              }
              .add-card .form-label {
                font-weight: 500;
                color: #0f172a;
              }
              .add-card input,
              .add-card select {
                border-radius: 999px;
                padding-left: 16px;
              }
              .add-card button[type="submit"],
              .add-card .btn-primary {
                border-radius: 999px;
              }

              /* dark mode card + labels */
              .dark .add-card {
                background: radial-gradient(circle at top left, #020617, #111827);
                box-shadow: 0 18px 40px rgba(0,0,0,0.9);
                color: #e5e7eb;
              }
              .dark .add-card .form-label {
                color: #e5e7eb;
              }
            `}</style>

            <AnimatePresence mode="wait">
              {mode === "manual" && (
                <motion.form
                  key="manual"
                  onSubmit={handleManualSubmit}
                  className="card p-4 add-card"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      minLength={2}
                      maxLength={60}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <div style={{ position: "relative" }}>
                      <input
                        name="email"
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        style={{ paddingRight: "32px" }}
                      />
                      {isEmailValid && (
                        <span
                          style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#16a34a",
                            fontSize: 18,
                            pointerEvents: "none",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      pattern="\d{7,15}"
                      title="Phone must be 7–15 digits"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <select
                      name="department"
                      className="form-select"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Salary</label>
                    <input
                      name="salary"
                      type="number"
                      className="form-control"
                      value={formData.salary}
                      onChange={handleChange}
                      required
                      min={1}
                    />
                  </div>

                  <button type="submit" className="btn btn-success w-100">
                    Save Employee
                  </button>
                </motion.form>
              )}

              {mode === "csv" && (
                <motion.div
                  key="csv"
                  className="card p-4 add-card"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <p className="mb-3">
                    Upload a .xlsx or .csv file with columns:
                    <strong> name, email, phone, department, salary</strong>.
                  </p>

                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="form-control mb-3"
                    onChange={handleFileChange}
                  />

                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleFileUpload}
                  >
                    Upload &amp; Save
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeePage;
