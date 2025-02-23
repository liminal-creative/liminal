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

  const sendReminder = async (user) => {
    const { email, completedSurveyIndex } = user;
    setEmailStatus((prev) => ({ ...prev, [user._id]: 'sending' })); // Update status to "sending"

    try {
      const subject = `Reminder: Survey Progress`;
      const text = `Hi ${user.name},\n\nYou are currently on survey ${completedSurveyIndex + 1} out of 10. Please complete your surveys soon.\n\nThank you!`;
      const html = `<p>Hi ${user.name},</p><p> This message is from the Liminal Core Messaging App. You are currently on survey <strong>${completedSurveyIndex + 1}</strong> out of 10. Please complete your surveys soon.</p><p>Thank you!</p>`;

      await axiosInstance.post('/api/send-email', {
        to: email,
        subject,
        text,
        html,
      });

      setEmailStatus((prev) => ({ ...prev, [user._id]: 'sent' })); // Update status to "sent"
    } catch (error) {
      console.error('Error sending reminder:', error);
      setEmailStatus((prev) => ({ ...prev, [user._id]: 'error' })); // Update status to "error"
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? This will also delete their survey answers."
    );

    if (!confirmDelete) return;

    try {
      const response = await axiosInstance.delete(`/api/companies/${companyId}/users/${userId}`);
      alert(response.data.message);

      // Refresh company data after deletion
      setCompany((prevCompany) => ({
        ...prevCompany,
        users: prevCompany.users.filter(user => user._id !== userId),
      }));
    } catch (error) {
      alert("Error deleting user");
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

          // <li key={user._id}>
          //   {user.name} ({user.email}) - Completed ({user.completedSurveyIndex}/10) surveys
          //   {user.isTeamLeader ?  " - Team leader" : null}
          // </li>
          <li key={user._id}>
            {user.name} ({user.email}) completed: ({user.completedSurveyIndex}/10) surveys
            {/* <button onClick={() => sendReminder(user)}>Send Reminder</button> */}
            <button
              onClick={() => sendReminder(user)}
              disabled={emailStatus[user._id] === 'sending'}
            >
              {emailStatus[user._id] === 'sending' ? 'Sending...' : 'Send Reminder'}
            </button>
            {emailStatus[user._id] === 'sent' && <span className="success-message">Email Sent</span>}
            {emailStatus[user._id] === 'error' && <span className="error-message">Error Sending Email</span>}
            <button onClick={() => deleteUser(user._id)} className="delete-button">Delete</button>
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
