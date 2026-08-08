import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Send as SendIcon,
} from "@mui/icons-material";

import { SessionContext } from "../../context/SessionProvider.jsx";

export default function Match() {
  const { currentUser, fetchApi } = useContext(SessionContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // Load startup ideas for CODER/TALENT
  useEffect(() => {
    const loadStartups = async () => {
      try {
        setLoading(true);

        const data = await fetchApi("/idea");

        console.log("Startup ideas:", data);

        if (Array.isArray(data)) {
          // Optional: don't show the coder's own ideas
          const otherStartups = data.filter((item) => {
            const ownerId = item.userId?._id || item.userId;

            return ownerId !== currentUser?._id;
          });

          setStartups(otherStartups);
        } else {
          setStartups([]);
        }
      } catch (error) {
        console.error("Error loading startup ideas:", error);
        setStartups([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadStartups();
    }
  }, [currentUser, fetchApi]);

  // Search startup projects
  const getFounderName = (startup) => {
  const user = startup?.userId;

  if (!user || typeof user !== "object") {
    return "Founder";
  }

  if (user.name?.trim()) {
    return user.name;
  }

  const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();

  return fullName || "Founder";
};

  const filteredStartups = startups.filter((startup) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    const projectName = (startup.startuptitle || "").toLowerCase();
    const category = (startup.category || "").toLowerCase();
    const description = (startup.description || "").toLowerCase();
    const skills = (startup.skillsRequired || []).join(" ").toLowerCase();

    return (
      projectName.includes(search) ||
      category.includes(search) ||
      description.includes(search) ||
      skills.includes(search)
    );
  });

  // Open popup
  const handleOpenApply = (startup) => {
    setSelectedStartup(startup);
    setResumeFile(null);
  };

  // Close popup
  const handleCloseApply = () => {
    setSelectedStartup(null);
    setResumeFile(null);
  };

  // Send application
  const handleSubmitApplication = async () => {
  if (!selectedStartup || !resumeFile) {
    return;
  }

  try {
    const formData = new FormData();

    formData.append("startupId", selectedStartup._id);
    formData.append("resume", resumeFile);

    await fetchApi("/applications", {
      method: "POST",
      body: formData,
    });

    setSnackbarOpen(true);
    handleCloseApply();
  } catch (error) {
    console.error("Application error:", error);
    alert(error.message || "Unable to send application");
  }
};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Header */}
      <Box>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: "text.primary",
            letterSpacing: "-0.5px",
          }}
        >
          Explore Startups
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Discover startup projects looking for talented developers and
          technical co-founders.
        </Typography>
      </Box>

      {/* Search */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search startup projects, categories, or technologies..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",

              "& fieldset": {
                border: "none",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{
            borderRadius: 3,
            px: 3,
            textTransform: "none",
            borderColor: "divider",
            color: "text.secondary",
          }}
        >
          Filters
        </Button>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography color="text.secondary">
            Loading startup projects...
          </Typography>
        </Box>
      )}

      {/* No startups */}
      {!loading && filteredStartups.length === 0 && (
        <Card
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              No startup projects found
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try another search or check back later for new startup
              opportunities.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Startup Cards */}
      {!loading && filteredStartups.length > 0 && (
        <Grid container spacing={3}>
          {filteredStartups.map((startup) => (
            <Grid item xs={12} md={6} lg={4} key={startup._id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                  backgroundImage: "none",
                  boxShadow: "none",
                  transition: "all 0.25s ease",

                  "&:hover": {
                    borderColor: "secondary.main",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.08)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  {/* Startup title */}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      color: "text.primary",
                      mb: 1,
                    }}
                  >
                    {startup.startuptitle || "Untitled Startup"}
                  </Typography>

                  {/* Category */}
                  {startup.category && (
                    <Chip
                      label={startup.category}
                      size="small"
                      sx={{
                        width: "fit-content",
                        mb: 2,
                        bgcolor: "rgba(245, 158, 11, 0.08)",
                        color: "primary.main",
                        fontWeight: "bold",
                        fontSize: "11px",
                      }}
                    />
                  )}

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2.5,
                      lineHeight: 1.6,
                      fontSize: "13px",
                      flexGrow: 1,
                    }}
                  >
                    {startup.description ||
                      "No description available for this startup project."}
                  </Typography>

                  {/* Technologies */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      mb: 3,
                    }}
                  >
                    {(startup.skillsRequired || []).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "10px",
                          height: "22px",
                          borderRadius: "4px",
                        }}
                      />
                    ))}
                  </Box>

                  {/* Founder */}
                 
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Posted by{" "}
                      <strong>{getFounderName(startup)}</strong>
                    </Typography>
                  

                  {/* Apply button */}
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<SendIcon />}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleOpenApply(startup)}
                  >
                    Apply to Project
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Application Popup */}
      <Dialog
        open={Boolean(selectedStartup)}
        onClose={handleCloseApply}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1.5,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            backgroundImage: "none",
          },
        }}
      >
        {selectedStartup && (
          <>
            <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
              Apply to join {selectedStartup.startuptitle}
            </DialogTitle>

            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tell the founder about your expertise and why you are interested
                in joining this startup.
              </Typography>

             <Box
  sx={{
    border: "2px dashed",
    borderColor: "divider",
    borderRadius: 3,
    p: 4,
    textAlign: "center",
    cursor: "pointer",
    "&:hover": {
      borderColor: "primary.main",
      backgroundColor: "action.hover",
    },
  }}
  onClick={() => document.getElementById("pdf-upload").click()}
>
  <Typography
    variant="body1"
    fontWeight="bold"
    sx={{ mb: 1 }}
  >
    {resumeFile ? resumeFile.name : "Upload your resume / profile PDF"}
  </Typography>

  <Typography
    variant="body2"
    color="text.secondary"
  >
    Click here to select a PDF file
  </Typography>

  <input
    id="pdf-upload"
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
        display: "block",
        mt: 2,
        fontWeight: "bold",
      }}
    >
      PDF selected ✓
    </Typography>
  )}
</Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseApply}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>

             <Button
  onClick={handleSubmitApplication}
  variant="contained"
  disabled={!resumeFile}
  sx={{
    borderRadius: 2,
    textTransform: "none",
  }}
>
  Send Application
</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Success Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          Application submitted successfully! Founder has been notified.
        </Alert>
      </Snackbar>
    </Box>
  );
}
