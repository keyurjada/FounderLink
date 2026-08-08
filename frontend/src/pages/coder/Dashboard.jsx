import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography, Box } from '@mui/material';

import MetricCard from '../../components/MetricCard.jsx';
import RecentStartups from '../../components/RecentStartups.jsx';
import QuickActions from '../../components/QuickActions.jsx';
import { SessionContext } from '../../context/SessionProvider.jsx';
import { dashboardStats } from '../../data/localFeed';

export default function Dashboard() {
  const { currentUser, fetchApi } = useContext(SessionContext);
  const [stats, setStats] = useState([
    { id: 'matches', title: 'Best Matches', value: '0', trend: '0 startup opportunities', color: '#10b981' },
    { id: 'applications', title: 'Active Pitches', value: '0', trend: '0 pending response', color: '#f59e0b' },
    { id: 'workspaces', title: 'Workspaces Active', value: '0', trend: '0 active', color: '#a855f7' },
    { id: 'interviews', title: 'Interviews Booked', value: '0', trend: 'No upcoming interviews', color: '#f43f5e' }
  ]);

  // Intercept browser back/forward buttons and keyboard left/right arrow keys
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
    };
    window.addEventListener('popstate', handlePopState);

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const loadCoderMetrics = async () => {
      if (!currentUser) return;

      try {
        const ideas = await fetchApi('/idea');
        const applications = await fetchApi('/applications');
        const workspaces = await fetchApi('/workspaces');

        const otherStartups = Array.isArray(ideas)
          ? ideas.filter((item) => (item.userId?._id || item.userId) !== currentUser._id)
          : [];

        const myApplications = Array.isArray(applications) ? applications : [];
        const pendingApplications = myApplications.filter(
          (app) => app.status === 'Pending' || app.status === 'Under Review'
        ).length;

        const activeWorkspaces = Array.isArray(workspaces) ? workspaces.length : 0;
        const savedInterviews = Number(localStorage.getItem('coder_interviews') || '0');

        setStats([
          {
            id: 'matches',
            title: 'Best Matches',
            value: otherStartups.length.toString(),
            trend: `${otherStartups.length} startup opportunities`,
            color: '#10b981'
          },
          {
            id: 'applications',
            title: 'Active Pitches',
            value: myApplications.length.toString(),
            trend: `${pendingApplications} pending response`,
            color: '#f59e0b'
          },
          {
            id: 'workspaces',
            title: 'Workspaces Active',
            value: activeWorkspaces.toString(),
            trend: `${activeWorkspaces} active`,
            color: '#a855f7'
          },
          {
            id: 'interviews',
            title: 'Interviews Booked',
            value: savedInterviews.toString(),
            trend: savedInterviews > 0 ? `${savedInterviews} upcoming` : 'No upcoming interviews',
            color: '#f43f5e'
          }
        ]);
      } catch (error) {
        console.error('Error loading coder dashboard metrics:', error);
      }
    };

    loadCoderMetrics();

    const handleStorage = () => loadCoderMetrics();
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [currentUser, fetchApi]);

  // Coder Dashboard (Original Layout)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          Welcome back, {currentUser?.name || 'Partner'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          View potential startup matches, manage applications, and connect with technical co-founders.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <MetricCard {...item} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
              Co-Founder Search Pipeline
            </Typography>
            <RecentStartups />
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <QuickActions />
          
        </Grid>
      </Grid>
    </Box>
  );
}


