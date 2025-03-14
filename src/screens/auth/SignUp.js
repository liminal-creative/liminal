import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/AuthPage.module.css";

const Signup = ({ setIsSignupActive }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [formData, setFormData] = useState({
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInviteSubmit = async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/invite/${inviteCode}`);
      setUserDetails(response.data);
      setError('');
      setIsSignupActive(true);
    } catch (err) {
      setError('Invalid invite code. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await axiosInstance.post('/api/auth/invite', {
        inviteCode,
        ...formData,
      });

      alert('Account created successfully! Login to see your surveys');
      navigate('/signin');
    } catch (err) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div  className={styles.signUpContainer} >
      {!userDetails ? (
        <div>
          <div  className={styles.inviteCodeContainer}>
            <input
              type="text"
              value={inviteCode}
              placeholder="Invite Code"
              className={styles.inviteCodeInput}
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <button type="button" className={styles.inviteCodeBtn}  onClick={handleInviteSubmit}>
              Verify Invite Code
            </button>

          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Welcome, {userDetails.name}</h2>
          <div>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Role"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Complete Signup</button>
        </form>
      )}
    </div>
  );
};

export default Signup;
