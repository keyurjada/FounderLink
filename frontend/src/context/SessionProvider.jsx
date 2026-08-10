import React, { createContext, useState, useEffect } from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

export const SessionContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api/auth';

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const demoUsers = [
  {
    email: "alex.rivera@devmail.com",
    password: "password",
    name: "Alex Rivera",
    role: "Talent",
    title: "Senior Full Stack Engineer"
  },
  {
    email: "sarah.jenkins@founder.com",
    password: "password",
    name: "Sarah Jenkins",
    role: "Founder",
    title: "Co-Founder & CEO"
  }
];

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');
  const baseUrl = 'http://localhost:5005/api';

  if (!token) {
    throw new Error('No auth token found, please log in.');
  }

  const isFormData = options.body instanceof FormData;

  const headers = {
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers,
    ...options
  });

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('active_session');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

export const SessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('auth_token');
      const raw = localStorage.getItem('active_session');

      if (token) {
        try {
          const user = await requestJson('/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const normalizedUser = {
            ...user,
            skills: normalizeList(user.skills),
            languages: normalizeList(user.languages)
          };

          setCurrentUser(normalizedUser);
          localStorage.setItem('active_session', JSON.stringify(normalizedUser));
          setLoading(false);
          return;
        } catch (error) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('active_session');
        }
      }

      setCurrentUser(null);
      setLoading(false);
    };

    restoreSession();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const data = await requestJson('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const sessionData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || '',
        title: data.title || (data.role === 'Founder' ? 'Founder' : 'Software Engineer'),
        profilePicture: data.profilePicture || '',
        skills: normalizeList(data.skills),
        languages: normalizeList(data.languages)
      };

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('active_session', JSON.stringify(sessionData));
      setCurrentUser(sessionData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (name, email, password, role, phone = '') => {
    try {
      const data = await requestJson('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, phone, title: role === 'Founder' ? 'Founder' : 'Developer / Designer' })
      });

      const sessionData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || phone,
        profilePicture: data.profilePicture || '',
        title: data.title || (data.role === 'Founder' ? 'Founder' : 'Developer / Designer'),
        skills: normalizeList(data.skills),
        languages: normalizeList(data.languages)
      };

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('active_session', JSON.stringify(sessionData));
      setCurrentUser(sessionData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('active_session');
    setCurrentUser(null);
  };

  // We expose setCurrentUser and setGlobalLoading so components can use them
  return (
    <SessionContext.Provider value={{ currentUser, setCurrentUser, loading, loginUser, registerUser, logoutUser, fetchApi, setGlobalLoading }}>
      {children}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 9999,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(3, 7, 6, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={globalLoading}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress 
            size={60} 
            thickness={4} 
            sx={{ 
              color: 'primary.main',
              animationDuration: '1.5s',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <CircularProgress 
            size={60} 
            thickness={4} 
            sx={{ 
              color: 'secondary.main',
              position: 'absolute',
              left: 0,
              opacity: 0.5,
              animationDuration: '2s',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: 1 }}>
          PROCESSING...
        </Typography>
      </Backdrop>
    </SessionContext.Provider>
  );
};
