import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import adminHeaderSearch from "../../assets/img/Admin-header-search-logo.png";
import Adminheaderask from "../assets/img/Admin-Header-ask-btn.png";
import AdminUser from "../assets/img/Admin-Header-ask-btn.png";
import '../assets/css/admin.css'
import '../assets/css/adminresponsive.css'
import '../assets/css/responsive.css'
const AdminHeader = () => {
    const [dragModal, setDragModal] = useState(false);
    const handleOpen = () => {
        setDragModal(true);
    };
    const handleClose = () => {
        setDragModal(false);
    };
    //   const { unReadNotifications } = useSelector((store:RootState) => store.notification);
    return (
        <section style={{ backgroundColor: "#0274be", alignItems:"center",  }} className=" admin-header   flex  justify-end   z-10  h-5">
            <div className=" header-glo-set     top-0 z-99  ">
                <span className="w-full text-white pe-2 "> Admin</span>
            </div>
        </section >
    );
};

export default AdminHeader;
