import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import DashboardLayout from './components/DashboardLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Match from './pages/Match.jsx';
import Applications from './pages/Applications.jsx';
import Workspaces from './pages/Workspaces.jsx';
import Settings from './pages/Settings.jsx';
import Premium from './pages/Premium.jsx';
import Help from './pages/Help.jsx';
import { SessionProvider } from './context/SessionProvider.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Ideaform from './pages/Ideaform.jsx';
import Home from './pages/Home.jsx';

// Custom sleek dark theme palette for Material UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#080d0b', // Deep obsidian forest green
      paper: '#111a16'    // Dark forest slate
    },
    primary: {
      main: '#f59e0b',    // Amber Gold
      dark: '#d97706'
    },
    secondary: {
      main: '#10b981'     // Mint Emerald
    },
    success: {
      main: '#34d399'
    },
    warning: {
      main: '#fbbf24'
    },
    error: {
      main: '#f43f5e'     // Coral Rose
    },
    divider: '#1a2922'    // Dark forest divider
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800
    },
    h6: {
      fontWeight: 700
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontWeight: 600
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SessionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/Ideaform" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Ideaform />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/match" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Match />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Applications />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workspaces" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Workspaces />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/premium" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Premium />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/help" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Help />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            {/* Redirect all other routes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;
