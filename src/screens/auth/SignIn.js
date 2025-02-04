import React, { useState, useContext } from 'react';
// import axios from 'axios';
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
      console.log(response.data);
      login(response.data);
      alert("Sign In Successful");
      navigate("/surveys");
    } catch (error) {
      console.error('Error:', error);
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
        <button type="submit">Sign In</button>
        <Link to="/forgot-password" > <p> Forgot Password? </p> </Link>
        
      </form>
    </div>
  );
};

export default Signin;