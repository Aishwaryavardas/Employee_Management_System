import React, { useState } from 'react';

const EmployeeForm = ({ initialData = {}, onSubmit, error }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    department: initialData.department || '',
    salary: initialData.salary || ''
  });
  const [validationError, setValidationError] = useState('');

  const validate = () => {
    if (!form.name || !form.email || !form.phone || !form.department || !form.salary) {
      return 'All fields are required';
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
      return 'Invalid email format';
    }
    if (!/^\d{10}$/.test(form.phone)) {
      return 'Phone must be 10 digits';
    }
    if (isNaN(form.salary)) {
      return 'Salary must be numeric';
    }
    return '';
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');
    onSubmit(form);
  };

  return (
    <form className="p-3" onSubmit={handleSubmit}>
      {/* ...fields for name, email, phone, department, salary... */}
      {validationError && <div className="alert alert-danger">{validationError}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary" type="submit">Save</button>
      <button className="btn btn-secondary ms-2" type="button" onClick={() => window.history.back()}>Cancel</button>
    </form>
  );
};

export default EmployeeForm;