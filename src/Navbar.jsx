import React, {useState} from 'react';
// The useLocation hooks allows us to get the current URL of the router
import {Link, useLocation} from 'wouter';

export default function Navbar() {

    const [isNavBarShowing, setIsNavBarShowing] = useState(false);
    const [location] = useLocation(); // location will contain the current URL of the router
  
    const toggleNavbar = () => {
        setIsNavBarShowing(!isNavBarShowing);
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <a className="navbar-brand" href="#">E-Shop</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={toggleNavbar}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isNavBarShowing ? "show" : ""}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className={`nav-link ${location==="/" ? 'active': ''}`} aria-current="page" href="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location==="/products" ? 'active' :''}`} href="/products">Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location==='/register' ? 'active' : ''}`} href="/register">Register</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location==='/cart' ? 'active' : ''}`} href="/cart">Cart</Link>
                            </li>
                            <li className="nav-item">
                            <Link className={`nav-link ${location==='/login' ? 'active' : ''}`} href="/login">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}