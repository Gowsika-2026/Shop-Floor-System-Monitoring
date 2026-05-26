import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard,
  People,
  Precision,
  Inventory,
  Assignment,
  SwapHoriz,
  Analytics,
  Logout,
} from '@mui/icons-material';
import { useAppDispatch } from '@hooks/redux';
import { logout } from '@store/slices/authSlice';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Operators', icon: <People />, path: '/operators' },
  { text: 'Machines', icon: <Precision />, path: '/machines' },
  { text: 'Materials', icon: <Inventory />, path: '/materials' },
  { text: 'Work Orders', icon: <Assignment />, path: '/work-orders' },
  { text: 'Allocation', icon: <SwapHoriz />, path: '/allocation' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding sx={{ mt: 'auto' }}>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
