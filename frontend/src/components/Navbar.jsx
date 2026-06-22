import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  InputBase, 
  Badge, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { SessionContext } from '../context/SessionProvider.jsx';
import { userSession, alertsList } from '../data/localFeed';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.04),
  border: '1px solid',
  borderColor: theme.palette.divider,
  transition: 'all 0.25s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.07),
    borderColor: alpha(theme.palette.primary.main, 0.5),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: theme.spacing(6),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '28ch',
      '&:focus': {
        width: '32ch',
      }
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#10b981',
    color: '#10b981',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Navbar = ({ onDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { currentUser, logoutUser } = useContext(SessionContext);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleNotiMenuOpen = (event) => setNotiAnchorEl(event.currentTarget);
  const handleNotiMenuClose = () => setNotiAnchorEl(null);

  const handleSignOutClick = () => {
    handleProfileMenuClose();
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);
    logoutUser();
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const unreadCount = alertsList.length;

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        backgroundColor: 'rgba(17, 26, 22, 0.8)', 
        backdropFilter: 'blur(12px)',
        backgroundImage: 'none', 
        borderBottom: '1px solid', 
        borderColor: 'divider', 
        boxShadow: 'none' 
      }}
    >
      {/* Visual top bar gradient accent */}
      <Box sx={{ height: '3px', background: 'linear-gradient(90deg, #10b981, #f59e0b)' }} />

      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        
        {/* Left Logo section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            Founder<span style={{ color: '#10b981' }}>Link</span>
          </Typography>
        </Box>

        {/* Middle items: Search and Match Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Search sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
            <SearchIconWrapper>
              <SearchIcon fontSize="small" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search co-founders..."
              inputProps={{ 'aria-label': 'search' }}
            />
            {/* Keyboard shortcut icon indicator */}
            <Box 
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                display: { xs: 'none', md: 'block' }, 
                border: '1px solid', 
                borderColor: 'divider', 
                px: 1, 
                py: 0.25, 
                borderRadius: '4px', 
                bgcolor: 'background.default', 
                fontSize: '10px', 
                color: 'text.secondary', 
                fontWeight: 600,
                pointerEvents: 'none'
              }}
            >
              ⌘K
            </Box>
          </Search>

          {/* Pulse active dot match status chip */}
          <Chip 
            variant="outlined" 
            size="small" 
            label="Talent Match Active" 
            sx={{ 
              display: { xs: 'none', lg: 'inline-flex' }, 
              height: '24px', 
              fontSize: '11px', 
              fontWeight: 600, 
              color: '#10b981',
              borderColor: 'rgba(16, 185, 129, 0.25)', 
              backgroundColor: 'rgba(16, 185, 129, 0.04)',
              '& .MuiChip-label': { px: 1.5 }
            }} 
          />
        </Box>

        {/* Right Action Icons & Avatar details */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          
          {/* Notifications button */}
          <IconButton 
            size="large" 
            aria-label="show current notifications" 
            color="inherit" 
            onClick={handleNotiMenuOpen}
            sx={{ 
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: 'background.default'
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center', mx: 0.5 }} />

          {/* User profile details description */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
              {currentUser?.name || 'Guest User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '10px' }}>
              {currentUser?.title || currentUser?.role || 'Platform Guest'}
            </Typography>
          </Box>

          {/* Profile Avatar button with status badge */}
          <IconButton
            size="small"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
          >
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar 
                alt={currentUser?.name || 'User'} 
                src={currentUser?.avatarUrl || userSession.avatarUrl} 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  border: '2px solid', 
                  borderColor: 'primary.main' 
                }}
              />
            </StyledBadge>
          </IconButton>
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notiAnchorEl}
          open={Boolean(notiAnchorEl)}
          onClose={handleNotiMenuClose}
          PaperProps={{
            sx: {
              width: 340,
              maxHeight: 400,
              mt: 1.5,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}>Mark all read</Typography>
          </Box>
          <Divider />
          <List sx={{ p: 0 }}>
            {alertsList.map((noti) => (
              <ListItem key={noti.id} alignItems="flex-start" sx={{ '&:hover': { backgroundColor: 'action.hover' }, p: 1.8 }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar sx={{ bgcolor: noti.type === 'success' ? 'success.dark' : noti.type === 'warning' ? 'warning.dark' : 'primary.dark', width: 30, height: 30 }}>
                    <NotificationsActiveIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="bold" color="text.primary">
                      {noti.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, lineHeight: 1.35 }}>
                        {noti.desc}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5, fontWeight: 500 }}>
                        {noti.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Menu>

        {/* Profile Avatar Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              width: 220,
              mt: 1.5,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
              {currentUser?.name || 'Guest User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {currentUser?.email || 'guest@founderlink.com'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1, gap: 1.5 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2">My Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1, gap: 1.5 }}>
            <SettingsIcon fontSize="small" color="action" />
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleSignOutClick} sx={{ py: 1, gap: 1.5, color: 'error.main' }}>
            <LogoutIcon fontSize="small" color="inherit" />
            <Typography variant="body2">Sign Out</Typography>
          </MenuItem>
        </Menu>

        {/* Premium Sign Out Confirmation Dialog */}
        <Dialog
          open={logoutDialogOpen}
          onClose={handleCancelLogout}
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 2,
              backgroundColor: 'rgba(17, 26, 22, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
              backgroundImage: 'none'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, color: 'text.primary', fontSize: '20px', pb: 1 }}>
            Confirm Sign Out
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px', lineHeight: 1.5 }}>
              Are you sure you want to sign out? You will need to log back in to access your co-founder match pipeline and workspaces.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 1, gap: 1.5 }}>
            <Button 
              onClick={handleCancelLogout} 
              variant="outlined" 
              sx={{ 
                borderRadius: 2, 
                px: 3, 
                py: 1, 
                color: 'text.primary', 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  borderColor: 'text.primary',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmLogout} 
              variant="contained" 
              color="error" 
              sx={{ 
                borderRadius: 2, 
                px: 3, 
                py: 1, 
                textTransform: 'none',
                fontWeight: 'bold',
                backgroundColor: '#f43f5e',
                boxShadow: '0 4px 12px rgba(244, 63, 94, 0.2)',
                '&:hover': {
                  backgroundColor: '#e11d48',
                  boxShadow: '0 6px 16px rgba(244, 63, 94, 0.35)'
                }
              }}
            >
              Sign Out
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
