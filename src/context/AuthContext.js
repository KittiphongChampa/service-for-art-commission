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
    // const [onlineUsers, setOnlineUsers] = useState(new Map());

    const [admindata, setAdmindata] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [socket, setSocket] = useState(null);
    const [type, setType] = useState(() => {
        const storedType = localStorage.getItem('type');
        return storedType || ''; // ถ้าไม่มีให้ใช้ค่าเริ่มต้นเป็น ''
    });

    useEffect(() => {
        localStorage.setItem('type', type);
    }, [type]);

    useEffect(() => {
        setSocket(io(`${host}`));
    }, []);

    useEffect(() => {
        if (type === "user") {
            socket?.emit("add-user", userdata.id);
            // socket?.on("getUsers", (onlineUsers) => {
            //     setOnlineUsers(new Map(onlineUsers));
            // });
        } else if (type === "admin") {
            socket?.emit("add-admin", admindata.admin_id);
        }
    }, [ userdata, admindata ]);


    useEffect(() => {
        if (token) {
            // สร้าง Socket.IO เมื่อมีการเข้าสู่ระบบ
            const newSocket = io(`${host}`);
            setSocket(newSocket);

            // ยกเลิก Socket.IO เมื่อ component ถูก unmounted หรือออกจาก session
            return () => {
                newSocket.disconnect();
            };
        } 
    }, []);

    useEffect(() => {
        if (token) {
            if (type === 'admin') {
                axios.get(`${host}/admin`, {
                    headers: { Authorization: "Bearer " + token },
                }).then((response) => {
                    const data = response.data;
                    // console.log(data);
                    if (data.status === "ok") {
                        setAdmindata(data.admins[0]);
                        setIsLoggedIn(true);
                    }
                }).catch((error) => {
                    handleAuthError(error);
                });
            } else if (type === 'user') {
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
        }
    }, [type]);
    

    const login = (data) => {
        setType(data.type)
        const token = data.token;
        if (data.type === 'admin') {
            axios.get(`${host}/admin`, {
                headers: {Authorization: "Bearer " + token},
            }).then((response) => {
                const data = response.data;
                if (data.status === "ok") {
                    setAdmindata(data.admins[0]);
                    setIsLoggedIn(true);
                }
            }).catch((error) => {
                handleAuthError(error);
            });
        } else {
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
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    const handleAuthError = (error) => {
        if (error.response && error.response.status === 401 && error.response.data === "Token has expired") {
            alert("Token has expired. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("type");
            setIsLoggedIn(false);
            window.location.href = "/login";
            
        } else {
            console.error("Error fetching user data:", error);
        }
    };

    // แสดงวันเวลาเป็นไทย
    // let today = new Date();
    // console.log(today.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }));

    return (
        <AuthContext.Provider value={{ login, logout, isLoggedIn, userdata, admindata, socket  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
