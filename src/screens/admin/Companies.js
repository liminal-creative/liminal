import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
import AuthContext from '../../context/AuthContext.js';
import './Companies.css';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig.js';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (auth?.user?.isAdmin) {
          const response = await axiosInstance.get('/api/companies', {
            headers: { Authorization: `Bearer ${auth.token}` }
          });
          setCompanies(response.data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();

  }, [auth]);

  if (!auth?.user?.isAdmin) {
    return <div>Access denied.</div>;
  }

  const filteredCompanies = companies.filter(company => {
    return (
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.users.some(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  return (
    <div className="admin-companies">
      <h1>Organizations</h1>
      <input
        type="text"
        placeholder="Search by company or user name"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {filteredCompanies.length > 0 ? (
        <ul>
          {filteredCompanies.map(company => (
            <Link className="company-link" to={`/companies/${company._id}`}>
              <li key={company._id}>
                <h2>{company.name}</h2>
                <ul>
                  {company.users.map(user => (
                    <li key={user._id}>{user.name} ({user.email})</li>
                  ))}
                </ul>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>No organizations found</p>
      )}
      {/* {companies.length > 0 ? (
        <ul>
          {companies.map(company => (
            <li key={company._id}>
              <h2>{company.name}</h2>
              <ul>
                {company.users.map(user => (
                  <li key={user._id}>{user.name} ({user.email})</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No companies found</p>
      )} */}
    </div>
  );
};

export default Companies;
