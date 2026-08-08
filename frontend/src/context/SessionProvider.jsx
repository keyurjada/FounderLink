import React, { createContext, useState, useEffect } from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

export const SessionContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/auth';

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
  const baseUrl = 'http://localhost:5001/api';

  const getLocal = (key, defaultValue = []) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setLocal = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const executeLocalMock = (endpoint, options) => {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : {};

    if (endpoint === '/idea') {
      return getLocal('local_ideas');
    }
    if (endpoint === '/idea/create') {
      const activeSession = localStorage.getItem('active_session');
      const ownerId = activeSession ? JSON.parse(activeSession)._id : 'guest';
      const newIdea = {
        _id: 'idea_' + Date.now(),
        userId: ownerId,
        startuptitle: body.startuptitle,
        category: body.category,
        equity: body.equity,
        description: body.description,
        teamsize: body.teamsize,
        skillsRequired: body.skillsRequired || [],
        createdAt: new Date().toISOString()
      };
      const currentIdeas = getLocal('local_ideas');
      currentIdeas.push(newIdea);
      setLocal('local_ideas', currentIdeas);
      return { message: 'StartUp Project Uploaded Successfully', data: newIdea };
    }
    if (endpoint.startsWith('/idea/') && method === 'DELETE') {
      const parts = endpoint.split('/');
      const id = parts[parts.length - 1];
      const current = getLocal('local_ideas');
      const filtered = current.filter(p => p._id !== id);
      setLocal('local_ideas', filtered);
      return { message: 'Venture deleted successfully' };
    }

    if (endpoint === '/auth/talents') {
      const stored = getLocal('saved_profiles');
      const talents = stored.filter(u => u.role === 'Talent');
      if (talents.length === 0) {
        return [
          { _id: 'talent_1', name: 'Alex Rivera', role: 'Talent', title: 'Senior Developer', skills: ['React', 'Node.js'], bio: 'Fullstack coder looking for early stage fintech co-founder matches.' },
          { _id: 'talent_2', name: 'Harsh Shah', role: 'Talent', title: 'AI Developer', skills: ['Python', 'TensorFlow'], bio: 'Interested in building AI workflows.' }
        ];
      }
      return talents.map(t => ({
        _id: t._id || 'local_' + t.email,
        name: t.name,
        role: t.role,
        title: t.title || 'Technical Coder',
        skills: t.skills || ['React', 'Node.js', 'MongoDB'],
        bio: t.bio || 'Experienced coder looking for a matching co-founder.',
        profilePicture: t.profilePicture || ''
      }));
    }

    if (endpoint === '/auth/me' && method === 'PUT') {
      const active = getLocal('active_session', {});
      const updated = { ...active, ...body };
      
      const stored = getLocal('saved_profiles');
      const idx = stored.findIndex(u => u.email.toLowerCase() === active.email?.toLowerCase());
      if (idx !== -1) {
        stored[idx] = { ...stored[idx], ...body };
        setLocal('saved_profiles', stored);
      }
      setLocal('active_session', updated);
      return updated;
    }

    if (endpoint === '/auth/me' && method === 'PUT') {
      const active = getLocal('active_session', {});
      const updated = { ...active, ...body };
      
      const stored = getLocal('saved_profiles');
      const idx = stored.findIndex(u => u.email.toLowerCase() === active.email?.toLowerCase());
      if (idx !== -1) {
        stored[idx] = { ...stored[idx], ...body };
        setLocal('saved_profiles', stored);
      }
      setLocal('active_session', updated);
      return updated;
    }

    if (endpoint === '/applications' || endpoint === '/applications/received') {
      return getLocal('local_applications');
    }
    if (endpoint.startsWith('/applications/') && method === 'PUT') {
      const parts = endpoint.split('/');
      const id = parts[parts.length - 1];
      const current = getLocal('local_applications');
      const updated = current.map(p => {
        if (p._id === id) {
          return { ...p, status: body.status };
        }
        return p;
      });
      setLocal('local_applications', updated);
      return { message: 'Application updated successfully' };
    }
    if (endpoint.startsWith('/applications/') && method === 'DELETE') {
      const parts = endpoint.split('/');
      const id = parts[parts.length - 1];
      const current = getLocal('local_applications');
      const filtered = current.filter(p => p._id !== id);
      setLocal('local_applications', filtered);
      return { message: 'Application deleted successfully' };
    }

    if (endpoint.includes('/tasks')) {
      const parts = endpoint.split('/');
      const startupId = parts[2];
      const localKey = `local_tasks_${startupId}`;
      const currentTasks = getLocal(localKey);

      if (method === 'GET') {
        return currentTasks;
      }
      if (method === 'POST') {
        const newTask = {
          _id: 'task_' + Date.now(),
          title: body.title,
          assignee: body.assignee,
          status: 'todo',
          workspaceId: startupId
        };
        currentTasks.push(newTask);
        setLocal(localKey, currentTasks);
        return newTask;
      }
      if (method === 'PUT') {
        const taskId = parts[4];
        const updatedTasks = currentTasks.map(t => {
          if (t._id === taskId) {
            return { ...t, ...body };
          }
          return t;
        });
        setLocal(localKey, updatedTasks);
        return { message: 'Task updated successfully' };
      }
      if (method === 'DELETE') {
        const taskId = parts[4];
        const filteredTasks = currentTasks.filter(t => t._id !== taskId);
        setLocal(localKey, filteredTasks);
        return { message: 'Task deleted successfully' };
      }
    }

    if (endpoint === '/notifications') {
      return getLocal('local_notifications');
    }

    return [];
  };

  if (!token) {
    console.warn(`No auth token found. Executing offline fallback for ${endpoint}`);
    return executeLocalMock(endpoint, options);
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
      },
      ...options
    });

    if (response.status === 401) {
      console.warn(`Unauthorized (401) on ${endpoint}. Executing offline fallback.`);
      return executeLocalMock(endpoint, options);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return executeLocalMock(endpoint, options);
    }
    return data;
  } catch (error) {
    console.warn(`Network error on ${endpoint}. Executing offline fallback.`);
    return executeLocalMock(endpoint, options);
  }
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
      const stored = localStorage.getItem('saved_profiles');
      const userList = stored ? JSON.parse(stored) : demoUsers;
      const matched = userList.find(
        (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
      );

      if (matched) {
        const data = {
          _id: matched._id || matched.email,
          name: matched.name,
          email: matched.email,
          role: matched.role,
          phone: matched.phone || '',
          profilePicture: matched.profilePicture || '',
          title: matched.title || (matched.role === 'Founder' ? 'Founder' : 'Software Engineer')
        };
        localStorage.setItem('active_session', JSON.stringify(data));
        setCurrentUser(data);
        return data;
      }

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
      const stored = localStorage.getItem('saved_profiles');
      let userList = [];
      try {
        userList = stored ? JSON.parse(stored) : [...demoUsers];
      } catch (e) {
        userList = [...demoUsers];
      }

      const exists = userList.some((item) => item.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw new Error('Account with this email already exists.');
      }

      const payload = {
        _id: 'local_' + Date.now(),
        name,
        email,
        password,
        role,
        phone,
        profilePicture: '',
        title: role === 'Founder' ? 'Startup Founder' : 'Developer / Designer'
      };

      userList.push(payload);
      localStorage.setItem('saved_profiles', JSON.stringify(userList));

      const data = {
        _id: payload._id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        phone: payload.phone,
        profilePicture: payload.profilePicture,
        title: payload.title
      };
      localStorage.setItem('active_session', JSON.stringify(data));
      setCurrentUser(data);
      return data;
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
