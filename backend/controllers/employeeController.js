const Employee = require('../models/employee');   // file name is employee.js (lowercase)


// GET all employees with search + pagination
exports.list = async (req, res) => {
  try {
    const {
      search = '',
      department = '',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const employees = await Employee.findAll({
      search,
      department,
      page: pageNum,
      limit: limitNum
    });

    const total = await Employee.count({ search, department });

    res.json({ employees, total });
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

    const id = await Employee.create({
      name,
      email,
      phone,
      department,
      salary
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

    await Employee.update(id, req.body);

    const updated = await Employee.findById(id);
    if (!updated) {
      return res.status(404).json({ error: 'Employee not found' });
    }

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
