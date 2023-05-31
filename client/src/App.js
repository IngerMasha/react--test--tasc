import React, {useEffect} from 'react';
import './App.css';
import LoginPage from "./components/LoginPage";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Main from "./components/Main/Main";
import {UserProvider} from "./components/UserContext";

function App() {

    useEffect(() => {
        // TEST API, it might be removed
        fetch('http://localhost:8080/live').then(res => res.json()).then(res => {
            console.log('API CONNECTION IS OK');
        }).catch((e) => console.error('API CONNECTION FAILED, PLEASE CHECK SERVER APP AND TRY AGAIN'))
    }, []);

    return (
        <UserProvider>
            <div className="App">
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage/>}/>
                        <Route path="/main" element={<Main/>}/>
                    </Routes>
                </Router>
            </div>
        </UserProvider>
    );
}

export default App;
