import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Test from './screens/Test';

import Index from './screens/Index';
import Login from './screens/Login';
import Welcome from './screens/Welcome';
import Welcome2 from './screens/Welcome2';
import SetArtistProfile from './screens/user/SetArtistProfile';
import ChatBox from './screens/user/Chatbox';
import CmsDetail from './screens/user/CmsDetail';
import ArtworkDetail from './screens/user/ArtworkDetail';
import ManageCommission from './screens/user/ManageCommission';
import ManageArtwork from './screens/user/ManageArtwork';
import ViewProfile from './screens/user/ViewProfile';
import Profile from './screens/user/Profile';
import Verify from './screens/Verify';
import NewVerify from './screens/NewVerify';
import Register from './screens/Register';
import NewRegister from './screens/NewRegister';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import SettingProfile from './screens/user/SettingProfile';
import Dashboard from './screens/user/Dashboard';
import ArtistManagement from './screens/user/ArtistManagement';
import MyReq from "./screens/user/MyReq";
import AllFaq from "./screens/user/AllFaq";


import AdminPage from './screens/admin/AdminPage';
import AdminManageUser from './screens/admin/AdminManageUser';
import AdminManageAdmin from "./screens/admin/AdminManageAdmin";
import AdminManage from "./screens/admin/AdminManage";
import AdminManageCms from "./screens/admin/AdminManageCms";
import AdminManageFAQ from "./screens/admin/AdminManageFAQ";
import AdminManageCmsProblem from './screens/admin/AdminManageCmsProblem';


const App = () => {
  return (
    <AuthProvider>
      {/* <UserProvider> */}
        <Router>
          <Routes>
            {/* test */}
          <Route path="/test" element={<Test />} />
          


            <Route path="/" element={<Index />} />
            <Route path="/:submenu" element={<Index />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/welcome2" element={<Welcome2 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/newregister" element={<NewRegister />} />
          <Route path="/newverify" element={<NewVerify />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/cmsdetail/:id" element={<CmsDetail />} />
          <Route path="/artworkdetail/:id" element={<ArtworkDetail />} />
          <Route path="/setartistprofile/:step" element={<SetArtistProfile />} />
            <Route path="/manage-commission" element={<ManageCommission />} />
            <Route path="/manage-artwork" element={<ManageArtwork />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<ViewProfile />} />
            <Route path="/setting-profile" element={<SettingProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/artistmanagement/:menu" element={<ArtistManagement />} />
            <Route path="/chatbox" element={<ChatBox />} />
            <Route path="/myreq" element={<MyReq />} />
            <Route path="/allfaq" element={<AllFaq />} />
          

            {/* admins */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/alluser" element={<AdminManageUser />} />
            <Route path="/admin/alladmin" element={<AdminManageAdmin />} />
            <Route path="/admin/commission" element={<AdminManageCms />} />
            <Route path="/admin/adminmanage/cms-problem/:id" element={<AdminManageCmsProblem />}/>
            <Route path="/admin/allfaq" element={<AdminManageFAQ />} />

            <Route path="/admin/adminmanage/:menu" element={<AdminManage />} />
            <Route path="/admin/adminmanage/:menu/:reportid" element={<AdminManage />} />

          </Routes>
        </Router>
      {/* </UserProvider> */}
    </AuthProvider>
  );
}

export default App;
