import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { AccountCircle, Notifications } from '@mui/icons-material';
import { useAppSelector } from '@hooks/redux';

const Header = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Shop Floor Resource Allocation
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">{user?.name || user?.username}</Typography>
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
