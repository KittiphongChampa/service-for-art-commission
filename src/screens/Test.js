import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../components/Navbar";
import { useAuth } from '../context/AuthContext';


import { host } from "../utils/api";

function Test() {
    const { userdata, isLoggedIn, type } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            
        } else {
            navigate("/login");
        }
    }, []);

  return (
    <div>
        {isLoggedIn ? (
            type === 'admin' ? <NavbarAdmin /> : <NavbarUser />
        ) : (
            <NavbarHomepage />
        )}
        <h3>{userdata.urs_name}</h3>
        <h3>{type}</h3>
        

    </div>
  )
}

export default Test
