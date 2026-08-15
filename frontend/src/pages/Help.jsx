import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, TextField, Button, Alert } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const faqs = [
  {
    q: "How do I create a new Startup Project?",
    a: "Navigate to the 'Create Startup Project' section from your dashboard to list a new opportunity. You'll need to specify your startup title, category, equity offering, and required skills."
  },
  {
    q: "How do I review applications from coders?",
    a: "Check the 'Review Received Applications' tab on your dashboard. From there, you can view the coder's profile, read their application, and choose to accept or reject their application."
  },
  {
    q: "What happens when I accept an application?",
    a: "A new Team Workspace is automatically created for your startup, allowing you to collaborate with the accepted coder via Kanban boards and task management."
  },
  {
    q: "Can I manage multiple Startup Projects?",
    a: "Yes! You can create and manage multiple Startup Projects simultaneously. Each project will have its own dedicated workspace and application queue."
  }
];

export default function Help() {
  const [ticketText, setTicketText] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketText.trim()) return;
    setSuccess(true);
    setTicketText('');
    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          Founder Help Center
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Frequently asked questions, startup management guides, and founder support channels.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', lgDirection: 'row', gap: 4 }}>
        {/* FAQs */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary', mb: 3 }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {faqs.map((faq, idx) => (
              <Accordion 
                key={idx}
                sx={{
                  borderRadius: '12px !important',
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  backgroundImage: 'none',
                  boxShadow: 'none',
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '13px' }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Contact Form */}
        <Box sx={{ minWidth: { lg: '380px' } }}>
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
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary', mb: 2 }}>
                Submit Support Ticket
              </Typography>
              {success && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  Ticket submitted! Support will contact you.
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <TextField
                  placeholder="Describe your issue or question..."
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={ticketText}
                  onChange={e => setTicketText(e.target.value)}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={!ticketText.trim()}
                  fullWidth
                  sx={{ borderRadius: 2, py: 1, textTransform: 'none', fontWeight: 'bold' }}
                >
                  Send Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
