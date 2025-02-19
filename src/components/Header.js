import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.js';

const Header = () => {
    const { auth, logout } = useContext(AuthContext);
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();
    console.log(auth, 'auth <-', auth?.user?.isAdmin);
    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    return (
        <header style={styles.header}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.navLink}>Home</Link>
                {auth?.user ? (
                    <>
                        <Link to="/surveys" style={styles.navLink}>Surveys</Link>
                        {(auth?.user?.isAdmin && auth?.user.organizationId.name === "liminal") && (
                            <>
                            <Link to="/admin/companies" style={styles.navLink}>Organizations</Link>
                            <Link to="/add-company" style={styles.navLink}>Add Organization</Link>
                            </>
                        )}
                        {(auth?.user?.isTeamLeader) && (
                            <Link to={`/companies/${auth.user.organizationId._id}`} style={styles.navLink}>Progress</Link>
                        )}
                        {/* <Link to="/invite" style={styles.navLink}> Invite someone </Link> */}
                        <div style={styles.userMenu}>
                            <span onClick={() => setShowLogout(!showLogout)} style={styles.userName}>
                                Logged in as {auth?.user?.name}
                            </span>
                            {showLogout && (
                                <button onClick={handleLogout} style={styles.logoutButton}>
                                    Logout
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/signup" style={styles.navLink}>Sign Up</Link>
                        <Link to="/signin" style={styles.navLink}>Sign In</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd'
    },
    logo: {
        height: '50px'
    },
    nav: {
        display: 'flex',
        alignItems: 'center'
    },
    navLink: {
        margin: '0 10px',
        textDecoration: 'none',
        color: '#333'
    },
    userMenu: {
        position: 'relative'
    },
    userName: {
        cursor: 'pointer',
        margin: '0 10px'
    },
    logoutButton: {
        position: 'absolute',
        top: '100%',
        left: 0,
        color: 'black',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        padding: '5px 10px',
        cursor: 'pointer'
    }
};

export default Header;