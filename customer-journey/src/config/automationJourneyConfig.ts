/**
 * Automation Journey Configuration - Schlosser & Associates
 *
 * This is the SINGLE source of truth for all journey content.
 * Customized for Schlosser & Associates contractor automation workflows.
 *
 * @see README.md for detailed customization instructions
 */

import type { AutomationJourneyConfig } from '../types';

export const automationJourneyConfig: AutomationJourneyConfig = {
  // ============================================================================
  // BRAND CONFIGURATION
  // ============================================================================
  brand: {
    companyName: "Schlosser & Associates",
    logoUrl: "/assets/icons/logo.svg",
    colorScheme: {
      parchment: "#F6E7C1",
      ink: "#2B1B0E",
      gold: "#D4AF37",
    },
  },

  // ============================================================================
  // VIEWER CONFIGURATION
  // ============================================================================
  viewer: {
    firstNamePlaceholder: "{{FIRST_NAME}}",
  },

  // ============================================================================
  // CHAPTERS (AUTOMATIONS)
  // Schlosser & Associates Contractor Automation Workflows
  // ============================================================================
  chapters: [
    // -------------------------------------------------------------------------
    // PART 1: THE CAPTURE - Automating Estimating & Proposals
    // -------------------------------------------------------------------------
    {
      id: "chapter-1",
      title: "Chapter I: The Capture",
      summaryOneLiner: "Transform site visits into professional proposals in minutes with AI-powered estimating.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/the-capture.svg",
      },
      hoverInfo: [
        "Mobile-friendly web form captures site photos, voice notes, and material lists",
        "AI Processing Engine analyzes inputs and queries SupplyHouse & Ferguson APIs for real-time pricing",
        "Pricing Logic Engine calculates totals with $119/hr labor rate and 30% material markup",
        "PDF Generator creates professional proposals with DocuSign integration",
        "Customers receive and sign proposals digitally - no paper needed",
      ],
      tools: [
        "Mobile Web Form",
        "AI Processing Engine",
        "SupplyHouse API",
        "Ferguson API",
        "Pricing Logic Engine",
        "PDF Generator",
        "DocuSign Integration",
      ],
      pricing: {
        costUSD: 8500,
        implHours: 24,
      },
      savings: {
        hoursPerWeek: 12,
        dollarsPerYear: 62400,
      },
      mapPosition: { x: 12, y: 25 },
    },

    // -------------------------------------------------------------------------
    // PART 2: THE BRIDGE - Automating Dispatch & Work Orders
    // -------------------------------------------------------------------------
    {
      id: "chapter-2",
      title: "Chapter II: The Bridge",
      summaryOneLiner: "Signed proposals automatically create work orders and dispatch technicians instantly.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/the-bridge.svg",
      },
      hoverInfo: [
        "Signed DocuSign proposal triggers the automation workflow",
        "Webhook Listener parses customer info, scope of work, and parts list",
        "AI Processing generates detailed tech notes for field crews",
        "Sage 100 Contractor API creates new work orders automatically",
        "Mobile App Sync pushes work orders directly to technician devices",
        "Eliminates paper entirely - techs receive everything digitally",
      ],
      tools: [
        "DocuSign Webhooks",
        "Data Parser",
        "AI Tech Notes Generator",
        "Sage 100 Contractor API",
        "Sage 100 Database",
        "Mobile App Sync",
        "Technician Mobile App",
      ],
      pricing: {
        costUSD: 7500,
        implHours: 20,
      },
      savings: {
        hoursPerWeek: 10,
        dollarsPerYear: 52000,
      },
      mapPosition: { x: 32, y: 15 },
    },

    // -------------------------------------------------------------------------
    // PART 3: THE CLOSE - Automating Billing & Collections
    // -------------------------------------------------------------------------
    {
      id: "chapter-3",
      title: "Chapter III: The Close",
      summaryOneLiner: "Job completion triggers automatic invoicing with intelligent collections follow-up.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/the-close.svg",
      },
      hoverInfo: [
        "Tech marks job 'Complete' in mobile app with hours, parts, and photos",
        "Data syncs to Sage 100 Contractor database automatically",
        "Auto-Billing Bot generates invoices with PDF and payment links",
        "Tiered Collections Logic handles payment tracking and follow-ups",
        "Bills over $1,000 unpaid alert Taylor for personal follow-up call",
        "Smaller unpaid bills trigger auto-email reminders after 3 days",
      ],
      tools: [
        "Mobile Completion Tracking",
        "Sage 100 Data Sync",
        "Auto-Billing Bot",
        "PDF Invoice Generator",
        "Payment Link Integration",
        "Tiered Collections Logic",
        "Auto-Email Reminders",
        "Alert System",
      ],
      pricing: {
        costUSD: 6500,
        implHours: 18,
      },
      savings: {
        hoursPerWeek: 8,
        dollarsPerYear: 41600,
      },
      mapPosition: { x: 52, y: 30 },
    },

    // -------------------------------------------------------------------------
    // NEW FEATURE 1: COMMAND CENTER DASHBOARD
    // -------------------------------------------------------------------------
    {
      id: "chapter-4",
      title: "Chapter IV: The Command Center",
      summaryOneLiner: "Real-time visibility into every job, tech, and dollar across your operation.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/command-center.svg",
      },
      hoverInfo: [
        "Live dashboard showing all active jobs, technician locations, and status",
        "Real-time revenue tracking with daily, weekly, and monthly views",
        "Technician performance metrics: jobs completed, revenue generated, customer ratings",
        "Automated alerts for jobs running over estimate or behind schedule",
        "Inventory tracking with low-stock warnings and auto-reorder suggestions",
        "Custom KPI widgets you can configure for your business priorities",
      ],
      tools: [
        "Real-Time Data Engine",
        "Custom Dashboard Builder",
        "GPS Tracking Integration",
        "Performance Analytics",
        "Inventory Management",
        "Alert & Notification System",
        "Mobile Dashboard App",
      ],
      pricing: {
        costUSD: 5500,
        implHours: 16,
      },
      savings: {
        hoursPerWeek: 6,
        dollarsPerYear: 31200,
      },
      mapPosition: { x: 72, y: 18 },
    },

    // -------------------------------------------------------------------------
    // NEW FEATURE 2: AI INSIGHTS ENGINE
    // -------------------------------------------------------------------------
    {
      id: "chapter-5",
      title: "Chapter V: The Oracle's Lens",
      summaryOneLiner: "AI analyzes your data to predict problems and surface opportunities before you see them.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/ai-insights.svg",
      },
      hoverInfo: [
        "Predictive job costing: AI learns from past jobs to improve estimate accuracy",
        "Customer churn prediction: identifies at-risk accounts 30+ days early",
        "Seasonal demand forecasting: plan staffing and inventory ahead of busy periods",
        "Profitability analysis: surfaces which job types, customers, and techs drive margin",
        "Smart scheduling suggestions: optimize routes and reduce windshield time",
        "Weekly AI-generated insights report delivered to your inbox",
      ],
      tools: [
        "Machine Learning Pipeline",
        "Predictive Analytics Engine",
        "Historical Data Analyzer",
        "Route Optimization AI",
        "Demand Forecasting",
        "Automated Insights Reports",
        "Natural Language Summaries",
      ],
      pricing: {
        costUSD: 9000,
        implHours: 28,
      },
      savings: {
        hoursPerWeek: 8,
        dollarsPerYear: 75000,
      },
      mapPosition: { x: 85, y: 35 },
    },

    // -------------------------------------------------------------------------
    // NEW FEATURE 3: CUSTOMER PORTAL
    // -------------------------------------------------------------------------
    {
      id: "chapter-6",
      title: "Chapter VI: The Customer Gateway",
      summaryOneLiner: "A branded self-service portal where customers view proposals, pay invoices, and track jobs.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/customer-portal.svg",
      },
      hoverInfo: [
        "Branded customer portal with your logo and colors",
        "Customers view and e-sign proposals without creating accounts",
        "Real-time job tracking: customers see technician ETA and progress",
        "Online invoice payment with credit card, ACH, and financing options",
        "Service history and document archive for each property",
        "Automated appointment reminders and satisfaction surveys",
        "Reduces inbound 'where's my tech?' calls by 60%+",
      ],
      tools: [
        "White-Label Portal Builder",
        "Secure Customer Authentication",
        "Real-Time Job Tracking",
        "Payment Processing (Stripe/Square)",
        "Document Management",
        "Automated Communications",
        "Survey & Review Collection",
      ],
      pricing: {
        costUSD: 7000,
        implHours: 22,
      },
      savings: {
        hoursPerWeek: 10,
        dollarsPerYear: 52000,
      },
      mapPosition: { x: 65, y: 55 },
    },
  ],

  // ============================================================================
  // ROI CONFIGURATION
  // ============================================================================
  roi: {
    assumptions: {
      workWeeksPerYear: "50 weeks (accounting for holidays)",
      hourlyCalculation: "Based on fully-loaded employee cost including benefits",
      laborRate: "Field labor calculated at $119/hr billing rate",
      adoptionRamp: "70% adoption assumed in Year 1, scaling to 95%+ by Year 3",
      maintenanceCost: "Annual maintenance estimated at 12% of implementation cost",
      collectionImprovement: "Automated collections typically improve DSO by 15-25 days",
    },
    sliders: [
      {
        id: "avgHourlyCost",
        label: "Office staff hourly cost ($)",
        min: 25,
        max: 150,
        step: 5,
        default: 55,
      },
      {
        id: "hoursSavedPerWeek",
        label: "Estimated hours saved per week",
        min: 5,
        max: 80,
        step: 1,
        default: 35,
      },
      {
        id: "automationUptakeRate",
        label: "Automation adoption rate (%)",
        min: 50,
        max: 100,
        step: 5,
        default: 75,
      },
    ],
  },

  // ============================================================================
  // PACKAGES
  // ============================================================================
  packages: [
    {
      tier: "Core",
      includedChapterIds: ["chapter-1", "chapter-2", "chapter-3"],
      priceUSD: 19500,
      description: "The complete Capture → Bridge → Close workflow. Automate from estimate to payment.",
      features: [
        "AI-powered estimating & proposals",
        "Automated dispatch & work orders",
        "Auto-billing & smart collections",
        "Sage 100 Contractor integration",
        "DocuSign e-signatures",
        "Mobile app for technicians",
        "60-day implementation",
        "Training for office & field staff",
        "Email & phone support",
      ],
    },
    {
      tier: "Growth",
      includedChapterIds: ["chapter-1", "chapter-2", "chapter-3", "chapter-4", "chapter-6"],
      priceUSD: 29000,
      description: "Core workflow plus real-time visibility and customer self-service.",
      features: [
        "Everything in Core",
        "Command Center dashboard",
        "Real-time job & tech tracking",
        "Branded customer portal",
        "Online payments (CC, ACH, financing)",
        "Performance analytics",
        "75-day implementation",
        "Priority support",
        "Monthly optimization reviews",
      ],
    },
    {
      tier: "Scale",
      includedChapterIds: ["chapter-1", "chapter-2", "chapter-3", "chapter-4", "chapter-5", "chapter-6"],
      priceUSD: 42000,
      description: "Full automation suite with AI-powered insights for data-driven growth.",
      features: [
        "Everything in Growth",
        "AI Insights Engine",
        "Predictive job costing",
        "Demand forecasting",
        "Customer churn prediction",
        "Route optimization AI",
        "Weekly AI insights reports",
        "90-day implementation",
        "Dedicated success manager",
        "Quarterly strategy sessions",
      ],
    },
  ],
};

/**
 * Helper function to get a chapter by ID
 */
export const getChapterById = (id: string) => {
  return automationJourneyConfig.chapters.find((chapter) => chapter.id === id);
};

/**
 * Helper function to get all chapter IDs for a package
 */
export const getPackageChapters = (packageTier: string) => {
  const pkg = automationJourneyConfig.packages.find((p) => p.tier === packageTier);
  if (!pkg) return [];
  return pkg.includedChapterIds.map((id) => getChapterById(id)).filter(Boolean);
};

/**
 * Default export for easy importing
 */
export default automationJourneyConfig;
