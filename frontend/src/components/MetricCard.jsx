import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { 
  FlashOn as FlashIcon,
  Send as SendIcon, 
  GroupWork as WorkspaceIcon, 
  CalendarMonth as InterviewIcon 
} from '@mui/icons-material';

const iconMap = {
  matches: <FlashIcon sx={{ fontSize: 28, color: '#10b981' }} />,
  applications: <SendIcon sx={{ fontSize: 26, color: '#f59e0b' }} />,
  workspaces: <WorkspaceIcon sx={{ fontSize: 28, color: '#a855f7' }} />,
  interviews: <InterviewIcon sx={{ fontSize: 28, color: '#f43f5e' }} />
};

const MetricCard = ({ id, title, value, trend, color }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        borderRadius: 3, 
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        backgroundImage: 'none',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'none',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'primary.main',
          boxShadow: `0 8px 24px rgba(245, 158, 11, 0.08)`
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600} letterSpacing="0.2px">
            {title}
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 46, 
              height: 46, 
              borderRadius: '12px',
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {iconMap[id]}
          </Box>
        </Box>

        <Typography variant="h4" component="div" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.5px', color: 'text.primary' }}>
          {value}
        </Typography>

        <Typography variant="caption" sx={{ color: color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {trend}
        </Typography>
      </CardContent>
      
      {/* Decorative subtle border light indicator */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          height: '4px', 
          backgroundColor: color 
        }} 
      />
    </Card>
  );
};

export default MetricCard;
