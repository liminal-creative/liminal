import React, { useState, useContext } from 'react';
import axiosInstance from '../../axiosConfig.js';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.js';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    staySignedIn: false
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    console.log('formData', formData)
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/signin', formData);
      console.log("response.data", response.data);
      login({
        user: response.data.user,
        token: response.data.token,
        staySignedIn: formData.staySignedIn
      });
      alert("Sign In Successful");
      navigate("/surveys");
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 400) {
        setError('Incorrect email or password. Please try again.'); 
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <input 
            type="checkbox" 
            name="staySignedIn" 
            checked={formData.staySignedIn} 
            onChange={handleChange} 
          />
          <label> Stay Signed In </label>
        </div>
        <button type="submit">Sign In</button>
        {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>} 
        <Link to="/forgot-password"><p>Forgot Password?</p></Link>
      </form>
    </div>
  );
};

export default Signin;
