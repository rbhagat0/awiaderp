export const TIER_PLANS = {
  starter: {
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    maxUsers: 5,
    maxClients: 50,
    maxProjects: 10,
    maxTasks: 100,
    features: [
      'Basic dashboard',
      'Client management',
      'Project tracking',
      'Email support',
    ],
    price: '$29/month',
  },
  professional: {
    name: 'Professional',
    description: 'For growing teams that need more power',
    maxUsers: 25,
    maxClients: 200,
    maxProjects: 50,
    maxTasks: 500,
    features: [
      'Everything in Starter, plus:',
      'Advanced reporting',
      'API access',
      'Priority email support',
      'Custom domains',
    ],
    price: '$79/month',
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For large organizations with unlimited needs',
    maxUsers: -1, // unlimited
    maxClients: -1, // unlimited
    maxProjects: -1, // unlimited
    maxTasks: -1, // unlimited
    features: [
      'Everything in Professional, plus:',
      'Unlimited users, clients, projects, tasks',
      'SSO / SAML integration',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom SLA',
    ],
    price: '$199/month',
  },
};

export const getTierPlan = (tier) => TIER_PLANS[tier] || TIER_PLANS.starter;

export const isUnlimited = (value) => value === -1;
