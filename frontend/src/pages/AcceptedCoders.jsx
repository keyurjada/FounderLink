import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, Button, Divider } from '@mui/material';
import { OpenInNew as ViewIcon, Email as EmailIcon } from '@mui/icons-material';
import { SessionContext } from '../context/SessionProvider.jsx';

export default function AcceptedCoders() {
  const { currentUser, fetchApi } = useContext(SessionContext);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccepted = async () => {
      try {
        setLoading(true);
        const data = await fetchApi('/applications/received');
        if (data && data.length > 0) {
          const accepted = data.filter(app => app.status === 'Accepted');
          
          // Group by startup
          const groups = {};
          accepted.forEach(app => {
            const startup = app.startupId;
            if (!startup) return;
            const sId = startup._id;
            if (!groups[sId]) {
              groups[sId] = {
                startupTitle: startup.startuptitle || "Untitled Startup",
                category: startup.category,
                coders: []
              };
            }
            
            // Map applicant data with the stored resume
            const coderData = {
              ...app.applicantId,
              resume: app.resume || app.applicantId?.resume
            };
            groups[sId].coders.push(coderData);
          });
          
          setGroupedData(groups);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.role === 'Founder') {
      loadAccepted();
    }
  }, [currentUser, fetchApi]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          Accepted Coders Allocation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          View the technical co-founders you have officially accepted, organized by your startup projects.
        </Typography>
      </Box>

      {loading && (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          Loading your accepted coders...
        </Typography>
      )}

      {!loading && Object.keys(groupedData).length === 0 && (
        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', boxShadow: 'none' }}>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">No Accepted Coders Yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Once you accept applications from the "Received Applications" tab, they will appear here organized by project.
            </Typography>
          </CardContent>
        </Card>
      )}

      {!loading && Object.values(groupedData).map((project, idx) => (
        <Box key={idx} sx={{ mb: 4 }}>
          {/* Project Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: 'primary.main' }}>
              {project.startupTitle}
            </Typography>
            {project.category && (
              <Chip label={project.category} size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: 'primary.main', fontWeight: 'bold' }} />
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />

          {/* Grid of Coders for this Project */}
          <Grid container spacing={3}>
            {project.coders.map((coder, cIdx) => (
              <Grid item xs={12} md={6} lg={4} key={cIdx}>
                <Card sx={{ 
                  borderRadius: 3, 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  backgroundColor: 'background.paper',
                  boxShadow: 'none',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main'
                  }
                }}>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Avatar sx={{ width: 56, height: 56, bgcolor: 'secondary.main', fontWeight: 'bold', color: '#000' }}>
                        {coder.name ? coder.name.charAt(0).toUpperCase() : (coder.firstname ? coder.firstname.charAt(0).toUpperCase() : '?')}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                          {coder.name || `${coder.firstname || ''} ${coder.lastname || ''}`.trim() || 'Anonymous Coder'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon sx={{ fontSize: 14 }} /> {coder.email}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Tech Stack */}
                    <Box sx={{ mb: 3, flexGrow: 1 }}>
                      <Typography variant="caption" fontWeight="bold" color="text.disabled" sx={{ display: 'block', mb: 1 }}>
                        TECH STACK
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(coder.skills && coder.skills.length > 0) ? (
                          coder.skills.map((skill, sIdx) => (
                            <Chip key={sIdx} label={skill} size="small" variant="outlined" sx={{ borderRadius: 1.5, fontSize: '11px', height: '22px' }} />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '13px' }}>No skills listed</Typography>
                        )}
                      </Box>
                    </Box>
                    
                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                      {coder.resume && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<ViewIcon />} 
                          fullWidth
                          onClick={() => window.open(`http://localhost:5005/${coder.resume.replace(/\\/g, '/')}`, '_blank')}
                          sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 'bold' }}
                        >
                          View Resume
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
