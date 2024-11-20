import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    password: '',
    confirmPassword: '',
    hasLiminalAccount: 'no',
    organizationId: ''
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(formData.password === value || formData.confirmPassword === value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    const dataToSubmit = { ...formData };
    if (formData.hasLiminalAccount === 'no') {
      delete dataToSubmit.organizationId;
    }
    console.log('dataToSubmit,', dataToSubmit);

    try {
        const response = await axios.post('/api/auth/signup', dataToSubmit);
        console.log('response.data', response.data);
        alert("Sign Up Successful");
        login(response.data);
        navigate("/surveys");
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Organization:</label>
          <input type="text" name="organization" value={formData.organization} onChange={handleChange} required />
        </div>
        <div>
          <label>Role:</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ borderColor: passwordMatch ? '' : 'red' }} />
          {!passwordMatch && <p style={{ color: 'red' }}>Passwords don't match</p>}
        </div>
        <div>
          <label>Does your organization have an existing liminal account?</label>
          <select name="hasLiminalAccount" value={formData.hasLiminalAccount} onChange={handleChange} required>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        {formData.hasLiminalAccount === 'yes' && (
          <div>
            <label>Enter your organization ID:</label>
            <input type="text" name="organizationId" value={formData.organizationId} onChange={handleChange} required />
          </div>
        )}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
