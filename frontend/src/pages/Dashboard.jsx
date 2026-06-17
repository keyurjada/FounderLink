import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import MetricCard from '../components/MetricCard.jsx';
import RecentStartups from '../components/RecentStartups.jsx';
import QuickActions from '../components/QuickActions.jsx';
import { metricsData } from '../data/mockData';

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Welcome Heading */}
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          FounderLink Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Review matching co-founder opportunities and track application statuses.
        </Typography>
      </Box>

      {/* Metrics widgets */}
      <Grid container spacing={3}>
        {metricsData.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Main grids split: Startups & Actions */}
      <Grid container spacing={3}>
        {/* Startup cards feed */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
              Startups Recruiting Technical Co-Founders
            </Typography>
            <RecentStartups />
          </Box>
        </Grid>

        {/* Action Widgets panel */}
        <Grid item xs={12} lg={4}>
          <QuickActions />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
