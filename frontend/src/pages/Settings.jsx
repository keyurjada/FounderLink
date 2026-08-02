import React, { useState, useContext, useRef } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, Alert, Avatar, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { SessionContext } from '../context/SessionProvider.jsx';

export default function Settings() {
  const { currentUser, setCurrentUser, fetchApi, setGlobalLoading } = useContext(SessionContext);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [title, setTitle] = useState(currentUser?.title || '');
  const [profilePic, setProfilePic] = useState(currentUser?.profilePicture || '');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for base64 simplicity
        setError('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setGlobalLoading(true);
    setSuccess(false);
    setError('');

    try {
      const updatedUser = await fetchApi('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          phone,
          title,
          profilePicture: profilePic
        })
      });

      if (updatedUser) {
        // Also update context so Navbar picks it up
        setCurrentUser(updatedUser);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setGlobalLoading(false);
    }
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
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={profilePic}
                sx={{
                  width: 80,
                  height: 80,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  fontSize: '32px',
                  bgcolor: 'primary.main',
                  fontWeight: 'bold'
                }}
              >
                {!profilePic && name.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                onClick={() => fileInputRef.current.click()}
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  right: -8,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': { backgroundColor: 'background.default' }
                }}
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
              />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">{name || 'Your Name'}</Typography>
              <Typography variant="body2" color="text.secondary">{title} • {currentUser?.role}</Typography>
            </Box>
          </Box>
          
          <form onSubmit={handleSave}>
            <Grid container spacing={3}>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">Profile updated successfully!</Alert>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name (Uneditable)"
                  variant="filled"
                  value={name}
                  InputProps={{ readOnly: true }}
                  sx={{ '& .MuiFilledInput-root': { borderRadius: 2, backgroundColor: 'action.hover' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="filled"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 234 567 8900"
                  sx={{ '& .MuiFilledInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address (Uneditable)"
                  variant="filled"
                  value={email}
                  InputProps={{ readOnly: true }}
                  sx={{ '& .MuiFilledInput-root': { borderRadius: 2, backgroundColor: 'action.hover' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Professional Title (Uneditable)"
                  variant="filled"
                  value={title}
                  InputProps={{ readOnly: true }}
                  sx={{ '& .MuiFilledInput-root': { borderRadius: 2, backgroundColor: 'action.hover' } }}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  sx={{ 
                    borderRadius: 2, 
                    px: 4, 
                    py: 1.2, 
                    fontWeight: 'bold',
                    textTransform: 'none'
                  }}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
