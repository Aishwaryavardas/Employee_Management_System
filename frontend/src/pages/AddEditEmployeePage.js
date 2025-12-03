import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const AddEditEmployeePage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', salary: '' });
	const [error, setError] = useState('');
	const [isEdit, setIsEdit] = useState(false);
	const departments = ['IT', 'HR', 'Finance', 'Sales', 'Marketing'];

	useEffect(() => {
		if (id) {
			setIsEdit(true);
			axios.get(`http://localhost:5000/employees/${id}`)
				.then(res => setForm(res.data))
				.catch(() => setError('Employee not found'));
		}
	}, [id]);

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
		const { name, value, type } = e.target;
		setForm({ ...form, [name]: type === 'number' ? value.replace(/[^\d.]/g, '') : value });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const err = validate();
		if (err) {
			setError(err);
			return;
		}
		setError('');
		try {
			if (isEdit) {
				await axios.put(`http://localhost:5000/employees/${id}`, form);
			} else {
				await axios.post('http://localhost:5000/employees', form);
				setForm({ name: '', email: '', phone: '', department: '', salary: '' }); // clear form after add
			}
			navigate('/');
		} catch (err) {
			console.log(error.response || error.message)
		}
	};

	return (
		<div className="container mt-4">
			<h2>{isEdit ? 'Edit' : 'Add'} Employee</h2>
			<form className="p-3" onSubmit={handleSubmit} style={{maxWidth: 500}} autoComplete="off">
				<div className="mb-3">
					<label className="form-label">Name</label>
					<input className="form-control" name="name" value={form.name} onChange={handleChange} required />
				</div>
				<div className="mb-3">
					<label className="form-label">Email</label>
					<input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required />
				</div>
				<div className="mb-3">
					<label className="form-label">Phone</label>
					<input className="form-control" name="phone" type="tel" pattern="\d{10}" value={form.phone} onChange={handleChange} required />
				</div>
				<div className="mb-3">
					<label className="form-label">Department</label>
					<select className="form-select" name="department" value={form.department} onChange={handleChange} required>
						<option value="">Select Department</option>
						{departments.map(dep => (
							<option key={dep} value={dep}>{dep}</option>
						))}
					</select>
				</div>
				<div className="mb-3">
					<label className="form-label">Salary</label>
					<input className="form-control" name="salary" type="number" min="0" value={form.salary} onChange={handleChange} required />
				</div>
				{error && <div className="alert alert-danger">{error}</div>}
				<button className="btn btn-primary" type="submit">{isEdit ? 'Update' : 'Save'}</button>
				<button className="btn btn-secondary ms-2" type="button" onClick={() => navigate('/')}>Cancel</button>
			</form>
		</div>
	);
};

export default AddEditEmployeePage;