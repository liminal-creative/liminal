import React, { useState } from "react";
import authImage from "../../assets/authImage.png";
import logo from "../../assets/Logo.svg";
import styles from "../styles/AuthPage.module.css";
import Signin from "./SignIn.js";
import Signup from "./SignUp.js";

const AuthPage = () => {
    const [isSignupActive, setIsSignupActive] = useState(false);

    return (
        <div className={styles.authContainer}>
            {/* Left Column - Image */}
            <div className={styles.authImage}>
                <img src={authImage} alt="Illustration" />
            </div>

            <div className={styles.authForm}>
                <div className={styles.authFormInner}>
                    <img src={logo} alt="Illustration" />
                    <h2>Have an invite code?</h2>
                    <Signup setIsSignupActive={setIsSignupActive} />
                    {!isSignupActive && (
                        <>
                            <p>— OR —</p>
                            <h2>Sign in to your account</h2>
                            <Signin />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
