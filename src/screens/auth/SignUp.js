// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import AuthContext from '../../context/AuthContext.js';

// const Signup = () => {
//   const [inviteCode, setInviteCode] = useState("");
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     organization: '',
//     role: '',
//     password: '',
//     confirmPassword: '',
//     hasLiminalAccount: 'no',
//     organizationId: ''
//   });
//   const [passwordMatch, setPasswordMatch] = useState(true);
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//     if (name === 'password' || name === 'confirmPassword') {
//       setPasswordMatch(formData.password === value || formData.confirmPassword === value);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       setPasswordMatch(false);
//       return;
//     }

//     const dataToSubmit = { ...formData };
//     if (formData.hasLiminalAccount === 'no') {
//       delete dataToSubmit.organizationId;
//     }
//     console.log('dataToSubmit,', dataToSubmit);

//     try {
//         const response = await axios.post('/api/auth/signup', dataToSubmit);
//         console.log('response.data', response.data);
//         alert("Sign Up Successful");
//         login(response.data);
//         navigate("/surveys");
//       } catch (error) {
//         console.error('Error:', error);
//       }
//   };

//   const handleInviteSubmit = async () => {
//     try {
//       const response = await axios.get(`/api/users/invite/${inviteCode}`);
//       setFormData({
//         ...formData,
//         name: response.data.name,
//         email: response.data.email,
//         organization: response.data.organizationId,
//       });
//     } catch (error) {
//       console.error("Invalid invite code");
//       alert("Invite code is invalid. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h1>Sign Up</h1>
//       <form onSubmit={handleSubmit}>
//       <div>
//         <label>Invite Code:</label>
//         <input
//           type="text"
//           value={inviteCode}
//           onChange={(e) => setInviteCode(e.target.value)}
//         />
//         <button type="button" onClick={handleInviteSubmit}>
//           Verify Invite Code
//         </button>
//       </div>
//         {/* <div>
//           <label>Name:</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>Email:</label>
//           <input type="email" name="email" value={formData.email} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>Organization:</label>
//           <input type="text" name="organization" value={formData.organization} onChange={handleChange} required />
//         </div> */}
//         <div>
//           <label>Role:</label>
//           <input type="text" name="role" value={formData.role} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" name="password" value={formData.password} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>Confirm Password:</label>
//           <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ borderColor: passwordMatch ? '' : 'red' }} />
//           {!passwordMatch && <p style={{ color: 'red' }}>Passwords don't match</p>}
//         </div>
//         {/* <div>
//           <label>Does your organization have an existing liminal account?</label>
//           <select name="hasLiminalAccount" value={formData.hasLiminalAccount} onChange={handleChange} required>
//             <option value="yes">Yes</option>
//             <option value="no">No</option>
//           </select>
//         </div> */}
//         {formData.hasLiminalAccount === 'yes' && (
//           <div>
//             <label>Enter your organization ID:</label>
//             <input type="text" name="organizationId" value={formData.organizationId} onChange={handleChange} required />
//           </div>
//         )}
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
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
      const response = await axios.get(`/api/auth/invite/${inviteCode}`);
      setUserDetails(response.data);
      setError('');
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
      await axios.post('/api/auth/invite', {
        inviteCode,
        ...formData,
      });

      alert('Account created successfully!');
      navigate('/');
    } catch (err) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {!userDetails ? (
        <div>
          <label>Invite Code:</label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          <button type="button" onClick={handleInviteSubmit}>
            Verify Invite Code
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Welcome, {userDetails.name}</h2>
          <div>
            <label>Role:</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
