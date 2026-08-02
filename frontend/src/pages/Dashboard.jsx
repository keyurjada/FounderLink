import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Box, Paper, Avatar, Chip, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { SessionContext } from '../context/SessionProvider.jsx';
import MetricCard from '../components/MetricCard.jsx';
import RecentStartups from '../components/RecentStartups.jsx';
import QuickActions from '../components/QuickActions.jsx';
import { Add as AddIcon, People as PeopleIcon, Assignment as AssignmentIcon, ChevronRight as NextIcon } from '@mui/icons-material';
import { dashboardStats } from '../data/localFeed';

export default function Dashboard() {
  const { currentUser, fetchApi } = useContext(SessionContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(dashboardStats);
  const [founderStats, setFounderStats] = useState([
    { id: 'listings', title: 'Active Startup Projects', value: '0', change: 'Listed startup projects', trend: '0 online', isPositive: true },
    { id: 'pitches', title: 'Received Applications & Requests', value: '0', change: 'Developer applications', trend: '0 pending review', isPositive: true },
    { id: 'workspaces', title: 'Team Workspaces', value: '0', change: 'Active teams', trend: 'Collaborating teams', isPositive: true },
    { id: 'role', title: 'Member Tier', value: 'Founder', change: 'Standard', trend: 'Access Level: Owner', isPositive: true }
  ]);
  const [candidates, setCandidates] = useState([]);

  const isFounder = currentUser?.role === 'Founder';

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

  // Coder stats auto-updater
  useEffect(() => {
    if (!isFounder) {
      const updateStats = () => {
        const pitches = JSON.parse(localStorage.getItem('active_pitches') || '[]');
        setStats(dashboardStats.map(s => {
          if (s.id === 'applications') {
            return {
              ...s,
              value: pitches.length.toString(),
              trend: `${pitches.filter(p => p.status === 'Under Review' || p.status === 'Pending').length} pending response`
            };
          }
          return s;
        }));
      };

      updateStats();
      window.addEventListener('storage', updateStats);
      return () => window.removeEventListener('storage', updateStats);
    }
  }, [isFounder]);

  // Founder stats auto-updater
  useEffect(() => {
    if (isFounder && currentUser) {
      const loadFounderMetrics = async () => {
        try {
          const ideas = await fetchApi('/idea');
          const ownedIdeas = ideas.filter(item => {
            const ownerId = item.userId?._id || item.userId;
            return ownerId === currentUser?._id;
          });

          const pitches = await fetchApi('/applications/received');
          const pendingPitchesCount = pitches.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;

          const workspaces = await fetchApi('/workspaces');

          setFounderStats([
            { id: 'listings', title: 'Active Startup Projects', value: ownedIdeas.length.toString(), change: 'Listed startup projects', trend: `${ownedIdeas.length} online`, isPositive: true },
            { id: 'pitches', title: 'Received Applications & Requests', value: pitches.length.toString(), change: 'Developer applications', trend: `${pendingPitchesCount} pending review`, isPositive: true },
            { id: 'workspaces', title: 'Team Workspaces', value: workspaces.length.toString(), change: 'Active teams', trend: 'Collaborating teams', isPositive: true },
            { id: 'role', title: 'Member Tier', value: 'Founder', change: 'Standard', trend: 'Access Level: Owner', isPositive: true }
          ]);
        } catch (e) {
          console.error(e);
        }
      };

      const loadTalents = async () => {
        try {
          const data = await fetchApi('/auth/talents');
          if (data && data.length > 0) {
            setCandidates(data.slice(0, 3));
          }
        } catch (e) {
          console.error(e);
        }
      };

      loadFounderMetrics();
      loadTalents();
    }
  }, [currentUser, isFounder, fetchApi]);

  if (isFounder) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
            Welcome back, {currentUser?.name || 'Founder'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your startup projects, review developer applications, and connect with technical co-founders.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {founderStats.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <MetricCard {...item} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Main left content column */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                Featured Technical Candidates
              </Typography>
              
              {candidates.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    backgroundColor: 'background.paper'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No developer candidates found in database. Share your project to attract talent!
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {candidates.map((candidate) => (
                    <Paper
                      key={candidate._id}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar 
                          src={candidate.profilePicture || "https://img.icons8.com/color/96/user-male-circle--v1.png"} 
                          sx={{ width: 52, height: 52 }} 
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                            {candidate.name}
                          </Typography>
                          <Typography variant="caption" color="primary.main" fontWeight="medium">
                            {candidate.title || 'Technical Coder'}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13.5px' }}>
                        {candidate.bio || 'Experienced developer looking to collaborate with startup founders.'}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {(candidate.skills || ['React', 'Node.js']).map((skill, index) => (
                          <Chip key={index} label={skill} size="small" sx={{ fontSize: '10px' }} />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button 
                          variant="contained" 
                          size="small" 
                          onClick={() => alert("Developer Candidate Invitation sent successfully!")}
                          sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                          Invite to Project
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right quick controls sidebar */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                Founder Controls
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  overflow: 'hidden'
                }}
              >
                <List disablePadding>
                  <ListItem disablePadding divider sx={{ borderColor: 'divider' }}>
                    <ListItemButton onClick={() => navigate('/Ideaform')} sx={{ py: 2 }}>
                      <ListItemIcon sx={{ color: 'primary.main' }}><AddIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Create Startup Project" 
                        secondary="List a new startup project" 
                        primaryTypographyProps={{ fontWeight: 'bold', fontSize: '14px' }}
                        secondaryTypographyProps={{ fontSize: '11px' }}
                      />
                      <NextIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding divider sx={{ borderColor: 'divider' }}>
                    <ListItemButton onClick={() => navigate('/match')} sx={{ py: 2 }}>
                      <ListItemIcon sx={{ color: 'secondary.main' }}><PeopleIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Browse Coders" 
                        secondary="Search coder profiles" 
                        primaryTypographyProps={{ fontWeight: 'bold', fontSize: '14px' }}
                        secondaryTypographyProps={{ fontSize: '11px' }}
                      />
                      <NextIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding divider sx={{ borderColor: 'divider' }}>
                    <ListItemButton onClick={() => navigate('/applications')} sx={{ py: 2 }}>
                      <ListItemIcon sx={{ color: 'success.main' }}><AssignmentIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Review Received Applications & Requests" 
                        secondary="Evaluate incoming developer applications & requests" 
                        primaryTypographyProps={{ fontWeight: 'bold', fontSize: '14px' }}
                        secondaryTypographyProps={{ fontSize: '11px' }}
                      />
                      <NextIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

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
