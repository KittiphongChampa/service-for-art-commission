// AuthContext.js
import { createContext, useEffect, useContext, useState, useRef, } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import { host } from "../utils/api";
import { redirect } from 'react-router-dom';


const AuthContext = createContext();

const token = localStorage.getItem('token');

export const AuthProvider = ({ children }) => {
    const [userdata, setUserData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [type, setType] = useState(() => {
        const storedType = localStorage.getItem('type');
        return storedType || ''; // ถ้าไม่มีให้ใช้ค่าเริ่มต้นเป็น ''
    });

    useEffect(() => {
        localStorage.setItem('type', type);
    }, [type]);

    useEffect(() => {
        if (token) {
            axios.get(`${host}/index`, {
                headers: { Authorization: "Bearer " + token },
            }).then((response) => {
                const data = response.data;
                if (data.status === "ok") {
                    setUserData(data.users[0]);
                    setIsLoggedIn(true);
                }
            }).catch((error) => {
                handleAuthError(error);
            });
        }
    }, [type]);
    

    const login = (data) => {
        setType(data.type)
        const token = data.token;
        
        axios.get(`${host}/index`, {
            headers: { Authorization: "Bearer " + token },
        }).then((response) => {
            const data = response.data;
            if (data.status === "ok") {
                setUserData(data.users[0]);
                setIsLoggedIn(true);
            }
        }).catch((error) => {
            handleAuthError(error);
        });
    };

    const handleAuthError = (error) => {
        if (error.response && error.response.status === 401 && error.response.data === "Token has expired") {
            alert("Token has expired. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("type");
            window.location.href = "/login";
        } else {
            console.error("Error fetching user data:", error);
        }
    };


    return (
        <AuthContext.Provider value={{ login, isLoggedIn, userdata, admindata, socket  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
