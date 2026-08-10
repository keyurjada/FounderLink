import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  Paper,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { SessionContext } from "../context/SessionProvider.jsx";
import MetricCard from "../components/MetricCard.jsx";
import {
  Add as AddIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  ChevronRight as NextIcon,
} from "@mui/icons-material";

export default function Dashboard() {
  const { currentUser, fetchApi } = useContext(SessionContext);
  const navigate = useNavigate();
  const [coderStats, setCoderStats] = useState([
    {
      id: "matches",
      title: "BEST MATCHES",
      value: "0",
      change: "Startup opportunities",
      trend: "0 available",
      isPositive: true,
    },
    {
      id: "applications",
      title: "ACTIVE PITCHES",
      value: "0",
      change: "Applications sent",
      trend: "0 pending response",
      isPositive: true,
    },
    {
      id: "workspaces",
      title: "WORKSPACES ACTIVE",
      value: "0",
      change: "Active teams",
      trend: "0 sprint active",
      isPositive: true,
    },
    {
      id: "interviews",
      title: "INTERVIEWS BOOKED",
      value: "0",
      change: "Scheduled interviews",
      trend: "No upcoming interviews",
      isPositive: true,
    },
  ]);
  const [candidates, setCandidates] = useState([]);

  // Intercept browser back/forward buttons and keyboard left/right arrow keys
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Founder stats auto-updater
  useEffect(() => {
    if (!currentUser) return;

    const loadCoderMetrics = async () => {
        const isFounder = currentUser.role === 'Founder';

        // 1. Get startup projects
        const ideas = await fetchApi("/idea");
        const availableStartups = Array.isArray(ideas) ? ideas.filter(item => item.userId?._id !== currentUser._id && item.userId !== currentUser._id) : [];
        const myStartups = Array.isArray(ideas) ? ideas.filter(item => item.userId?._id === currentUser._id || item.userId === currentUser._id) : [];

        // 2. Get applications (sent for Coder, received for Founder)
        const applicationsEndpoint = isFounder ? "/applications/received" : "/applications";
        const applications = await fetchApi(applicationsEndpoint);
        const allApps = Array.isArray(applications) ? applications : [];

        const pendingApplications = allApps.filter(app => app.status === "Pending" || app.status === "Under Review").length;
        const acceptedApplications = allApps.filter(app => app.status === "Accepted").length;

        // 3. Get workspaces
        const workspaces = await fetchApi("/workspaces");
        const activeWorkspaces = Array.isArray(workspaces) ? workspaces : [];

        // 4. Talents (for Founder Best Matches)
        let totalTalents = 0;
        if (isFounder) {
          try {
            const talentsData = await fetchApi("/auth/talents");
            if (Array.isArray(talentsData)) totalTalents = talentsData.length;
          } catch(e) {}
        }

        // Update cards based on role
        if (isFounder) {
          setCoderStats([
            {
              id: "matches",
              title: "AVAILABLE TALENTS",
              value: totalTalents.toString(),
              change: "Platform developers",
              trend: `${totalTalents} total coders`,
              isPositive: true,
            },
            {
              id: "projects",
              title: "MY STARTUPS",
              value: myStartups.length.toString(),
              change: "Active projects",
              trend: `${myStartups.length} listed`,
              isPositive: true,
            },
            {
              id: "workspaces",
              title: "WORKSPACES ACTIVE",
              value: activeWorkspaces.length.toString(),
              change: "Active teams",
              trend: `${activeWorkspaces.length} active`,
              isPositive: true,
            },
            {
              id: "interviews",
              title: "ACCEPTED CANDIDATES",
              value: acceptedApplications.toString(),
              change: "Approved developers",
              trend: acceptedApplications > 0 ? `${acceptedApplications} accepted` : "No accepted candidates yet",
              isPositive: true,
            },
          ]);
        } else {
          setCoderStats([
            {
              id: "matches",
              title: "BEST MATCHES",
              value: availableStartups.length.toString(),
              change: "Startup opportunities",
              trend: `${availableStartups.length} available`,
              isPositive: true,
            },
            {
              id: "applications",
              title: "ACTIVE PITCHES",
              value: allApps.length.toString(),
              change: "Applications sent",
              trend: `${pendingApplications} pending response`,
              isPositive: true,
            },
            {
              id: "workspaces",
              title: "WORKSPACES ACTIVE",
              value: activeWorkspaces.length.toString(),
              change: "Active teams",
              trend: `${activeWorkspaces.length} active`,
              isPositive: true,
            },
            {
              id: "interviews",
              title: "ACCEPTED MATCHES",
              value: acceptedApplications.toString(),
              change: "Approved partnerships",
              trend: acceptedApplications > 0 ? `${acceptedApplications} accepted` : "No accepted matches yet",
              isPositive: true,
            },
          ]);
        }
    };

    loadCoderMetrics();
  }, [currentUser, fetchApi]);

  // Load coders who sent applications to this founder's startups
  // Load coders who sent applications to this founder's startups
useEffect(() => {
  if (!currentUser) return;

  const loadCandidates = async () => {
    try {
      const applications = await fetchApi("/applications/received");

      if (Array.isArray(applications)) {

        // ONLY Pending / Under Review applications
        const pendingApplications = applications.filter(
          (application) =>
            application.status === "Pending" ||
            application.status === "Under Review"
        );

        // Convert pending applications into candidates
        const mappedCandidates = pendingApplications.map((application) => ({
          _id: application._id,

          name:
            application.applicantId?.name ||
            `${application.applicantId?.firstname || ""} ${application.applicantId?.lastname || ""}`.trim() ||
            "Coder",

          email: application.applicantId?.email || "",

          startupName:
            application.startupId?.startuptitle || "Startup",

          pitchText: application.pitchText || "",

          status: application.status || "Pending",
        }));

        setCandidates(mappedCandidates);

      } else {
        setCandidates([]);
      }

    } catch (error) {
      console.error("Error loading candidates:", error);
      setCandidates([]);
    }
  };

  loadCandidates();
}, [currentUser, fetchApi]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "text.primary", letterSpacing: "-0.5px" }}
        >
          Welcome back, {currentUser?.name || "Founder"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage your startup projects, review developer applications, and
          connect with technical co-founders.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {coderStats.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <MetricCard {...item} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Main left content column */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "text.primary" }}
            >
              Featured Technical Candidates
            </Typography>

            {candidates.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  backgroundColor: "background.paper",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No developer candidates found in database. Share your project
                  to attract talent!
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {candidates.map((candidate) => (
                  <Paper
                    key={candidate._id}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "background.paper",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar sx={{ width: 52, height: 52 }}>
                        {candidate.name?.charAt(0)?.toUpperCase()}
                      </Avatar>

                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          {candidate.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="primary.main"
                          fontWeight="medium"
                        >
                          Applied to: {candidate.startupName}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "13.5px" }}
                    >
                      {candidate.pitchText}
                    </Typography>

                    <Chip
                      label={candidate.status}
                      size="small"
                      color={
                        candidate.status === "Accepted"
                          ? "success"
                          : candidate.status === "Rejected"
                            ? "error"
                            : "warning"
                      }
                      sx={{
                        alignSelf: "flex-start",
                        fontWeight: 600,
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate("/applications")}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                        }}
                      >
                        Review Application
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right quick controls sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "text.primary" }}
            >
              Founder Controls
            </Typography>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                overflow: "hidden",
              }}
            >
              <List disablePadding>
                <ListItem
                  disablePadding
                  divider
                  sx={{ borderColor: "divider" }}
                >
                  <ListItemButton
                    onClick={() => navigate("/Ideaform")}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon sx={{ color: "primary.main" }}>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Create Startup Project"
                      secondary="List a new startup project"
                      primaryTypographyProps={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      secondaryTypographyProps={{ fontSize: "11px" }}
                    />
                    <NextIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                  </ListItemButton>
                </ListItem>

                {/* <ListItem
                  disablePadding
                  divider
                  sx={{ borderColor: "divider" }}
                >
                  <ListItemButton
                    onClick={() => navigate("/match")}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon sx={{ color: "secondary.main" }}>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Browse Coders"
                      secondary="Search coder profiles"
                      primaryTypographyProps={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      secondaryTypographyProps={{ fontSize: "11px" }}
                    />
                    <NextIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                  </ListItemButton>
                </ListItem> */}

                <ListItem
                  disablePadding
                  divider
                  sx={{ borderColor: "divider" }}
                >
                  <ListItemButton
                    onClick={() => navigate("/applications")}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon sx={{ color: "success.main" }}>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Review Received Applications & Requests"
                      secondary="Evaluate incoming developer applications & requests"
                      primaryTypographyProps={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      secondaryTypographyProps={{ fontSize: "11px" }}
                    />
                    <NextIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
