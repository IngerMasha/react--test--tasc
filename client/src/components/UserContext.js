
import React, { createContext, useState } from 'react';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userLogin, setUserLogin] = useState('');
    const [posts, setPosts] = useState([]);
    // const [MAIN_URL, setMAIN_URL]=useState('http://localhost:8080/')
    const MAIN_URL = 'http://localhost:8080/';


    return (
        <UserContext.Provider value={{ userLogin, setUserLogin,posts, setPosts,MAIN_URL }}>
            {children}
        </UserContext.Provider>
    );
};