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
          </li>
        ))}
      </ul>
      
      {/* Compile answers button */}
      <button onClick={compileAnswers} disabled={loadingAnswers}>
        {loadingAnswers ? 'Compiling...' : 'Compile Answers'}
      </button>

      {/* Show compiled answers */}
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