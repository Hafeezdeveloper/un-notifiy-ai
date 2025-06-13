import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  ListAlt as ListAltIcon,
  Menu as MenuIcon
} from '@mui/icons-material'
import dashbaordicon from "../assets/img/Icon material-dashboard.png";
import adminOperatorsicon from "../assets/img/Admin-operators.png";
import adminUsericon from "../assets/img/Admin-user-icon.png";
import adminJobreqicon from "../assets/img/Admin-job-req-icon.png";
import adminActivejobicon from "../assets/img/Admin-active-job-req.png";
import Marketing from "../assets/img/marketing.svg";
import Property from "../assets/img/home.svg";
import adminServicesicon from "../assets/img/Admin-Services-icon.png";
import adminShedularicon from "../assets/img/Admin-Scheduler.png";
import adminlogo from "../assets/duet_logo-300x227.png";
import { Route, Routes, useNavigate } from 'react-router-dom';
import UsersRequest from './UsersRequest';
import AdminUserList from './AdminUserList';
import AdminInvitation from './AdminInvitation';
import SendInvitationForm from './AddInvitaion';
import UserAnalysis from './UserAnalysis';
import AdminDashboard from './Admin';
import DepartmentList from './DepartmentList';
import AddAnnoucenement from './AddAnnoucenement';
import SendAnnoucenment from './SendAnnoucenment';
import EditAnnoucenment from './EditAnnoucenment';
import AddDepartment from './AddDepartment';
import EditDepartment from './EditDepartment';
const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function AdminSidebar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };
  let data = [
    {
      icon: <DashboardIcon sx={{ color: '#fff' }} />,
      total: 60.00,
      title: "Dashboard",
      color: '#6610f2',
      isDisabled: false,
      path: "/admin/dashboard"
    },
    {
      icon: <PeopleIcon sx={{ color: '#fff' }} />,
      total: 10.00,
      title: "User request",
      color: '#ff8952',
      isDisabled: false,
      path: "/admin/UsersRequest"
    },
    {
      icon: <PeopleIcon sx={{ color: '#fff' }} />,
      total: 0.00,
      title: "All Users",
      color: '#00c689',
      isDisabled: false,
      path: "/admin/userList"
    },
    {
      icon: <PersonAddIcon sx={{ color: '#fff' }} />,
      total: 0.00,
      title: "Invitation Send",
      color: '#00c689',
      isDisabled: false,
      path: "/admin/user-invitation"
    },
    {
      icon: <ListAltIcon sx={{ color: '#fff' }} />,
      title: "Department List",
      path: "/admin/department-list"
    },
    {
      icon: <ListAltIcon sx={{ color: '#fff' }} />,
      title: "Annoucenment",
      path: "/admin/accoucenment"
    }
  ]

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const navig = useNavigate()
  const clkBtn = (e: any) => {
    navig(`${e}`)
  }
  console.log("A", localStorage.getItem("authToken"))
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {data && data.map((text: any, index: any) => (
          <ListItem key={text} onClick={() => clkBtn(text.path)} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{
                minWidth: '40px',
                background: 'linear-gradient(180deg, #0072b5, #005a92)',
                borderRadius: '4px',
                marginRight: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {text?.icon}
              </ListItemIcon>
              <ListItemText primary={text.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div >
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;



  return (
    <Box sx={{ display: 'flex', }}>
      <CssBaseline />
      <AppBar
        style={{ backgroundImage: "linear-gradient(180deg, #0072b5, #005a92)", }}
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            DUET Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}

          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },

          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"

          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Routes>
          <Route path='/dashboard' element={<AdminDashboard />} />
          <Route path="/UsersRequest" element={<UsersRequest />} />
          <Route path="/userList" element={<AdminUserList />} />
          <Route path="/user-invitation" element={<AdminInvitation />} />
          <Route path="/send-invitation" element={<SendInvitationForm />} />
          <Route path="/department-list" element={<DepartmentList />} />
          <Route path="/add-department" element={<AddDepartment />} />
          <Route path="/edit-department/:id" element={<EditDepartment  />} />
          <Route path="/accoucenment" element={<AddAnnoucenement />} />
          <Route path="/send-Annoucenment" element={<SendAnnoucenment />} />
          <Route path="/edit-annoucenment/:id" element={<EditAnnoucenment />} />
        </Routes>
      </Box>
    </Box>
  );
}
