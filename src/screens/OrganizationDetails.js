import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig.js";
import { useParams } from "react-router-dom";
import "./styles/OrganizationDetails.css";

const OrganizationDetails = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const [compiledAnswers, setCompiledAnswers] = useState(null);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [emailStatus, setEmailStatus] = useState({});
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "" });
  const [selectedLeader, setSelectedLeader] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axiosInstance.get(`/api/companies/${companyId}`);
        setCompany(response.data);
      } catch (error) {
        setError("Error fetching company details");
      }
    };

    fetchCompany();
  }, [companyId]);

  const inviteUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/api/companies/${companyId}/invite`, newEmployee);
      alert(response.data.message);
      setNewEmployee({ name: "", email: "" });

      const updatedCompanyListResponse = await axiosInstance.get(`/api/companies/${companyId}`);
      setCompany(updatedCompanyListResponse.data);
    } catch (error) {
      alert("Error inviting user");
    }
  };

  const changeLeader = async () => {
    console.log("selectedLeader", selectedLeader)
    if (!selectedLeader) {
      alert("Please select a new team leader");
      return;
    }
    try {
      const response = await axiosInstance.put(`/api/companies/${companyId}/change-leader`, { userId: selectedLeader });
      alert(response.data.message);

      const updatedCompanyListResponse = await axiosInstance.get(`/api/companies/${companyId}`);
      setCompany(updatedCompanyListResponse.data);
    } catch (error) {
      alert("Error changing leader");
    }
  };

  const compileAnswers = async () => {
    setLoadingAnswers(true);
    try {
      const response = await axiosInstance.post(`/api/companies/${companyId}/compile-answers`);
      setCompiledAnswers(response.data.compiledAnswers);
    } catch (error) {
      setError("Error compiling survey answers");
    } finally {
      setLoadingAnswers(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <h1>{company.name}</h1>
      
      <h3>Users in this organization:</h3>
      <ul>
        {company.users.map((user) => (
           
          <li key={user._id}>
            {user.name} ({user.email}) - Completed ({user.completedSurveyIndex}/10) surveys
            {user.isTeamLeader ?  " - Team leader" : null}
          </li>
        ))}
      </ul>

      <button onClick={compileAnswers} disabled={loadingAnswers}>
        {loadingAnswers ? "Compiling..." : "Compile Answers"}
      </button>

      {compiledAnswers && (
        <div>
          <h3>Compiled Survey Answers:</h3>
          <div>
            {compiledAnswers.map((answer, index) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, "<br/>") }} />
            ))}
          </div>
        </div>
      )}

      <h3>Edit Organization Below:</h3>
      <h4>Invite a New Employee</h4>
      <form onSubmit={inviteUser}>
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmployee.email}
          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          required
        />
        <button type="submit">Invite</button>
      </form>

      <h4>Change Team Leader</h4>
      <select value={selectedLeader} onChange={(e) => setSelectedLeader(e.target.value)}>
        <option value="">Select new leader</option>
        {company.users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
      <button onClick={changeLeader}>Change Leader</button>

      
    </div>
  );
};

export default OrganizationDetails;
