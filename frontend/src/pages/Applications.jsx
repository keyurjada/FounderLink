import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Delete as DeleteIcon, OpenInNew as ViewIcon } from '@mui/icons-material';

export default function Applications() {
  const [pitches, setPitches] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pitchToDelete, setPitchToDelete] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('active_pitches');
    if (raw) {
      setPitches(JSON.parse(raw));
    } else {
      // Seed default applications
      const defaults = [
        {
          id: 101,
          startupName: "EcoSphere AI",
          founder: "Sarah Jenkins",
          pitchText: "Hi Sarah! I am a full stack developer with experience in React and Python. I'd love to join you and build out the carbon offset verification engine.",
          status: "Under Review",
          time: "2 hours ago",
          color: "warning"
        },
        {
          id: 102,
          startupName: "FinFlow Solutions",
          founder: "David Miller",
          pitchText: "Hey David, your stablecoin automated invoicing flows sound amazing. I have extensive experience building React + TypeScript dashboards.",
          status: "Accepted",
          time: "1 day ago",
          color: "success"
        }
      ];
      localStorage.setItem('active_pitches', JSON.stringify(defaults));
      setPitches(defaults);
    }
  }, []);

  const handleOpenDeleteDialog = (id) => {
    setPitchToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pitchToDelete) {
      const updated = pitches.filter(p => p.id !== pitchToDelete);
      localStorage.setItem('active_pitches', JSON.stringify(updated));
      setPitches(updated);
      window.dispatchEvent(new Event('storage'));
    }
    setDeleteDialogOpen(false);
    setPitchToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPitchToDelete(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          My Applications
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Track and manage your submitted pitches, partnership applications, and co-founder match status.
        </Typography>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 3, 
          border: '1px solid', 
          borderColor: 'divider', 
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
          boxShadow: 'none',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Startup</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Founder</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Cover Letter / Pitch</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pitches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No active pitches found. Go to Dashboard or Co-Founder Matcher to apply.
                </TableCell>
              </TableRow>
            ) : (
              pitches.map((pitch) => (
                <TableRow 
                  key={pitch.id} 
                  sx={{ 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {pitch.startupName}
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {pitch.founder}
                  </TableCell>
                  <TableCell sx={{ maxWidth: '300px', color: 'text.secondary', fontSize: '13px' }}>
                    {pitch.pitchText}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={pitch.status || "Pending"} 
                      size="small" 
                      color={pitch.color || "info"}
                      sx={{ borderRadius: '6px', fontWeight: 600, fontSize: '11px' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(pitch.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Pitch Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
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
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Application Pitch</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            Are you sure you want to withdraw and delete this co-founder application? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
          <Button onClick={handleCancelDelete} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ borderRadius: 2, textTransform: 'none', backgroundColor: '#f43f5e' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
