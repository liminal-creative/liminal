import React from "react";
import authImage from "../../assets/authImage.png";
import logo from "../../assets/Logo.svg";
import "../styles/AuthPage.css";
import Signin from "./SignIn.js";
import Signup from "./SignUp.js";

const AuthPage = () => {
    return (
        <div className="auth-container">
            {/* Left Column - Image */}
            <div className="auth-image">
                <img src={authImage} alt="Illustration" />
            </div>

            <div className="auth-form">
            <div className="auth-form-inner">
                <img src={logo} alt="Illustration" />
                <h2>Have an invite code?</h2>
                <Signup />
                <p>— OR —</p>
                <h2>Sign in to your account</h2>
                <Signin />
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
