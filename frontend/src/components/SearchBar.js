// frontend/src/components/SearchBar.js
import React from 'react';

const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search by name, email, department"
    value={value}
    onChange={e => onChange(e.target.value)}
  />
);

export default SearchBar;