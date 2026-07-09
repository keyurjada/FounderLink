import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import { ArrowForward as MoveRightIcon, ArrowBack as MoveLeftIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const initialTasks = [
  { id: 1, title: "Refactor SessionProvider state", assignee: "Aryan Kapadiya", status: "todo" },
  { id: 2, title: "Design Landing Page layouts", assignee: "Savan Detroja", status: "inprogress" },
  { id: 3, title: "Setup MongoDB Atlas sandbox", assignee: "Jevin Parmar", status: "completed" },
  { id: 4, title: "Setup Mongoose middleware hooks", assignee: "Aryan Kapadiya", status: "inprogress" }
];

export default function Workspaces() {
  const [tasks, setTasks] = useState(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');

  const moveTask = (id, direction) => {
    const statuses = ['todo', 'inprogress', 'completed'];
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const currentIndex = statuses.indexOf(t.status);
        let nextIndex = currentIndex + direction;
        if (nextIndex >= 0 && nextIndex < statuses.length) {
          return { ...t, status: statuses[nextIndex] };
        }
      }
      return t;
    }));
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
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

  const handleConfirmDelete = () => {
    if (taskToDelete) {
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
            minHeight: '500px',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            backgroundImage: 'none'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary' }}>
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
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setDialogOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
        >
          Add Task
        </Button>
      </Box>

      {/* Kanban Board columns */}
      <Grid container spacing={3}>
        {renderColumn('todo', 'To Do', 'text.secondary')}
        {renderColumn('inprogress', 'In Progress', 'primary.main')}
        {renderColumn('completed', 'Completed', 'secondary.main')}
      </Grid>

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
