import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ArrowForward as MoveRightIcon, ArrowBack as MoveLeftIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { SessionContext } from '../context/SessionProvider.jsx';

const initialTasks = [];

export default function Workspaces() {
  const { currentUser, fetchApi } = useContext(SessionContext);
  const [tasks, setTasks] = useState([]);
  const [startups, setStartups] = useState([]);
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');

  // Load startup lists for select dropdown
  useEffect(() => {
    if (!currentUser) return;
    const loadStartups = async () => {
      try {
        if (currentUser.role === 'Founder') {
          // Fetch all projects created by this founder
          const data = await fetchApi('/idea');
          if (data && data.length > 0) {
            const filtered = data.filter(item => {
              const ownerId = item.userId?._id || item.userId;
              return ownerId === currentUser?._id;
            });
            setStartups(filtered);
            if (filtered.length > 0) {
              setSelectedStartupId(filtered[0]._id);
            }
          }
        } else {
          // If Coder: fetch accepted pitches/applications to join workspace
          const data = await fetchApi('/applications');
          if (data && data.length > 0) {
            const accepted = data.filter(p => p.status === 'Accepted');
            const mapped = accepted.map(p => ({
              _id: p.startupId?._id || p.startupId,
              startuptitle: p.startupId?.startuptitle || "Joined Venture"
            }));
            setStartups(mapped);
            if (mapped.length > 0) {
              setSelectedStartupId(mapped[0]._id);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load startups for workspaces:", e);
      }
    };
    loadStartups();
  }, [currentUser, fetchApi]);

  // Load tasks for active selected startup
  useEffect(() => {
    if (!selectedStartupId) {
      setTasks([]);
      return;
    }
    const loadTasks = async () => {
      try {
        const data = await fetchApi(`/workspaces/${selectedStartupId}/tasks`);
        if (data && data.length > 0) {
          const mapped = data.map(t => ({
            id: t._id,
            title: t.title,
            assignee: t.assignee,
            status: t.status
          }));
          setTasks(mapped);
        } else {
          setTasks([]);
        }
      } catch (e) {
        setTasks([]);
      }
    };
    loadTasks();
  }, [selectedStartupId, fetchApi]);

  const moveTask = async (id, direction) => {
    const statuses = ['todo', 'inprogress', 'completed'];
    const task = tasks.find(t => t.id === id);
    if (!task || !selectedStartupId) return;

    const currentIndex = statuses.indexOf(task.status);
    let nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < statuses.length) {
      const nextStatus = statuses[nextIndex];
      try {
        await fetchApi(`/workspaces/${selectedStartupId}/tasks/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ status: nextStatus })
        });
      } catch (e) {
        console.warn("Backend update failed, fallback to local:", e);
      }

      setTasks(tasks.map(t => {
        if (t.id === id) {
          return { ...t, status: nextStatus };
        }
        return t;
      }));
    }
  };

  const handleAddTask = async () => {
    if (!taskTitle.trim() || !selectedStartupId) return;
    let taskId = Date.now();
    try {
      const data = await fetchApi(`/workspaces/${selectedStartupId}/tasks`, {
        method: 'POST',
        body: JSON.stringify({
          title: taskTitle,
          assignee: taskAssignee || "Unassigned"
        })
      });
      if (data && data._id) taskId = data._id;
    } catch (e) {
      console.warn("Backend add failed, fallback to local:", e);
    }

    const newTask = {
      id: taskId,
      title: taskTitle,
      assignee: taskAssignee || "Unassigned",
      status: "todo"
    };
    setTasks([...tasks, newTask]);
    setTaskTitle('');
    setTaskAssignee('');
    setDialogOpen(false);
  };

  const handleOpenDeleteDialog = (id) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete && selectedStartupId) {
      try {
        await fetchApi(`/workspaces/${selectedStartupId}/tasks/${taskToDelete}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.warn("Backend delete failed, fallback to local:", e);
      }
      setTasks(tasks.filter(t => t.id !== taskToDelete));
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const renderColumn = (status, title, bgColor) => {
    const colTasks = tasks.filter(t => t.status === status);
    return (
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            minHeight: '400px'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: bgColor }}>
              {title}
            </Typography>
            <Box 
              sx={{ 
                px: 1.5, 
                py: 0.25, 
                borderRadius: '10px', 
                backgroundColor: 'action.hover', 
                fontSize: '12px', 
                fontWeight: 'bold',
                color: 'text.secondary'
              }}
            >
              {colTasks.length}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {colTasks.map(task => (
              <Card
                key={task.id}
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.default',
                  backgroundImage: 'none',
                  boxShadow: 'none'
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.primary', mb: 1.5 }}>
                    {task.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      @{task.assignee}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {status !== 'todo' && (
                        <IconButton size="small" onClick={() => moveTask(task.id, -1)} sx={{ color: 'text.secondary' }}>
                          <MoveLeftIcon fontSize="small" />
                        </IconButton>
                      )}
                      {status !== 'completed' && (
                        <IconButton size="small" onClick={() => moveTask(task.id, 1)} sx={{ color: 'text.secondary' }}>
                          <MoveRightIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(task.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
            Team Workspace Board
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Collaborate on features, schedule deliverables, and view active tasks with matched co-founders.
          </Typography>
        </Box>
        {selectedStartupId && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setDialogOpen(true)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
          >
            Add Task
          </Button>
        )}
      </Box>

      {/* Project Selection Dropdown */}
      {startups.length > 0 && (
        <Box sx={{ maxWidth: 300 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="startup-select-label" sx={{ color: 'text.secondary' }}>Select Startup Project</InputLabel>
            <Select
              labelId="startup-select-label"
              value={selectedStartupId}
              label="Select Startup Project"
              onChange={(e) => setSelectedStartupId(e.target.value)}
              sx={{
                borderRadius: 2,
                backgroundColor: 'background.paper',
                borderColor: 'divider',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
              }}
            >
              {startups.map((startup) => (
                <MenuItem key={startup._id} value={startup._id}>
                  {startup.startuptitle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {startups.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            textAlign: 'center'
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {currentUser?.role === 'Founder' 
              ? "You haven't created any startup projects yet. Please list a project first to manage its Kanban task board."
              : "You haven't been accepted into any active project workspaces yet."}
          </Typography>
          {currentUser?.role === 'Founder' && (
            <Button
              variant="contained"
              onClick={() => window.location.href = '/Ideaform'}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Create Startup Project
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {renderColumn('todo', 'To Do', 'text.secondary')}
          {renderColumn('inprogress', 'In Progress', 'primary.main')}
          {renderColumn('completed', 'Completed', 'secondary.main')}
        </Grid>
      )}

      {/* Task Creation Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add Board Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Description"
            type="text"
            fullWidth
            variant="outlined"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            margin="dense"
            label="Assignee"
            type="text"
            fullWidth
            variant="outlined"
            value={taskAssignee}
            onChange={e => setTaskAssignee(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleAddTask} variant="contained" sx={{ borderRadius: 2, textTransform: 'none' }}>
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Task Confirmation Dialog */}
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
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Board Task</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            Are you sure you want to delete this workspace task ticket? This action cannot be undone.
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
