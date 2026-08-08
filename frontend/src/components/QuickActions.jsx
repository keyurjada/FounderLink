import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack
} from '@mui/material';

import {
  PersonOutline as ProfileIcon,
  FindInPage as SearchIcon,
  Gavel as ContractIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { shortcuts } from '../data/localFeed';

const iconActionMap = {
  "edit-profile": <ProfileIcon />,
  "find-partners": <SearchIcon />,
  "legal-agreements": <ContractIcon />
};

const pathActionMap = {
  "edit-profile": "/settings",
  "find-partners": "/coder/Startuplist",
  "legal-agreements": "/equity-templates"
};

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        backgroundImage: 'none',
        boxShadow: 'none'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 3, color: 'text.primary' }}
        >
          Quick Actions
        </Typography>

        <Stack spacing={2.5}>
          {shortcuts.map((action) => (
            <Box
              key={action.id}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="text.primary"
                >
                  {action.title}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    display: 'block',
                    lineHeight: 1.4
                  }}
                >
                  {action.desc}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color={action.color}
                size="small"
                startIcon={iconActionMap[action.id]}
                onClick={() => navigate(pathActionMap[action.id])}
                sx={{
                  borderRadius: 1.5,
                  alignSelf: 'flex-start',
                  textTransform: 'none',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                {action.btnText}
              </Button>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuickActions;