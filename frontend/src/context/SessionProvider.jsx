import React, { createContext, useState, useEffect } from 'react';

export const SessionContext = createContext();

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

export const SessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('active_session');
    if (raw) {
      setCurrentUser(JSON.parse(raw));
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
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
    } else {
      throw new Error('Details not found. Try: alex.rivera@devmail.com / password');
    }
  };

  const registerUser = async (name, email, password, role) => {
    const stored = localStorage.getItem('saved_profiles');
    let userList = stored ? JSON.parse(stored) : [...demoUsers];

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
  };

  const logoutUser = () => {
    localStorage.removeItem('active_session');
    setCurrentUser(null);
  };

  return (
    <SessionContext.Provider value={{ currentUser, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </SessionContext.Provider>
  );
};
