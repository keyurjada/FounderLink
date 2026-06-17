import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Divider, 
  Box, 
  Typography 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Search as SearchIcon, 
  Send as SendIcon, 
  GroupWork as GroupWorkIcon, 
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  AdminPanelSettings as ShieldIcon
} from '@mui/icons-material';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', active: true },
  { text: 'Co-Founder Matcher', icon: <SearchIcon />, path: '/match' },
  { text: 'Applications', icon: <SendIcon />, path: '/applications' },
  { text: 'Team Workspaces', icon: <GroupWorkIcon />, path: '/workspaces' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
];

const secondaryMenuItems = [
  { text: 'Premium Access', icon: <ShieldIcon color="warning" />, path: '/premium' },
  { text: 'Help Center', icon: <HelpIcon />, path: '/help' }
];

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'background.paper' }}>
      <Toolbar />
      <Divider />
      
      {/* Primary items */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={item.active}
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 2,
                color: item.active ? 'primary.main' : 'text.secondary',
                backgroundColor: item.active ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                '&.Mui-selected:hover': {
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                  color: 'text.primary',
                  '& .MuiListItemIcon-root': {
                    color: 'text.primary',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: item.active ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontSize: '14px', fontWeight: item.active ? 600 : 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Secondary items */}
      <List sx={{ px: 1.5, py: 2 }}>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 2,
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  color: 'text.primary',
                  '& .MuiListItemIcon-root': {
                    color: 'text.primary',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile Drawer (Temporary overlay) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundImage: 'none'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Permanent drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundImage: 'none'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
export { drawerWidth };
