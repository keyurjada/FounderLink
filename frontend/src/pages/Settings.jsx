import React, { useState, useContext } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, Alert } from '@mui/material';
import { SessionContext } from '../context/SessionProvider.jsx';

export default function Settings() {
  const { currentUser } = useContext(SessionContext);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [title, setTitle] = useState(currentUser?.title || '');
  const [success, setSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(false);
    
    // Update both active session and profile database
    const active = JSON.parse(localStorage.getItem('active_session') || '{}');
    const updatedUser = { ...active, name, email, title };
    localStorage.setItem('active_session', JSON.stringify(updatedUser));

    // Update global list of saved profiles
    const saved = JSON.parse(localStorage.getItem('saved_profiles') || '[]');
    const idx = saved.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      saved[idx] = { ...saved[idx], name, title };
      localStorage.setItem('saved_profiles', JSON.stringify(saved));
    }

    setSuccess(true);
    // Dispatch storage event to alert components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          Account Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage your personal details, profile descriptions, and partner match parameters.
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
          boxShadow: 'none',
          maxWidth: '650px'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              Settings updated successfully! Changes reflect instantly.
            </Alert>
          )}

          <form onSubmit={handleSave}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  disabled
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  helperText="Primary email cannot be changed."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Professional Title"
                  variant="outlined"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ borderRadius: 2, px: 4, py: 1.2, textTransform: 'none', fontWeight: 'bold' }}
                >
                  Save Settings
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
