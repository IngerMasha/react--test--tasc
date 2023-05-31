
import React, {useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import {UserContext} from "./UserContext";
import '../components/Main/styles/loginPage.css';
const LoginPage = () => {
    const [login, setLogin] = useState('')
    const { setUserLogin } = useContext(UserContext);
    const handlerEnterButtonClick = () => {
        if (login !== '') {
            setUserLogin(login);
        }
    }
    return (
            <div className={"loginInputSection"}>
                <input type={"text"} placeholder={"login"} onChange={(e) => setLogin(e.target.value)}/>
                <Link to="/main">
                    <button onClick={handlerEnterButtonClick}>Enter</button>
                </Link>
            </div>
    );
};
export default LoginPage;