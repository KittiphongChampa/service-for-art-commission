import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";
import { Helmet } from "react-helmet";
import { Typography,Button,Input } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { host } from "../../utils/api";

const title = 'จัดการคอมมิชชัน';

export default function AdminManageCms() {
    const navigate = useNavigate();
    const jwt_token = localStorage.getItem("token");
    const type = localStorage.getItem("type");
    const { admindata, isLoggedIn } = useAuth();
    
    const [cmsData, setCmsdata] = useState([]);
    const [filteredUser, setFilteredUser] = useState([]);

    useEffect(() => {
        if (jwt_token && type === "admin") {
          getData();
        } else {
          navigate("/login");
        }
    }, []);

    useEffect(() => {
      // update filtered user when user state changes
      setFilteredUser(cmsData);
    }, [cmsData]);

    const getData = async () => {
      await axios
        .get(`${host}/allcommission`,{
          headers: {
            Authorization: "Bearer " + jwt_token,
          },
        })
        .then((response) => {
          const data = response.data;
          if (data.status === "ok") {
              setCmsdata(data.data);
          } else if (data.status === "no_access") {
            alert(data.message);
            navigate("/");
          } else {
            localStorage.removeItem("token");
            navigate("/login");
          }
        })
    }

    const handleSearch = (event) => {
      const query = event.target.value.toLowerCase();
      const filtered = cmsData.filter(
        (item) =>
          item.urs_name.toLowerCase().includes(query) ||
          item.cms_name.toLowerCase().includes(query) 
      );
      setFilteredUser(filtered);
    };


  return (
    <>
      <Helmet>
          <title>{title}</title>
      </Helmet>
      <h1 className="">รูปภาพที่รอตรวจสอบความเหมือน</h1>
      <div className="all-user-head">
        <h2>จำนวนทั้งหมด ({cmsData.length})</h2>
        <div>
          <Input type="search" onChange={handleSearch} placeholder=" ค้นหา..." />
        </div>
      </div>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>cmsID</th>
                        <th>Commission Name</th>
                        <th>userID</th>
                        <th>userName</th>
                        <th>DateTime</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {filteredUser.map((item, index) => (
                    <tr key={index}>
                        <td>{item.cms_id}</td>
                        <td>{item.cms_name}</td>
                        <td>{item.usr_id}</td>
                        <td>{item.urs_name}</td>
                        <td>{item.formattedCreatedAt}</td>
                        <td><Link to={`/admin/adminmanage/cms-problem/${item.cms_id}`}>จัดการ</Link></td>
                    </tr>
                  ))}
                </tbody>
            </table>
    </>
  )
}
