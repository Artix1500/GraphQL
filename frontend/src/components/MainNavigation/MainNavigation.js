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
                            {!context.token && <li><NavLink to="/auth">Auth</NavLink></li>}
                            <li><NavLink to="/events">Events</NavLink></li>
                            {context.token && <li><NavLink to="/bookings">Bookings</NavLink></li>}
                        </ul>
                    </nav>
                </header>
            );
        }
        }
    </AuthContext.Consumer>
);


export default mainNavigation;