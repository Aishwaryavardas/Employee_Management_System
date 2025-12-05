// backend/controllers/employeeController.js
const Employee = require('../models/employee');

// helper validators
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 100;
};

const isValidPhone = (phone) => /^\d{7,15}$/.test(String(phone || ''));

const isValidName = (name) =>
  typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 60;

// GET all employees with search + pagination + sorting
exports.list = async (req, res) => {
  try {
    const {
      search = '',
      department = '',
      page = 1,
      limit = 10,
      sort = 'name',
      order = 'asc'
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const employees = await Employee.findAll({
      search,
      department,
      page: pageNum,
      limit: limitNum,
      sort,
      order
    });

    const total = await Employee.count({ search, department });
    const byDepartment = await Employee.countByDepartment
      ? await Employee.countByDepartment({ search, department })
      : {};

    res.json({ employees, total, byDepartment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET single employee by ID
exports.get = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE new employee
exports.create = async (req, res) => {
  try {
    const { name, email, phone, department, salary } = req.body;

    // Required checks
    if (!name || !email || !phone || !department || salary == null) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!isValidName(name)) {
      return res
        .status(400)
        .json({ error: 'Name must be between 2 and 60 characters' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!isValidPhone(phone)) {
      return res
        .status(400)
        .json({ error: 'Phone must be 7–15 digits (numbers only)' });
    }

    if (isNaN(salary) || Number(salary) <= 0) {
      return res
        .status(400)
        .json({ error: 'Salary must be a positive number' });
    }

    const id = await Employee.create({
      name: name.trim(),
      email: email.trim(),
      phone: String(phone),
      department,
      salary: Number(salary)
    });
    const newEmployee = await Employee.findById(id);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE employee
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department, salary } = req.body;

    const existing = await Employee.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Validate only if fields are present (but you can also enforce all)
    if (name && !isValidName(name)) {
      return res
        .status(400)
        .json({ error: 'Name must be between 2 and 60 characters' });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (phone && !isValidPhone(phone)) {
      return res
        .status(400)
        .json({ error: 'Phone must be 7–15 digits (numbers only)' });
    }

    if (salary != null && (isNaN(salary) || Number(salary) <= 0)) {
      return res
        .status(400)
        .json({ error: 'Salary must be a positive number' });
    }

    await Employee.update(id, {
      name: name ?? existing.name,
      email: email ?? existing.email,
      phone: phone ?? existing.phone,
      department: department ?? existing.department,
      salary: salary ?? existing.salary
    });

    const updated = await Employee.findById(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE employee
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Employee.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await Employee.delete(id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Bulk create employees from CSV / Excel JSON
exports.bulkCreate = async (req, res) => {
  try {
    const employees = req.body; // expecting array

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ error: 'No employees data provided' });
    }

    let inserted = 0;
    let skipped = 0;

    for (let emp of employees) {
      const { name, email, phone, department, salary } = emp || {};

      if (
        !name ||
        !email ||
        !phone ||
        !department ||
        salary == null ||
        !isValidName(name) ||
        !isValidEmail(email) ||
        !isValidPhone(phone) ||
        isNaN(salary) ||
        Number(salary) <= 0
      ) {
        skipped++;
        continue;
      }

      try {
        await Employee.create({
          name: name.trim(),
          email: email.trim(),
          phone: String(phone),
          department,
          salary: Number(salary)
        });
        inserted++;
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          // duplicate email: skip without failing whole upload
          console.warn('Skipping duplicate email in bulkCreate:', email);
          skipped++;
          continue;
        }
        throw err;
      }
    }

    return res.status(201).json({
      message: 'Employees added successfully',
      inserted,
      skipped
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
