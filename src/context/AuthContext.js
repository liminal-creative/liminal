import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        // Retrieve auth from localStorage (persistent) or sessionStorage (temporary)
        const storedAuth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : { user: null, token: null, staySignedIn: false };
    });

    useEffect(() => {
        if (auth?.token) {
            if (auth.staySignedIn) {
                localStorage.setItem('auth', JSON.stringify(auth));  
                sessionStorage.removeItem('auth');  // Ensure session storage is cleared
            } else {
                sessionStorage.setItem('auth', JSON.stringify(auth));  
                localStorage.removeItem('auth');  // Ensure local storage is cleared
            }
        }
    }, [auth]);

    const login = (data) => {
        const { user, token, staySignedIn } = data;
        const authData = { user, token, staySignedIn };

        setAuth(authData);

        // Store auth immediately in correct storage
        if (staySignedIn) {
            localStorage.setItem('auth', JSON.stringify(authData));
            sessionStorage.removeItem('auth');
        } else {
            sessionStorage.setItem('auth', JSON.stringify(authData));
            localStorage.removeItem('auth');
        }
    };

    const logout = () => {
        setAuth({ user: null, token: null, staySignedIn: false });
        localStorage.removeItem('auth');
        sessionStorage.removeItem('auth');
    };

    const updateUser = (updatedUser) => {
        setAuth(prevAuth => {
            const updatedAuth = { ...prevAuth, user: updatedUser };
            
            // Store updated user in the correct storage
            if (prevAuth.staySignedIn) {
                localStorage.setItem('auth', JSON.stringify(updatedAuth));
            } else {
                sessionStorage.setItem('auth', JSON.stringify(updatedAuth));
            }

            return updatedAuth;
        });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
