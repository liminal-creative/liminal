import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : { user: null, token: null };
    });

    useEffect(() => {
        if (auth?.token) {
            if (auth.staySignedIn) {
                localStorage.setItem('auth', JSON.stringify(auth));
                sessionStorage.removeItem('auth');  // Ensure session storage is not overwritten
            } else {
                sessionStorage.setItem('auth', JSON.stringify(auth));
                localStorage.removeItem('auth');  // Ensure local storage is not overwritten
            }
        }
    }, [auth]);
    

    const login = (data) => {
        const { user, token, staySignedIn } = data;
        const authData = { user, token, staySignedIn };
        setAuth(authData);
    };

    const logout = () => {
        setAuth({ user: null, token: null });
        localStorage.removeItem('auth');
        sessionStorage.removeItem('auth');
    };

    const updateUser = (updatedUser) => {
        setAuth(prevAuth => ({
            ...prevAuth,
            user: updatedUser
        }));
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
