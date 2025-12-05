// src/components/Navbar.js
import React from "react";
import { NavLink } from "react-router-dom";

const navLinkStyle = ({ isActive }) => ({
  padding: "6px 14px",
  borderRadius: 999,
  fontSize: 14,
  textDecoration: "none",
  color: isActive ? "#0b1120" : "#e5e7eb",
  backgroundColor: isActive ? "#ffffff" : "transparent",
  border: isActive ? "1px solid rgba(148,163,184,0.7)" : "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
});

const Navbar = () => (
  <nav
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    <NavLink to="/" style={navLinkStyle} end>
      Dashboard
    </NavLink>
    <NavLink to="/reports" style={navLinkStyle}>
  Reports
</NavLink>

  </nav>
);

export default Navbar;
