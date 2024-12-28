
import React, { useState } from "react";
import axios from "axios";

const AddCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [employees, setEmployees] = useState([{ name: "", email: "" }]);

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

    try {
      const response = await axios.post("/api/add-company", {
        name: companyName,
        employees,
      });

      // const inviteResponses = await Promise.all(
      //   employees.map((employee) =>
      //     axios.post("/api/send-email", {
      //       to: employee.email,
      //       subject: "Welcome to the Liminal Core Messaging App",
      //       text: `Hi ${employee.name}, you’ve been invited to join Liminal! Use this invite code to complete your signup: ${response.data.inviteCode}`,
      //     })
      //   )
      // );

      alert("Company and invites created successfully!");
    } catch (error) {
      console.error("Error creating company or sending invites", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add a New Company</h1>
      <div>
        <label>Company Name:</label>
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

export default AddCompany;
