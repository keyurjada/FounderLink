import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, TextField, Button, Alert } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const faqs = [
  {
    q: "How does the co-founder matching score work?",
    a: "We calculate the match score based on skill overlap (e.g. skills a startup requires vs. skills listed on a developer profile), roles preferences, and geographical location splits."
  },
  {
    q: "Can I sign up as both a Talent and a Founder?",
    a: "Currently, each profile is restricted to one role to maintain high search relevance. However, you can register a separate developer account or founder account using different emails."
  },
  {
    q: "How do workspace Kanban boards work?",
    a: "Once a founder accepts your application pitch, you are automatically assigned a shared workspace board where you can add task tickets, move task lanes, and manage project iterations."
  },
  {
    q: "Is my personal data secure?",
    a: "Yes. In the default sandbox, your session credentials are stored completely client-side in your local browser storage. For production settings, connection configurations use secure HTTPS requests and MongoDB Atlas."
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
          Help Center & FAQs
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Frequently asked questions, system support channels, and direct inquiry tickets.
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
