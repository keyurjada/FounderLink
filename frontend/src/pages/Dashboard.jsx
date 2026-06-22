import React, { useContext } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { SessionContext } from '../context/SessionProvider.jsx';
import MetricCard from '../components/MetricCard.jsx';
import RecentStartups from '../components/RecentStartups.jsx';
import QuickActions from '../components/QuickActions.jsx';
import { dashboardStats } from '../data/localFeed';

export default function Dashboard() {
  const { currentUser } = useContext(SessionContext);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          Welcome back, {currentUser?.name || 'Partner'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          View potential startup matches, manage pitches, and connect with technical co-founders.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {dashboardStats.map((item) => (
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
