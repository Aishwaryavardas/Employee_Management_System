// backend/models/employee.js
const db = require('../config/db');

class Employee {
  static async findAll({ search, department, page, limit }) {
    let query = 'SELECT * FROM employees WHERE 1=1';
    let params = [];
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async count({ search, department }) {
    let query = 'SELECT COUNT(*) as count FROM employees WHERE 1=1';
    let params = [];
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    const [rows] = await db.query(query, params);
    return rows[0].count;
  }

  // ✅ NEW: global department counts (independent of page/limit)
  static async countByDepartment({ search, department }) {
    let query =
      'SELECT department, COUNT(*) as count FROM employees WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    query += ' GROUP BY department';

    const [rows] = await db.query(query, params);

    const result = {};
    rows.forEach((row) => {
      result[row.department] = row.count;
    });
    return result; // e.g. { IT: 5, HR: 3 }
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { name, email, phone, department, salary } = data;
    const [result] = await db.query(
      'INSERT INTO employees (name, email, phone, department, salary) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, department, salary]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { name, email, phone, department, salary } = data;
    await db.query(
      'UPDATE employees SET name=?, email=?, phone=?, department=?, salary=? WHERE id=?',
      [name, email, phone, department, salary, id]
    );
  }

  static async delete(id) {
    await db.query('DELETE FROM employees WHERE id=?', [id]);
  }
}

module.exports = Employee;
