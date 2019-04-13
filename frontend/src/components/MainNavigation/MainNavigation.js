import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.scss';

const mainNavigation = props => (
    <header className="main-nav">
        <div className="main-nav-logo">
            <h1>UpEvent</h1>
        </div>
        <nav className="main-nav-item">
            <ul>
                <li><NavLink to="/events">Events</NavLink></li>
                <li><NavLink to="/bookings">Bookings</NavLink></li>
                <li><NavLink to="/auth">Auth</NavLink></li>
            </ul>
        </nav>
    </header>

);


export default mainNavigation;