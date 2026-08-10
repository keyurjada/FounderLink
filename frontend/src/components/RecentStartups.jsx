import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Chip, 
  Button, 
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  LocationOn as LocationIcon, 
  MonetizationOn as EquityIcon, 
  RocketLaunch as StageIcon,
  ChevronRight as ArrowIcon
} from '@mui/icons-material';
import { startupList } from '../data/localFeed';
import { SessionContext } from '../context/SessionProvider.jsx';

const RecentStartups = () => {
  const { currentUser, fetchApi, setGlobalLoading } = useContext(SessionContext);
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [myApplications, setMyApplications] = useState([]);

 useEffect(() => {
  const loadStartups = async () => {
    try {
      // Get all startup projects
      const startupData = await fetchApi('/idea');

      // Get applications submitted by this coder
      const applicationData = await fetchApi('/applications');
      setMyApplications(Array.isArray(applicationData) ? applicationData : []);

      // Get startup IDs where founder has ACCEPTED or REJECTED this coder
      const hiddenStartupIds = new Set(
        (Array.isArray(applicationData) ? applicationData : [])
          .filter((application) => application.status === 'Accepted' || application.status === 'Rejected')
          .map((application) => {
            // startupId is populated by your backend
            if (
              application.startupId &&
              typeof application.startupId === 'object'
            ) {
              return application.startupId._id;
            }

            return application.startupId;
          })
      );

      console.log("Hidden startup IDs:", hiddenStartupIds);

      // Remove accepted/rejected projects from Co-Founder Search Pipeline
      const availableStartups = (
        Array.isArray(startupData) ? startupData : []
      ).filter((startup) => !hiddenStartupIds.has(startup._id));

      const mapped = availableStartups.map(item => ({
        id: item._id,
        name: item.startuptitle,
        tagline: item.category,
        equity: `${item.equity}%`,
        description: item.description,
        location: "Remote",
        stage: "Seed",
        skillsRequired: item.skillsRequired || [],
        avatarColor: "#4f46e5",
        founder: "Founder"
      }));

      setStartups(mapped);

    } catch (e) {
      console.error("Error loading startups:", e);
      setStartups([]);
    }
  };

  loadStartups();
}, [fetchApi]);

  const handleOpenApply = (startup) => {
    setSelectedStartup(startup);
    setResumeFile(null);
  };

  const handleCloseApply = () => {
    setSelectedStartup(null);
    setResumeFile(null);
  };

  const handleSubmitApplication = async () => {
    if (!selectedStartup || !resumeFile) {
      return;
    }

    setGlobalLoading(true);

    try {
      const formData = new FormData();
      formData.append('startupId', selectedStartup.id);
      formData.append('resume', resumeFile);

      await fetchApi('/applications', {
        method: 'POST',
        body: formData
      });

      const apps = await fetchApi('/applications').catch(() => []);
      setMyApplications(Array.isArray(apps) ? apps : []);

      setSnackbarOpen(true);
      handleCloseApply();
    } catch (e) {
      console.warn('Backend submit failed:', e);
      setSnackbarOpen(true);
      handleCloseApply();
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {startups.map((startup) => (
          <Grid item xs={12} key={startup.id}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                backgroundImage: 'none',
                boxShadow: 'none',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Grid container spacing={2} alignItems="flex-start">
                  
                  {/* Left Column: Avatar & Core info */}
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: startup.avatarColor, 
                          width: 52, 
                          height: 52, 
                          borderRadius: '14px',
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#fff'
                        }}
                      >
                        {startup.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ lineHeight: 1.2 }}>
                            {startup.name}
                          </Typography>
                          <Chip 
                            icon={<StageIcon sx={{ fontSize: '12px !important' }} />} 
                            label={startup.stage} 
                            size="small" 
                            variant="outlined" 
                            sx={{ borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}
                          />
                        </Box>
                        <Typography variant="body2" color="primary.main" fontWeight={500} sx={{ mt: 0.5 }}>
                          {startup.tagline}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2.5, lineHeight: 1.6, maxWidth: '680px' }}>
                      {startup.description}
                    </Typography>

                    {/* Metadata Chips row */}
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        icon={<LocationIcon sx={{ fontSize: '14px !important' }} />} 
                        label={startup.location} 
                        size="small" 
                        sx={{ bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: '6px', color: 'text.secondary' }}
                      />
                      <Chip 
                        icon={<EquityIcon sx={{ fontSize: '14px !important' }} />} 
                        label={`${startup.equity} Equity`} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(16, 185, 129, 0.08)', border: '1px solid', borderColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '6px', color: 'secondary.main', fontWeight: 600 }}
                      />
                    </Box>

                    {/* Tech Stacks Required */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="caption" color="text.disabled" fontWeight="bold" sx={{ mr: 0.5 }}>
                        REQUIRED SKILLS:
                      </Typography>
                      {startup.skillsRequired.map((skill) => (
                        <Chip 
                          key={skill} 
                          label={skill} 
                          size="small" 
                          variant="outlined"
                          sx={{ borderRadius: '4px', fontSize: '11px', height: '22px' }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* Right Column: Actions */}
                  <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignSelf: 'center', mt: { xs: 2, md: 0 } }}>
                    {(() => {
                      const existingApp = myApplications.find(app => (app.startupId?._id || app.startupId) === startup.id);
                      if (existingApp) {
                        return (
                          <Button variant="contained" disabled sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 'bold', textTransform: 'none' }}>
                            Application Sent
                          </Button>
                        );
                      }
                      return (
                        <Button 
                          variant="contained" 
                          onClick={() => handleOpenApply(startup)}
                          endIcon={<ArrowIcon />}
                          sx={{ 
                            borderRadius: 2, 
                            px: 3, 
                            py: 1, 
                            fontWeight: 'bold', 
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                            }
                          }}
                        >
                          Apply to Match
                        </Button>
                      );
                    })()}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Application Dialog Modal */}
      <Dialog 
        open={Boolean(selectedStartup)} 
        onClose={handleCloseApply} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1.5,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            backgroundImage: 'none'
          }
        }}
      >
        {selectedStartup && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
              Apply to join {selectedStartup.name}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload your resume so the founder can review your profile and experience for this startup opportunity.
              </Typography>

              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                  }
                }}
                onClick={() => document.getElementById('dashboard-pdf-upload').click()}
              >
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                  {resumeFile ? resumeFile.name : 'Upload your resume / profile PDF'}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Click here to select a PDF file
                </Typography>

                <input
                  id="dashboard-pdf-upload"
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setResumeFile(file);
                    }
                  }}
                />

                {resumeFile && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{
                      display: 'block',
                      mt: 2,
                      fontWeight: 'bold'
                    }}
                  >
                    PDF selected ✓
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleCloseApply} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitApplication} 
                variant="contained" 
                disabled={!resumeFile}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Send Application
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Successful alert notification */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          Application submitted successfully! Founder has been notified.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecentStartups;
