import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {UserContext} from "../UserContext";
import '../Main/styles/header.css'
const Header = () => {
    const {userLogin, setUserLogin} = useContext(UserContext);
    const handlerLogOutButton = () => {
        setUserLogin('');
    }
    return (
        <div className={'logOutSection'}>
            <p>login: {userLogin}</p>
            <Link to="/">
                <button onClick={handlerLogOutButton}>Log out</button>
            </Link>
        </div>
    );
};

export default Header;