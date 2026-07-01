import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import { Shield as PremiumIcon, CheckCircleOutline as CheckIcon } from '@mui/icons-material';

const pricingTiers = [
  {
    title: "Basic (Free)",
    price: "$0",
    desc: "Test out co-founder matches in your local community.",
    features: [
      "Send up to 3 applications",
      "Standard matchmaking algorithm",
      "Basic workspace board tasks",
      "Community support"
    ],
    buttonText: "Current Plan",
    active: true,
    color: "text.secondary"
  },
  {
    title: "Founder Pro",
    price: "$19/mo",
    desc: "Maximize match opportunities with priority search filters.",
    features: [
      "Send unlimited applications",
      "Priority matching recommendations",
      "Full Kanban workspace integration",
      "Advanced vesting agreements templates",
      "24/7 Priority support"
    ],
    buttonText: "Upgrade to Pro",
    active: false,
    color: "primary.main"
  },
  {
    title: "Enterprise Dev",
    price: "$49/mo",
    desc: "Venture group management and automated agreement vesting splits.",
    features: [
      "Everything in Founder Pro",
      "Manage up to 5 startup profiles",
      "Automated equity vesting split calculators",
      "Venture Capital pipelines matching",
      "Dedicated account matching manager"
    ],
    buttonText: "Get Enterprise",
    active: false,
    color: "secondary.main"
  }
];

export default function Premium() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedTier(null);
      setCardNumber('');
      setExpiry('');
      setCvv('');
    }, 3000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          Premium Access Plans
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Unlock premium matchmaking tools, equity templates, and unlimited co-founder search tools.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {pricingTiers.map((tier) => (
          <Grid item xs={12} md={4} key={tier.title}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                border: '1px solid',
                borderColor: tier.active ? 'primary.main' : 'divider',
                backgroundColor: 'background.paper',
                backgroundImage: 'none',
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px rgba(245, 158, 11, 0.05)`
                }
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary', mb: 1 }}>
                    {tier.title}
                  </Typography>
                  <Typography variant="h3" fontWeight="800" sx={{ color: 'text.primary', mb: 2 }}>
                    {tier.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: '13px', lineHeight: 1.5 }}>
                    {tier.desc}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                    {tier.features.map(f => (
                      <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckIcon sx={{ color: tier.color, fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {f}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Button
                  variant={tier.active ? "outlined" : "contained"}
                  fullWidth
                  disabled={tier.active}
                  onClick={() => setSelectedTier(tier)}
                  sx={{ borderRadius: 2, py: 1, textTransform: 'none', fontWeight: 'bold' }}
                >
                  {tier.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Subscription Dialog popup */}
      <Dialog
        open={Boolean(selectedTier)}
        onClose={() => setSelectedTier(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            backgroundImage: 'none'
          }
        }}
      >
        {selectedTier && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Subscribe to {selectedTier.title}</DialogTitle>
            <DialogContent>
              {success ? (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  Subscription complete! Welcome to Pro.
                </Alert>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Enter payment details to upgrade to the premium tier and unlock vesting split calculators.
                </Typography>
              )}

              <TextField
                margin="dense"
                label="Card Number"
                fullWidth
                variant="outlined"
                disabled={success}
                placeholder="4000 1234 5678 9010"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="Expiry Date"
                    fullWidth
                    variant="outlined"
                    disabled={success}
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="CVV"
                    fullWidth
                    variant="outlined"
                    disabled={success}
                    placeholder="123"
                    value={cvv}
                    onChange={e => setCvv(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setSelectedTier(null)} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubscribe} 
                variant="contained" 
                disabled={success || !cardNumber || !expiry || !cvv}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Pay & Activate
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
