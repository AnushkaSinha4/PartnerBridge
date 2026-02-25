import { useState } from "react";
import API from "../services/api";

function CreateUser() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "employee"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post("/admin/users", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("User created successfully ✅");
    } catch (err) {
      alert("Error creating user ❌");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
  
      <input
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
        required
      />

      <input
        name="lastName"
        placeholder="Last Name"
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />

      <select name="role" onChange={handleChange}>
        <option value="employee">Employee</option>
        <option value="client">Client</option>
        <option value="partner">Partner</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Create User</button>
    </form>
  );
}

export default CreateUser;