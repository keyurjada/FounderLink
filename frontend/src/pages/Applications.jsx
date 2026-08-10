import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Delete as DeleteIcon, OpenInNew as ViewIcon } from '@mui/icons-material';
import { SessionContext } from '../context/SessionProvider.jsx';

export default function Applications() {
  const { currentUser, fetchApi } = useContext(SessionContext);
  const [pitches, setPitches] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pitchToDelete, setPitchToDelete] = useState(null);
  const [statusDialog, setStatusDialog] = useState({ open: false, id: null, status: null });

  useEffect(() => {
    const loadPitches = async () => {
      try {
        const endpoint = currentUser?.role === 'Founder' ? '/applications/received' : '/applications';
        const data = await fetchApi(endpoint);
        if (data && data.length > 0) {
          const mapped = data.map(p => ({
            id: p._id,
            startupName: p.startupId?.startuptitle || "Startup",
            founder: p.applicantId?.name || "Candidate",
            pitchText: p.pitchText,
            resume: p.resume ? p.resume.replace(/\\/g, '/') : null,
            status: p.status,
            time: new Date(p.createdAt).toLocaleDateString(),
            color: p.status === 'Accepted' ? 'success' : p.status === 'Rejected' ? 'error' : 'warning'
          }));
          setPitches(mapped);
        } else {
          setPitches([]);
        }
      } catch (e) {
        setPitches([]);
      }
    };

    loadPitches();
  }, [currentUser, fetchApi]);

  const handleOpenDeleteDialog = (id) => {
    setPitchToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pitchToDelete) {
      try {
        await fetchApi(`/applications/${pitchToDelete}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.warn("Backend delete failed, fallback to local:", e);
      }

      const updated = pitches.filter(p => p.id !== pitchToDelete);
      setPitches(updated);
    }
    setDeleteDialogOpen(false);
    setPitchToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPitchToDelete(null);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetchApi(`/applications/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      
      setPitches(pitches.map(p => {
        if (p.id === id) {
          return {
            ...p,
            status: newStatus,
            color: newStatus === 'Accepted' ? 'success' : newStatus === 'Rejected' ? 'error' : 'warning'
          };
        }
        return p;
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const confirmStatusUpdate = (id, newStatus) => {
    setStatusDialog({ open: true, id, status: newStatus });
  };

  const handleConfirmStatus = () => {
    if (statusDialog.id && statusDialog.status) {
      handleUpdateStatus(statusDialog.id, statusDialog.status);
    }
    setStatusDialog({ open: false, id: null, status: null });
  };

  const isFounder = currentUser?.role === 'Founder';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          {isFounder ? "Received Applications & Requests" : "Sent Applications"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isFounder 
            ? "Review and approve/reject co-founder applications submitted by developers to join your startup projects." 
            : "Track and manage your submitted pitches, partnership applications, and co-founder match status."}
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
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{isFounder ? "Applicant" : "Founder"}</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Resume & Pitch</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pitches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  {isFounder ? "No applications or requests received yet." : "No active applications or requests found. Go to Explore Startups to apply."}
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
                    <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                      {pitch.pitchText}
                    </Typography>
                    {pitch.resume && (
                      <Button 
                        size="small" 
                        variant="text" 
                        onClick={() => window.open(`http://localhost:5005/${pitch.resume}`, '_blank')}
                        sx={{ textTransform: 'none', fontWeight: 'bold', p: 0 }}
                      >
                        View Resume PDF
                      </Button>
                    )}
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
                    {isFounder ? (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {pitch.status !== 'Rejected' && (
                          <Button 
                            variant="contained" 
                            color="success" 
                            size="small" 
                            onClick={() => confirmStatusUpdate(pitch.id, 'Accepted')}
                            disabled={pitch.status === 'Accepted'}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            {pitch.status === 'Accepted' ? 'Accepted' : 'Accept'}
                          </Button>
                        )}
                        {pitch.status !== 'Accepted' && (
                          <Button 
                            variant="outlined" 
                            color="error" 
                            size="small" 
                            onClick={() => confirmStatusUpdate(pitch.id, 'Rejected')}
                            disabled={pitch.status === 'Rejected'}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            {pitch.status === 'Rejected' ? 'Rejected' : 'Reject'}
                          </Button>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(pitch.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
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
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Application Request</DialogTitle>
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

      {/* Accept/Reject Status Confirmation Dialog */}
      <Dialog
        open={statusDialog.open}
        onClose={() => setStatusDialog({ open: false, id: null, status: null })}
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
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Confirm {statusDialog.status === 'Accepted' ? 'Acceptance' : 'Rejection'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            Are you sure you want to {statusDialog.status === 'Accepted' ? 'accept' : 'reject'} this candidate's application?
            {statusDialog.status === 'Accepted' && ' A workspace will be created for your collaboration.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
          <Button onClick={() => setStatusDialog({ open: false, id: null, status: null })} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmStatus} 
            variant="contained" 
            color={statusDialog.status === 'Accepted' ? 'success' : 'error'} 
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Confirm {statusDialog.status}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
