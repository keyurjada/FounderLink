import React, { createContext, useState, useEffect } from 'react';

export const SessionContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/auth';

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

export const SessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setCurrentUser(user);
          localStorage.setItem('active_session', JSON.stringify(user));
          setLoading(false);
          return;
        } catch (error) {
          localStorage.removeItem('auth_token');
        }
      }

      if (raw) {
        setCurrentUser(JSON.parse(raw));
      }
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

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('active_session', JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role,
        title: data.title || (data.role === 'Founder' ? 'Founder' : 'Software Engineer')
      }));
      setCurrentUser({
        name: data.name,
        email: data.email,
        role: data.role,
        title: data.title || (data.role === 'Founder' ? 'Founder' : 'Software Engineer')
      });
      return data;
    } catch (error) {
      const stored = localStorage.getItem('saved_profiles');
      const userList = stored ? JSON.parse(stored) : demoUsers;
      const matched = userList.find(
        (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
      );

      if (matched) {
        const data = {
          name: matched.name,
          email: matched.email,
          role: matched.role,
          title: matched.title || (matched.role === 'Founder' ? 'Founder' : 'Software Engineer')
        };
        localStorage.setItem('active_session', JSON.stringify(data));
        setCurrentUser(data);
        return data;
      }

      throw error;
    }
  };

  const registerUser = async (name, email, password, role) => {
    try {
      const data = await requestJson('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      });

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('active_session', JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role,
        title: data.title || (data.role === 'Founder' ? 'Founder' : 'Software Engineer')
      }));
      setCurrentUser({
        name: data.name,
        email: data.email,
        role: data.role,
        title: data.title || (data.role === 'Founder' ? 'Founder' : 'Software Engineer')
      });
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
        name,
        email,
        password,
        role,
        title: role === 'Founder' ? 'Startup Founder' : 'Developer / Designer'
      };

      userList.push(payload);
      localStorage.setItem('saved_profiles', JSON.stringify(userList));

      const data = {
        name: payload.name,
        email: payload.email,
        role: payload.role,
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

  return (
    <SessionContext.Provider value={{ currentUser, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </SessionContext.Provider>
  );
};
