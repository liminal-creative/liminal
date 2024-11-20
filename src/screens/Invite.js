import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext.js';
import axios from 'axios'; // Make sure to import axios
import './styles/InvitePage.css'

const Invite = () => {
    const { auth } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Safeguard to check if auth and auth.user are available
    if (!auth || !auth.user) {
        return <div>Loading...</div>; // or handle it as per your design, maybe a spinner
    }

    // Check if organizationId is an object and extract the relevant field (e.g., _id)
    const organizationId = auth.user.organizationId._id || auth.user.organizationId;

    const handleSendEmail = async () => {
        setLoading(true);
        setMessage(''); // Reset the message

        try {
            const subject = 'You have been invited to Liminal Core Messaging Site';
            const text = `You have been invited to use the Core Messaging Site by Liminal. To join your organization, sign up with this link: [ Link Here]. Where it asks for the organization ID, put in yours, which is: ${organizationId}.`;
            const html = `<p>You have been invited to use the Core Messaging Site by Liminal. To join your organization, sign up with this link: <a href="[ Link Here]">[ Link Here]</a>. Where it asks for the organization ID, put in yours, which is: <strong>${organizationId}</strong>.</p>`;

            const response = await axios.post('/api/send-email', {
                to: email,
                subject,
                text,
                html
            });

            setMessage(response.data); // Set success message
        } catch (error) {
            console.error('Error sending email:', error);
            setMessage('Error sending email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="invite-container"> {/* Add the container class */}
            <h1>Invite Page</h1>
            <p>To invite someone to your company, have them sign up and enter your Company ID: {organizationId}</p>

            <h3>Or send them instructions via email</h3>
            <input
                type="email"
                className="invite-input" // Add the input class
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter recipient's email"
                required
            />
            <button onClick={handleSendEmail} className="invite-button" disabled={loading}> {/* Add the button class */}
                {loading ? 'Sending...' : 'Send Invite'}
            </button>

            {message && <p className="invite-message">{message}</p>} {/* Display success/error message */}
        </div>
    );
};

export default Invite;
