import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Box, Typography, Grid, Paper, Card, CardContent, IconButton, Button, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Chip, Tooltip
} from '@mui/material';
import { 
  ArrowForward as MoveRightIcon, ArrowBack as MoveLeftIcon, Add as AddIcon, Delete as DeleteIcon,
  Send as SendIcon, GitHub as GitHubIcon, Dashboard as FigmaIcon, Article as ArticleIcon, Edit as EditIcon,
  Person as PersonIcon, Launch as LaunchIcon
} from '@mui/icons-material';
import { SessionContext } from '../context/SessionProvider.jsx';

export default function Workspaces() {
  const { currentUser, fetchApi, setGlobalLoading } = useContext(SessionContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [startups, setStartups] = useState([]);
  const [selectedStartupId, setSelectedStartupId] = useState('');
  
  // Sync Hub Data States
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [resources, setResources] = useState({ githubLink: '', figmaLink: '', docsLink: '' });
  const [isEditingResources, setIsEditingResources] = useState(false);
  const [editResourcesForm, setEditResourcesForm] = useState({ githubLink: '', figmaLink: '', docsLink: '' });
  const chatEndRef = useRef(null);

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('Select member');
  const [workspaceMembers, setWorkspaceMembers] = useState(['Select member']);

  const isFounder = currentUser?.role === 'Founder';

  // 1. Load Workspaces and Startups
  useEffect(() => {
    if (!currentUser) return;
    const loadWorkspaces = async () => {
      try {
        const data = await fetchApi('/workspaces');
        if (data && data.length > 0) {
          setWorkspaces(data);
          
          const mappedStartups = [];
          data.forEach(w => {
            if (w.startupId) {
              const exists = mappedStartups.find(s => s._id === w.startupId._id);
              if (!exists) {
                mappedStartups.push({
                  _id: w.startupId._id,
                  startuptitle: w.startupId.startuptitle || "Joined Venture"
                });
              }
            }
          });
          
          setStartups(mappedStartups);
          if (mappedStartups.length > 0 && !selectedStartupId) {
            setSelectedStartupId(mappedStartups[0]._id);
          }
        }
      } catch (e) {
        console.error("Failed to load workspaces:", e);
      }
    };
    loadWorkspaces();
  }, [currentUser, fetchApi]);

  // 2. Load Active Workspace Data (Tasks, Chat, Resources)
  useEffect(() => {
    if (!selectedStartupId || workspaces.length === 0) return;
    
    const activeWorkspace = workspaces.find(w => w.startupId?._id === selectedStartupId);
    if (activeWorkspace) {
      setResources({
        githubLink: activeWorkspace.githubLink || '',
        figmaLink: activeWorkspace.figmaLink || '',
        docsLink: activeWorkspace.docsLink || ''
      });
      setEditResourcesForm({
        githubLink: activeWorkspace.githubLink || '',
        figmaLink: activeWorkspace.figmaLink || '',
        docsLink: activeWorkspace.docsLink || ''
      });
    }

    const loadWorkspaceData = async () => {
      try {
        // Load Tasks
        const tasksData = await fetchApi(`/workspaces/${selectedStartupId}/tasks`);
        setTasks(tasksData || []);

        // Load Chat
        const chatData = await fetchApi(`/workspaces/${selectedStartupId}/chat`);
        setMessages(chatData || []);
        scrollToBottom();

      } catch (e) {
        console.error("Failed to load active workspace data", e);
      }
    };

    loadWorkspaceData();
  }, [selectedStartupId, workspaces, fetchApi]);

  // 3. Load Workspace Members for Task Assignment
  useEffect(() => {
    if (!selectedStartupId) return;
    const loadMembers = async () => {
      try {
        let members = ['Select member'];
        const data = await fetchApi('/applications/received');
        if (data && Array.isArray(data)) {
          const acceptedForStartup = data.filter(p => 
            p.status === 'Accepted' && 
            (p.startupId?._id === selectedStartupId || p.startupId === selectedStartupId)
          );
          acceptedForStartup.forEach(p => {
             if (p.applicantId && p.applicantId.name) {
                 members.push(p.applicantId.name);
             }
          });
        }
        const uniqueMembers = [...new Set(members)];
        setWorkspaceMembers(uniqueMembers);
        setTaskAssignee(prev => uniqueMembers.includes(prev) ? prev : 'Select member');
      } catch (e) {
        console.error("Failed to load members:", e);
      }
    };
    if (isFounder) {
      loadMembers();
    } else {
      // Coder can assign themselves or founder
      setWorkspaceMembers(['Select member', currentUser?.name || 'Me']);
    }
  }, [selectedStartupId, currentUser, fetchApi, isFounder]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Chat Handlers
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStartupId) return;
    try {
      const sentMsg = await fetchApi(`/workspaces/${selectedStartupId}/chat`, {
        method: 'POST',
        body: JSON.stringify({ content: newMessage })
      });
      setMessages([...messages, sentMsg]);
      setNewMessage('');
      scrollToBottom();
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  const handleChatKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Resources Handlers
  const handleSaveResources = async () => {
    if (!selectedStartupId) return;
    setGlobalLoading(true);
    try {
      const updatedWorkspace = await fetchApi(`/workspaces/${selectedStartupId}/resources`, {
        method: 'PUT',
        body: JSON.stringify(editResourcesForm)
      });
      setResources({
        githubLink: updatedWorkspace.githubLink || '',
        figmaLink: updatedWorkspace.figmaLink || '',
        docsLink: updatedWorkspace.docsLink || ''
      });
      setIsEditingResources(false);
    } catch (e) {
      console.error("Failed to update resources", e);
    } finally {
      setGlobalLoading(false);
    }
  };

  // Task Handlers
  const moveTask = async (id, direction) => {
    const statuses = ['todo', 'inprogress', 'completed'];
    const task = tasks.find(t => t._id === id || t.id === id);
    if (!task || !selectedStartupId) return;

    const currentIndex = statuses.indexOf(task.status);
    let nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < statuses.length) {
      const nextStatus = statuses[nextIndex];
      try {
        await fetchApi(`/workspaces/${selectedStartupId}/tasks/${task._id || task.id}`, {
          method: 'PUT',
          body: JSON.stringify({ status: nextStatus })
        });
      } catch (e) {
        console.warn("Backend update failed, fallback to local:", e);
      }

      setTasks(tasks.map(t => {
        if ((t._id || t.id) === (task._id || task.id)) {
          return { ...t, status: nextStatus };
        }
        return t;
      }));
    }
  };

  const handleAddTask = async () => {
    if (!taskTitle.trim() || !selectedStartupId) return;
    setGlobalLoading(true);
    let newTaskData = null;
    try {
      newTaskData = await fetchApi(`/workspaces/${selectedStartupId}/tasks`, {
        method: 'POST',
        body: JSON.stringify({
          title: taskTitle,
          assignee: taskAssignee === "Select member" ? "Unassigned" : taskAssignee
        })
      });
    } catch (e) {
      console.warn("Backend add failed, fallback to local:", e);
    }

    if (newTaskData) {
      setTasks([...tasks, newTaskData]);
    }
    setTaskTitle('');
    setTaskAssignee('Select member');
    setGlobalLoading(false);
    setDialogOpen(false);
  };

  const handleOpenDeleteDialog = (id) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete && selectedStartupId) {
      setGlobalLoading(true);
      try {
        await fetchApi(`/workspaces/${selectedStartupId}/tasks/${taskToDelete}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.warn("Backend delete failed, fallback to local:", e);
      }
      setTasks(tasks.filter(t => (t._id || t.id) !== taskToDelete));
      setGlobalLoading(false);
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  // Sub-components
  const ResourceItem = ({ icon, title, link, type }) => {
    if (!link && !isEditingResources) return null;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 200 }}>
        <Avatar sx={{ bgcolor: 'action.hover', color: 'primary.main', width: 40, height: 40 }}>
          {icon}
        </Avatar>
        {isEditingResources ? (
          <TextField 
            size="small" 
            fullWidth 
            placeholder={`Enter ${title} URL`}
            value={editResourcesForm[type]}
            onChange={(e) => setEditResourcesForm({...editResourcesForm, [type]: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        ) : (
          <Box>
            <Typography variant="body2" fontWeight="bold">{title}</Typography>
            <Typography 
              variant="caption" 
              component="a" 
              href={link.startsWith('http') ? link : `https://${link}`} 
              target="_blank" 
              sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
            >
              Open Link <LaunchIcon sx={{ fontSize: 10, verticalAlign: 'middle' }} />
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderTaskLane = (status, title, bgColor) => {
    const colTasks = tasks.filter(t => t.status === status);
    return (
      <Grid item xs={12} sm={4}>
        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'background.default', border: '1px solid', borderColor: 'divider', minHeight: 300 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 0.5 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: bgColor }}>{title}</Typography>
            <Chip size="small" label={colTasks.length} sx={{ height: 20, fontSize: '10px', fontWeight: 'bold' }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {colTasks.map(task => (
              <Card key={task._id || task.id} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 1, fontSize: '13px', lineHeight: 1.3 }}>
                    {task.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      @{task.assignee}
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                      {status !== 'todo' && (
                        <IconButton size="small" onClick={() => moveTask(task._id || task.id, -1)} sx={{ p: 0.5 }}><MoveLeftIcon sx={{ fontSize: 14 }} /></IconButton>
                      )}
                      {status !== 'completed' && (
                        <IconButton size="small" onClick={() => moveTask(task._id || task.id, 1)} sx={{ p: 0.5 }}><MoveRightIcon sx={{ fontSize: 14 }} /></IconButton>
                      )}
                      {isFounder && (
                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(task._id || task.id)} sx={{ p: 0.5 }}><DeleteIcon sx={{ fontSize: 14 }} /></IconButton>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
            {colTasks.length === 0 && (
              <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', display: 'block', mt: 2, fontStyle: 'italic' }}>
                No tasks
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>
    );
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header & Dropdown */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
            Sync Hub Workspace
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Centralized collaboration, task tracking, and communication for your matched projects.
          </Typography>
        </Box>
        
        {startups.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel id="startup-select-label">Active Project Workspace</InputLabel>
            <Select
              labelId="startup-select-label"
              value={selectedStartupId}
              label="Active Project Workspace"
              onChange={(e) => setSelectedStartupId(e.target.value)}
              sx={{ borderRadius: 2, backgroundColor: 'background.paper' }}
            >
              {startups.map((startup) => (
                <MenuItem key={startup._id} value={startup._id}>
                  {startup.startuptitle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {startups.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {isFounder 
              ? "You haven't created any startup projects or accepted any coders yet."
              : "You haven't been accepted into any active project workspaces yet."}
          </Typography>
          {isFounder && (
            <Button variant="contained" onClick={() => window.location.href = '/Ideaform'} sx={{ borderRadius: 2, textTransform: 'none' }}>
              Create Startup Project
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {/* Top Section: Project Resources */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', backgroundImage: 'none', boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'primary.main' }}>
                Project Resources
              </Typography>
              {isFounder && !isEditingResources && (
                <Button size="small" startIcon={<EditIcon />} onClick={() => setIsEditingResources(true)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                  Edit Links
                </Button>
              )}
              {isFounder && isEditingResources && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => setIsEditingResources(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
                  <Button size="small" variant="contained" onClick={handleSaveResources} sx={{ textTransform: 'none', borderRadius: 2 }}>Save Links</Button>
                </Box>
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <ResourceItem icon={<GitHubIcon />} title="GitHub Repository" type="githubLink" link={resources.githubLink} />
              <ResourceItem icon={<FigmaIcon />} title="Figma Design" type="figmaLink" link={resources.figmaLink} />
              <ResourceItem icon={<ArticleIcon />} title="Project Docs" type="docsLink" link={resources.docsLink} />
              
              {!isEditingResources && !resources.githubLink && !resources.figmaLink && !resources.docsLink && (
                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                  No resources have been linked by the founder yet.
                </Typography>
              )}
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {/* Left Column: Task Board */}
            <Grid item xs={12} md={7} lg={8}>
              <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', backgroundImage: 'none', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Milestones & Tasks</Typography>
                  {isFounder && (
                    <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => setDialogOpen(true)} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      New Task
                    </Button>
                  )}
                </Box>
                <Grid container spacing={2} sx={{ flexGrow: 1, alignItems: 'stretch' }}>
                  {renderTaskLane('todo', 'To Do', 'text.secondary')}
                  {renderTaskLane('inprogress', 'In Progress', 'primary.main')}
                  {renderTaskLane('completed', 'Completed', 'success.main')}
                </Grid>
              </Paper>
            </Grid>

            {/* Right Column: Project Chat */}
            <Grid item xs={12} md={5} lg={4}>
              <Paper sx={{ p: 0, borderRadius: 3, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', backgroundImage: 'none', boxShadow: 'none', height: '100%', minHeight: 450, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'rgba(245, 158, 11, 0.04)' }}>
                  <Typography variant="subtitle1" fontWeight="bold">Workspace Chat</Typography>
                  <Typography variant="caption" color="text.secondary">Real-time team communication</Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: 'background.default' }}>
                  {messages.length === 0 ? (
                    <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic' }}>
                      Say hello to start the conversation!
                    </Typography>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.senderId?._id === currentUser?._id;
                      return (
                        <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '11px', bgcolor: isMe ? 'primary.main' : 'secondary.main', color: '#000', fontWeight: 'bold' }}>
                              {msg.senderId?.name ? msg.senderId.name.charAt(0).toUpperCase() : '?'}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">
                              {isMe ? 'You' : msg.senderId?.name || 'User'}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '10px' }}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                          <Paper sx={{ 
                            p: 1.5, 
                            borderRadius: 2,
                            borderTopRightRadius: isMe ? 4 : 16,
                            borderTopLeftRadius: !isMe ? 4 : 16,
                            backgroundColor: isMe ? 'primary.main' : 'background.paper',
                            color: isMe ? '#000' : 'text.primary',
                            border: isMe ? 'none' : '1px solid',
                            borderColor: 'divider',
                            maxWidth: '90%',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}>
                            <Typography variant="body2" sx={{ fontWeight: isMe ? 500 : 400, wordBreak: 'break-word' }}>
                              {msg.content}
                            </Typography>
                          </Paper>
                        </Box>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </Box>
                
                <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField 
                      fullWidth 
                      placeholder="Type a message..." 
                      size="small"
                      variant="outlined"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleChatKeyDown}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'background.default' } }}
                    />
                    <IconButton 
                      color="primary" 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      sx={{ bgcolor: newMessage.trim() ? 'rgba(245, 158, 11, 0.1)' : 'transparent', borderRadius: 3 }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Task Creation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3, p: 1, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add Board Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="Task Description" type="text" fullWidth variant="outlined"
            value={taskTitle} onChange={e => setTaskTitle(e.target.value)}
            sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="assignee-label">Assignee</InputLabel>
            <Select
              labelId="assignee-label" value={taskAssignee} label="Assignee"
              onChange={e => setTaskAssignee(e.target.value)}
              sx={{ borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: 2 } }}
            >
              {workspaceMembers.map(member => (
                <MenuItem key={member} value={member}>{member}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained" sx={{ borderRadius: 2, textTransform: 'none' }}>Add Task</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Task Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} PaperProps={{ sx: { borderRadius: 3, p: 1.5, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Board Task</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            Are you sure you want to delete this workspace task ticket? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
          <Button onClick={handleCancelDelete} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ borderRadius: 2, textTransform: 'none', backgroundColor: '#f43f5e' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
