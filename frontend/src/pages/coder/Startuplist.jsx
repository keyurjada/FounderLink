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
  const filteredStartups = startups.filter((startup) => {
    const search = searchTerm.toLowerCase();

    return (
      startup.title?.toLowerCase().includes(search) ||
      startup.description?.toLowerCase().includes(search) ||
      startup.category?.toLowerCase().includes(search) ||
      startup.technologies?.some((tech) => tech.toLowerCase().includes(search))
    );
  });

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
                  {startup.userId && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Posted by{" "}
                      <strong>
                        {startup.userId.name ||
                          `${startup.userId.firstname || ""} ${
                            startup.userId.lastname || ""
                          }`}
                      </strong>
                    </Typography>
                  )}

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
                    onClick={async () => {
                      try {
                        const pitchText = `Hi! I am interested in joining ${startup.startuptitle || 'this startup'} and helping build the product.`;
                        await fetchApi('/applications', {
                          method: 'POST',
                          body: JSON.stringify({
                            startupId: startup._id,
                            pitchText
                          })
                        });
                        alert(`Application sent for ${startup.startuptitle || 'this startup'}`);
                      } catch (error) {
                        alert(error.message || 'Unable to send application');
                      }
                    }}
                  >
                    Apply to Project
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
