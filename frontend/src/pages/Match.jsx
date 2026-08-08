import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Chip, Button, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, Chat as ChatIcon } from '@mui/icons-material';
import { SessionContext } from '../context/SessionProvider.jsx';

export default function Match() {
  const { currentUser, fetchApi } = useContext(SessionContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (currentUser?.role === 'Founder') {
      const loadTalents = async () => {
        try {
          const data = await fetchApi('/auth/talents');
          if (data && data.length > 0) {
            const mapped = data.map(item => ({
              id: item._id,
              name: item.name,
              title: item.title || "Technical Coder",
              skills: item.skills || ["React", "Node.js", "MongoDB"],
              bio: item.bio || "Experienced technical co-founder interested in partnering with early-stage startups.",
              avatar: item.profilePicture || "https://img.icons8.com/color/96/user-male-circle--v1.png",
              matchScore: 92
            }));
            setCandidates(mapped);
          }
        } catch (e) {
          console.error(e);
        }
      };
      loadTalents();
    }
  }, [currentUser, fetchApi]);

  const filtered = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          Browse Coder
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Search and connect with coders who matching your project requirements.
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by name, role, or skills..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              '& fieldset': { border: 'none' }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="outlined" 
          startIcon={<FilterIcon />}
          sx={{ borderRadius: 3, px: 3, textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
        >
          Filters
        </Button>
      </Box>

      {/* Candidates Grid */}
      <Grid container spacing={3}>
        {filtered.map((candidate) => (
          <Grid item xs={12} md={6} lg={4} key={candidate.id}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                backgroundImage: 'none',
                boxShadow: 'none',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.06)'
                }
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar 
                      src={candidate.avatar} 
                      sx={{ width: 56, height: 56, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}
                    />
                    <Chip 
                      label={`${candidate.matchScore}% Match`}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(16, 185, 129, 0.08)', 
                        color: 'secondary.main', 
                        fontWeight: 'bold',
                        fontSize: '11px',
                        border: '1px solid rgba(16, 185, 129, 0.15)',
                        borderRadius: '6px'
                      }}
                    />
                  </Box>

                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary', mb: 0.5 }}>
                    {candidate.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'block', mb: 2 }}>
                    {candidate.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.5, fontSize: '13px' }}>
                    {candidate.bio}
                  </Typography>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {candidate.skills.map((skill) => (
                      <Chip 
                        key={skill} 
                        label={skill} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '10px', height: '22px', borderRadius: '4px' }}
                      />
                    ))}
                  </Box>

                  <Button variant="contained" fullWidth startIcon={<ChatIcon />} sx={{ borderRadius: 2, py: 1, textTransform: 'none', fontWeight: 'bold' }}>
                    Connect & Chat
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
