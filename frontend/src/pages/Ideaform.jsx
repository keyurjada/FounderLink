import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Paper, TextField, Button, Grid, Snackbar, Alert, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { SessionContext } from "../context/SessionProvider.jsx";

const Ideaform = () => {
  const { currentUser, fetchApi, setGlobalLoading } = useContext(SessionContext);
  const [vals, setVals] = useState({
    startuptitle: "",
    category: "",
    equity: "",
    description: "",
    teamsize: "",
    skillsRequired: "",
  });
  const [projects, setProjects] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState("success");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const loadProjects = async () => {
    try {
      const data = await fetchApi("/idea");
      if (data && data.length > 0) {
        // Filter to only show projects created by this user
        const filtered = data.filter(item => {
          const ownerId = item.userId?._id || item.userId;
          return ownerId === currentUser?._id;
        });
        setProjects(filtered);
      } else {
        setProjects([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadProjects();
    }
  }, [currentUser, fetchApi]);

  const handleInputChange = (e) => {
    setVals({
      ...vals,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setGlobalLoading(true);

    const skillsArray = vals.skillsRequired
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      const response = await fetchApi("/idea/create", {
        method: "POST",
        body: JSON.stringify({
          startuptitle: vals.startuptitle,
          category: vals.category,
          equity: Number(vals.equity),
          description: vals.description,
          teamsize: Number(vals.teamsize),
          skillsRequired: skillsArray
        })
      });

      setSeverity("success");
      setSnackbarMsg(response.message || "StartUp Project Uploaded Successfully");
      setSnackbarOpen(true);
      handleClear();
      loadProjects(); // Refresh listing instantly
      setGlobalLoading(false);
    } catch (error) {
      console.log(error);
      setSeverity("error");
      setSnackbarMsg(error.message || "Something went wrong");
      setSnackbarOpen(true);
      setGlobalLoading(false);
    }
  };

  const handleClear = () => {
    setVals({
      startuptitle: "",
      category: "",
      equity: "",
      description: "",
      teamsize: "",
      skillsRequired: "",
    });
  };

  const handleOpenDeleteDialog = (id) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      setGlobalLoading(true);
      try {
        await fetchApi(`/idea/${projectToDelete}`, {
          method: "DELETE"
        });
        setSeverity("success");
        setSnackbarMsg("Venture Project Deleted Successfully");
        setSnackbarOpen(true);
        loadProjects(); // Refresh listing
      } catch (error) {
        console.error(error);
        setSeverity("error");
        setSnackbarMsg(error.message || "Failed to delete project");
        setSnackbarOpen(true);
      }
      setGlobalLoading(false);
    }
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" ,maxWidth: 1200, mx: "auto", pb: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "text.primary", letterSpacing: "-0.5px" }}>
          Startup Project Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Create and list a new startup project to attract technical co-founder partners.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          backgroundImage: "none",
        }}
      >
        <Box component="form" onSubmit={handleFormSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Startup Title"
                name="startuptitle"
                value={vals.startuptitle}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category / Industry"
                name="category"
                value={vals.category}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Equity Offered (%)"
                name="equity"
                type="number"
                value={vals.equity}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Target Team Size"
                name="teamsize"
                type="number"
                value={vals.teamsize}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Skills Required (comma-separated, e.g. React, Node.js, Python)"
                name="skillsRequired"
                value={vals.skillsRequired}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Project Description"
                name="description"
                value={vals.description}
                onChange={handleInputChange}
                fullWidth
                required
                multiline
                rows={4}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 1 }}>
            <Button
              type="button"
              onClick={handleClear}
              variant="outlined"
              sx={{ px: 4, py: 1.2, borderRadius: 2, textTransform: "none" }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ px: 4, py: 1.2, borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
            >
              Upload Startup Project
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Listing component */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: "text.primary", mb: 2 }}>
          Your Uploaded Startup Projects
        </Typography>
        {projects.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            You haven't uploaded any startup projects yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} key={project._id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "220px"
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {project.startuptitle}
                      </Typography>
                      <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(project._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                      Category: {project.category} | Team Size: {project.teamsize}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {project.description}
                    </Typography>
                  </Box>

                  <Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
                      {(project.skillsRequired || []).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "10px", height: "18px" }}
                        />
                      ))}
                    </Box>
                    <Chip
                      label={`Equity: ${project.equity}%`}
                      size="small"
                      color="secondary"
                      sx={{ borderRadius: 1.5, fontWeight: 600 }}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
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
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Startup Project</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            Are you sure you want to permanently delete this startup project listing? This action cannot be undone.
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={severity} sx={{ width: "100%", borderRadius: 2 }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Ideaform;