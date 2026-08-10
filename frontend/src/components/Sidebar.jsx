import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Send as SendIcon,
  GroupWork as GroupWorkIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  AdminPanelSettings as ShieldIcon,
  FolderSpecial as FolderSpecialIcon,
} from "@mui/icons-material";
import { SessionContext } from "../context/SessionProvider.jsx";

const drawerWidth = 260;

const secondaryMenuItems = [
  { text: "Help Center", icon: <HelpIcon />, path: "/help" },
];

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const { currentUser } = useContext(SessionContext);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [];

  if (currentUser?.role === "Founder") {
    menuItems.push(
       { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
      { text: "Create Startup Project", icon: <SendIcon />, path: "/Ideaform" },
      { text: "Browse Coders", icon: <SearchIcon />, path: "/match" },
      {
        text: "Received Applications & Requests",
        icon: <SendIcon />,
        path: "/applications",
      },
    );
  } else if (currentUser?.role === "Talent"){
    menuItems.push(
       { text: "Dashboard", icon: <DashboardIcon />, path: "/coder/dashboard" },

      {
        text: "Explore Startups",
        icon: <SearchIcon />,
        path: "/coder/Startuplist",
      },
      {
        text: "Sent Applications",
        icon: <SendIcon />,
        path: "/coder/applications",
      },
      {
        text: "Accepted Project",
        icon: <FolderSpecialIcon />,
        path: "/coder/Acceptedprojects",
      },
    );
  }
 menuItems.push(
    { text: 'Team Workspace', icon: <GroupWorkIcon />, path: '/workspaces' },
    // { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  );
  

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "background.paper",
      }}
    >
      <Toolbar />
      <Divider />

      {/* Primary items */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen) onDrawerToggle();
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  color: isActive ? "primary.main" : "text.secondary",
                  backgroundColor: isActive
                    ? "rgba(245, 158, 11, 0.08)"
                    : "transparent",
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(245, 158, 11, 0.12)",
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                    color: "text.primary",
                    "& .MuiListItemIcon-root": {
                      color: "text.primary",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Secondary items */}
      <List sx={{ px: 1.5, py: 2 }}>
        {secondaryMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen) onDrawerToggle();
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  color: isActive ? "primary.main" : "text.secondary",
                  backgroundColor: isActive
                    ? "rgba(245, 158, 11, 0.08)"
                    : "transparent",
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(245, 158, 11, 0.12)",
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                    color: "text.primary",
                    "& .MuiListItemIcon-root": {
                      color: "text.primary",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
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
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundImage: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Permanent drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundImage: "none",
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
