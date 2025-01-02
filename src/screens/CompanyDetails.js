import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To access company ID from the URL
import './styles/CompanyDetails.css'

const CompanyDetails = () => {
  const { companyId } = useParams(); // Get companyId from URL parameters
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const [compiledAnswers, setCompiledAnswers] = useState(null); // Store compiled answers here
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [emailStatus, setEmailStatus] = useState({});

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`/api/companies/${companyId}`);
        setCompany(response.data);
      } catch (error) {
        setError('Error fetching company details');
      }
    };

    fetchCompany();
  }, [companyId]);

  const compileAnswers = async () => {
    setLoadingAnswers(true);
    try {
      const response = await axios.post(`/api/companies/${companyId}/compile-answers`);
      setCompiledAnswers(response.data.compiledAnswers);
      console.log("compiledAnswers", response.data.compiledAnswers);
    } catch (error) {
      setError('Error compiling survey answers');
    } finally {
      setLoadingAnswers(false);
    }
  };

  const sendReminder = async (user) => {
    const { email, completedSurveyIndex } = user;
    setEmailStatus((prev) => ({ ...prev, [user._id]: 'sending' })); // Update status to "sending"

    try {
      const subject = `Reminder: Survey Progress`;
      const text = `Hi ${user.name},\n\nYou are currently on survey ${completedSurveyIndex + 1} out of 10. Please complete your surveys soon.\n\nThank you!`;
      const html = `<p>Hi ${user.name},</p><p> This message is from the Liminal Core Messaging App. You are currently on survey <strong>${completedSurveyIndex + 1}</strong> out of 10. Please complete your surveys soon.</p><p>Thank you!</p>`;

      await axios.post('/api/send-email', {
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

  if (error) {
    return <div>{error}</div>;
  }

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className='page-container'>
      <h1>{company.name}</h1>
      <h3>Users in this company:</h3>
      <ul>
        {company.users.map(user => (
          <li key={user._id}>
            {user.name} ({user.email}) completed: ({user.completedSurveyIndex}/10) surveys
            <button
              onClick={() => sendReminder(user)}
              disabled={emailStatus[user._id] === 'sending'}
            >
              {emailStatus[user._id] === 'sending' ? 'Sending...' : 'Send Reminder'}
            </button>
            {emailStatus[user._id] === 'sent' && <span className="success-message">Email Sent</span>}
            {emailStatus[user._id] === 'error' && <span className="error-message">Error Sending Email</span>}
          </li>
        ))}
      </ul>

      <button onClick={compileAnswers} disabled={loadingAnswers}>
        {loadingAnswers ? 'Compiling...' : 'Compile Answers'}
      </button>

      {compiledAnswers && (
        <div>
          <h3>Compiled Survey Answers:</h3>
          <div>
            {compiledAnswers.map((answer, index) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, '<br/>') }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;