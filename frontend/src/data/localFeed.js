export const userSession = {
  name: "Alex Rivera",
  email: "alex.rivera@devmail.com",
  role: "Talent",
  title: "Senior Full Stack Engineer",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  skills: ["React.js", "Node.js", "Express", "MongoDB", "TypeScript", "Python"]
};

export const dashboardStats = [
  {
    id: "matches",
    title: "Best Matches",
    value: "14",
    trend: "+3 this week",
    color: "#10b981"
  },
  {
    id: "applications",
    title: "Active Pitches",
    value: "4",
    trend: "2 pending response",
    color: "#f59e0b"
  },
  {
    id: "workspaces",
    title: "Workspaces Active",
    value: "2",
    trend: "1 sprint active",
    color: "#a855f7"
  },
  {
    id: "interviews",
    title: "Interviews Booked",
    value: "3",
    trend: "Next tomorrow at 10 AM",
    color: "#f43f5e"
  }
];

export const startupList = [
  {
    id: 1,
    name: "EcoSphere AI",
    tagline: "AI carbon offset verification for enterprise compliance.",
    description: "EcoSphere uses satellite imagery and machine learning to verify carbon offset details and forest growth.",
    industry: "CleanTech",
    stage: "Pre-seed",
    equity: "3.5% - 5.0%",
    founder: "Sarah Jenkins",
    skillsRequired: ["React.js", "Python", "TensorFlow", "Node.js"],
    location: "San Francisco, CA (Remote)",
    avatarColor: "#059669"
  },
  {
    id: 2,
    name: "FinFlow Solutions",
    tagline: "Decentralized automated invoicing for global freelancers.",
    description: "FinFlow builds invoice collection systems that convert payments directly to stablecoins.",
    industry: "FinTech",
    stage: "Seed",
    equity: "2.0% - 4.5%",
    founder: "David Miller",
    skillsRequired: ["Solidity", "React.js", "TypeScript", "Next.js"],
    location: "Austin, TX (Hybrid)",
    avatarColor: "#2563eb"
  },
  {
    id: 3,
    name: "MediPrompt",
    tagline: "AI voice transcription for medical clinics.",
    description: "MediPrompt converts ambient doctor-patient dialogue directly into HIPAA-compliant clinical charts.",
    industry: "HealthTech",
    stage: "MVP Demo",
    equity: "4.0% - 6.0%",
    founder: "Dr. Aaron Patel",
    skillsRequired: ["React Native", "FastAPI", "NLP", "AWS Security"],
    location: "New York, NY (Remote)",
    avatarColor: "#dc2626"
  },
  {
    id: 4,
    name: "VeloTransit",
    tagline: "SaaS routing engine for micromobility logistics.",
    description: "VeloTransit optimizes battery swapping paths for shared electric scooter and bike fleets.",
    industry: "Logistics",
    stage: "Seed Round A",
    equity: "1.5% - 3.0%",
    founder: "Elena Rostova",
    skillsRequired: ["Golang", "React.js", "PostgreSQL", "Docker"],
    location: "Berlin, Germany (Remote)",
    avatarColor: "#7c3aed"
  }
];

export const alertsList = [
  {
    id: 1,
    title: "Application Accepted",
    desc: "Your pitch to join EcoSphere AI as a Full Stack Lead was accepted. Sarah Jenkins invited you to Workspace #2.",
    time: "2 hours ago",
    type: "success"
  },
  {
    id: 2,
    title: "New Match Found",
    desc: "VeloTransit matches 92% of your profile skills (React.js, Node.js). They are recruiting a senior co-founder.",
    time: "5 hours ago",
    type: "info"
  },
  {
    id: 3,
    title: "Interview Scheduled",
    desc: "David Miller from FinFlow scheduled a co-founder chemistry interview for June 18th, 10:30 AM EST.",
    time: "1 day ago",
    type: "warning"
  },
  {
    id: 4,
    title: "Startup Views",
    desc: "Your profile was viewed by 5 startup founders looking for developer partners this week.",
    time: "2 days ago",
    type: "info"
  }
];

export const shortcuts = [
  {
    id: "edit-profile",
    title: "Optimize Co-Founder Profile",
    desc: "Update your bios, tech stacks, and showcase projects to matching founders.",
    btnText: "Update Profile",
    color: "primary"
  },
  {
    id: "find-partners",
    title: "Explore Open Roles",
    desc: "Browse through 40+ startup projects offering co-founder status and equity.",
    btnText: "Browse Startups",
    color: "secondary"
  },
  {
    id: "legal-agreements",
    title: "View Equity Templates",
    desc: "Read standard co-founder vesting agreements and dynamic split documents.",
    btnText: "Access Documents",
    color: "info"
  }
];
