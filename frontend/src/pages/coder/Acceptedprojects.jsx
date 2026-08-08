import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";

import {
  BusinessCenter as ProjectIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../context/SessionProvider.jsx";

export default function AcceptedProjects() {
  const { fetchApi } = useContext(SessionContext);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAcceptedProjects = async () => {
      try {
        const data = await fetchApi("/applications");

        console.log("All applications:", data);

        const accepted = Array.isArray(data)
          ? data.filter((application) => application.status === "Accepted")
          : [];

        console.log("Accepted applications:", accepted);

        setProjects(accepted);
      } catch (error) {
        console.error("Failed to load accepted projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadAcceptedProjects();
  }, [fetchApi]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
          My Accepted Projects
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Projects and startup opportunities where the founder has accepted your
          application.
        </Typography>
      </Box>

      {/* Loading */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        /* Empty State */
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "none",
            backgroundImage: "none",
          }}
        >
          <CardContent
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <ProjectIcon
              sx={{
                fontSize: 50,
                color: "text.secondary",
                mb: 2,
              }}
            />

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              No accepted projects yet
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Once a founder accepts your application, the project will appear
              here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        /* Accepted Projects */
        <Grid container spacing={3}>
          {projects.map((application) => {
            const startup = application.startupId;

            return (
              <Grid item xs={12} md={6} lg={4} key={application._id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "none",
                    backgroundImage: "none",
                    transition: "0.2s",

                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      gap: 2,
                    }}
                  >
                    {/* Project Icon + Status */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 45,
                          height: 45,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "action.hover",
                        }}
                      >
                        <ProjectIcon />
                      </Box>

                      <Chip
                        label="Accepted"
                        color="success"
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 1.5,
                        }}
                      />
                    </Box>

                    {/* Startup Name */}
                    <Typography variant="h6" fontWeight="bold">
                      {startup?.startuptitle || "Startup Project"}
                    </Typography>

                    {/* Category */}
                    {startup?.category && (
                      <Chip
                        label={startup.category}
                        size="small"
                        variant="outlined"
                        sx={{
                          width: "fit-content",
                          borderRadius: 1.5,
                        }}
                      />
                    )}

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 60,
                      }}
                    >
                      {startup?.description ||
                        "No project description available."}
                    </Typography>

                    {/* Skills */}
                    {startup?.skillsRequired?.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.7,
                        }}
                      >
                        {startup.skillsRequired
                          .slice(0, 4)
                          .map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                      </Box>
                    )}

                    {/* Bottom */}
                    <Box
                      sx={{
                        mt: "auto",
                        pt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Application accepted
                      </Typography>

                      <Button
                        size="small"
                        endIcon={<ArrowIcon />}
                        sx={{
                          textTransform: "none",
                        }}
                      >
                        View Project
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
