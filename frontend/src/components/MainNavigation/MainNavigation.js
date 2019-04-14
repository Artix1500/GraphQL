import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import './MainNavigation.scss';

const mainNavigation = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <header className="main-nav">
                    <div className="main-nav-logo">
                        <h1>UpEvent</h1>
                    </div>
                    <nav className="main-nav-item">
                        <ul>
                            <li><NavLink to="/events">Events</NavLink></li>
                            {context.token && <li><NavLink to="/bookings">Bookings</NavLink></li>}
                            {!context.token && <li><NavLink to="/auth">Login</NavLink></li>}
                            {context.token && <li><button onClick={context.logout}>Logout</button></li>}
                        </ul>
                    </nav>
                </header>
            );
        }
        }
    </AuthContext.Consumer>
);


export default mainNavigation;