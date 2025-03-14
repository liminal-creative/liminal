import React, { useState, useContext } from 'react';
import axiosInstance from '../../axiosConfig.js';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.js';
import styles from "../styles/AuthPage.module.css";

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

      if (error.response) {
        // Server responded with an error status code
        switch (error.response.status) {
          case 400:
            setError('Incorrect email or password. Please try again.');
            break;
          case 404:
            setError('User not found. Please check your email or complete sign up.');
            break;
          case 500:
            setError('Internal server error. Please try again later.');
            break;
          default:
            setError('An unexpected error occurred. Please try again.');
        }
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className={styles.signInContainer}>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="email" name="email" placeholder="Email"  className={styles.firstInput}  value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <input type="password" name="password" placeholder="Password" className={styles.middleInput}  value={formData.password} onChange={handleChange} required />
        </div>
        <button className={styles.submitBtn} type="submit">Log In</button>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        <div>
          <input
            type="checkbox"
            name="staySignedIn"
            checked={formData.staySignedIn}
            onChange={handleChange}
          />
          <label> Stay Signed In </label>
        </div>
        <Link to="/forgot-password" className={styles.forgotPassword} ><p>Forgot Password?</p></Link>
      </form>
    </div>
  );
};

export default Signin;
