import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Chip, Button, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, Chat as ChatIcon } from '@mui/icons-material';

const mockCandidates = [
  {
    id: 1,
    name: "Harsh Shah",
    title: "AI Researcher & Data Engineer",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQFkhRKa6nIWaA/profile-displayphoto-crop_800_800/B4DZfKFIwMGkAI-/0/1751442034266?e=1785369600&v=beta&t=sqgpjCQFJeAnABF_Jc7p41z7zDbme8qgQP2Az1Un9CI",
    skills: ["Python", "PyTorch", "TensorFlow", "Scikit-Learn"],
    bio: "Ex-Google researcher specializing in NLP and LLM finetuning. Looking for a product-focused co-founder to build AI carbon accounting workflows.",
    matchScore: 94
  },
  {
    id: 2,
    name: "Kaushal Dudakiya",
    title: "Chief Product Officer / UI Architect",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQFaRAg9Q_l7Hg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1689217191833?e=1785369600&v=beta&t=tX_Klj3e_NkUuBJPseUDFZj4j2KaIIFjOWKeW7vvY5s",
    skills: ["Figma", "React.js", "TailwindCSS", "Product Strategy"],
    bio: "Designed products with 10M+ active users. Passionate about sustainability. Seeking a technical backend co-founder for a micro-mobility platform.",
    matchScore: 89
  },
  {
    id: 3,
    name: "Prof. Jevin Parmar",
    title: "Senior Backend Developer",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQHo23MM6D0Uew/profile-displayphoto-crop_800_800/B56Z3fgY.aKkAI-/0/1777571310804?e=1785369600&v=beta&t=yaiO_D6qNOacghu2DvpvgdPDTdJFo7FY3AaTLl3AG00",
    skills: ["Golang", "PostgreSQL", "Docker", "Kubernetes", "gRPC"],
    bio: "Infrastructure engineer with startup experience. Built high-scale financial ledgers. Looking to join an early-stage fintech team.",
    matchScore: 85
  }
];

export default function Match() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockCandidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          Co-Founder Matcher
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Connect with vetted developers, designers, and visionaries aligned with your startup requirements.
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
