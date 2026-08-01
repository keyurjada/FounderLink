import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { 
  FlashOn as FlashIcon,
  Send as SendIcon, 
  GroupWork as WorkspaceIcon, 
  CalendarMonth as InterviewIcon,
  FolderCopy as FolderIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';

const iconMap = {
  // Coder IDs
  matches: <FlashIcon sx={{ fontSize: 26, color: '#10b981' }} />,
  applications: <SendIcon sx={{ fontSize: 24, color: '#f59e0b' }} />,
  interviews: <InterviewIcon sx={{ fontSize: 26, color: '#f43f5e' }} />,
  
  // Founder IDs
  listings: <FolderIcon sx={{ fontSize: 26, color: '#f59e0b' }} />,
  pitches: <SendIcon sx={{ fontSize: 24, color: '#10b981' }} />,
  workspaces: <WorkspaceIcon sx={{ fontSize: 26, color: '#38bdf8' }} />,
  role: <BadgeIcon sx={{ fontSize: 26, color: '#ec4899' }} />
};

const colors = {
  listings: '#f59e0b',
  pitches: '#10b981',
  workspaces: '#38bdf8',
  role: '#ec4899',
  matches: '#10b981',
  applications: '#f59e0b',
  interviews: '#f43f5e'
};

const gradients = {
  listings: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, transparent 60%)',
  pitches: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
  workspaces: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, transparent 60%)',
  role: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, transparent 60%)',
  matches: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
  applications: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, transparent 60%)',
  interviews: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, transparent 60%)'
};

const MetricCard = ({ id, title, value, trend }) => {
  const themeColor = colors[id] || '#f59e0b';
  const themeGradient = gradients[id] || 'none';

  return (
    <Card 
      sx={{ 
        height: '100%', 
        borderRadius: 3.5, 
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        backgroundImage: themeGradient,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'none',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: themeColor,
          boxShadow: `0 8px 30px ${themeColor}12`
        }
      }}
    >
      <CardContent sx={{ p: 3.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={700} letterSpacing="0.4px" sx={{ textTransform: 'uppercase', fontSize: '11px' }}>
            {title}
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 44, 
              height: 44, 
              borderRadius: '12px',
              backgroundColor: `${themeColor}10`,
              border: '1px solid',
              borderColor: `${themeColor}22`
            }}
          >
            {iconMap[id]}
          </Box>
        </Box>

        <Typography variant="h4" component="div" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.8px', color: 'text.primary' }}>
          {value}
        </Typography>

        <Typography variant="caption" sx={{ color: themeColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {trend}
        </Typography>
      </CardContent>
      
      {/* Dynamic bottom highlighting accent line */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          height: '4px', 
          backgroundColor: themeColor 
        }} 
      />
    </Card>
  );
};

export default MetricCard;
