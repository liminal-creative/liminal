
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext.js"; 
import axiosInstance from "../../axiosConfig.js";

const AddOrganization = () => {
  const [companyName, setCompanyName] = useState("");
  const { auth } = useContext(AuthContext);
  const [employees, setEmployees] = useState([{ name: "", email: "" }]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user?.isAdmin) {
      navigate("/");
    }
  }, [auth, navigate]); 

  if (!auth?.user) {
    return <div>Loading...</div>;
  }

  const handleEmployeeChange = (index, field, value) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = value;
    setEmployees(updatedEmployees);
  };

  const addEmployee = () => {
    setEmployees([...employees, { name: "", email: "" }]);
  };

  const removeEmployee = (index) => {
    const updatedEmployees = employees.filter((_, i) => i !== index);
    setEmployees(updatedEmployees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedLeader === null) {
      alert("Please select a team leader.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/add-company", {
        name: companyName,
        employees,
        teamLeader: employees[selectedLeader],
      });
      
      alert("Company and invites created successfully!");
    } catch (error) {
      console.error("Error creating company or sending invites", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add a New Organization</h1>
      <div>
        <label>Organization Name:</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
      <h2>Employees</h2>
      {employees.map((employee, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Name"
            value={employee.name}
            onChange={(e) => handleEmployeeChange(index, "name", e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={employee.email}
            onChange={(e) =>
              handleEmployeeChange(index, "email", e.target.value)
            }
            required
          />
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="teamLeader"
              checked={selectedLeader === index}
              onChange={() => setSelectedLeader(index)}
            />
            Team Leader
          </label>
          {employees.length > 1 && (
            <button type="button" onClick={() => removeEmployee(index)}>
              -
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addEmployee}>
        +
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddOrganization;
