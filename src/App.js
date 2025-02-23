import './App.css';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './screens/Home.js';
import Signup from './screens/auth/SignUp.js';
import Signin from './screens/auth/SignIn.js';
import ForgotPassword from './screens/auth/ForgotPassword.js';
import ResetPassword from './screens/auth/ResetPassword.js';
import Survey from './screens/Survey.js';
import Surveys from './screens/Surveys.js';
import { AuthProvider } from './context/AuthContext.js';
import Header from './components/Header.js';
import Invite from './screens/Invite.js';
import Organizations from './screens/admin/Organizations.js';
import OrganizationDetails from './screens/OrganizationDetails.js';
import AddOrganization from './screens/admin/AddOrganization.js';
import ProtectedRoute from './screens/auth/ProtectedRoute.js';

function App() {
  const [message, setMessage] = useState('');

  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/survey/:id" element={<Survey />} />
          <Route path="/admin/organizations" element={<ProtectedRoute component={Organizations} requiredRole="admin"/>} />
          <Route path="/organizations/:companyId" element={<ProtectedRoute component={OrganizationDetails} requiredRole="teamLeader"/>} />
          <Route path="/add-organization" element={<ProtectedRoute component={AddOrganization} requiredRole="admin"/>} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
