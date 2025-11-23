/**
 * Automation Journey Configuration
 *
 * This is the SINGLE source of truth for all journey content.
 * Modify this file to customize chapters, pricing, packages, and ROI calculations.
 *
 * @see README.md for detailed customization instructions
 */

import type { AutomationJourneyConfig } from '../types';

export const automationJourneyConfig: AutomationJourneyConfig = {
  // ============================================================================
  // BRAND CONFIGURATION
  // ============================================================================
  brand: {
    companyName: "MAB AI Strategies LLC",
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
  // Each chapter represents a distinct AI/automation workflow
  // ============================================================================
  chapters: [
    {
      id: "chapter-1",
      title: "Chapter I: The Gateway of Automated Inquiries",
      summaryOneLiner: "Intelligent lead capture and qualification that works while you rest.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/chapter-1.svg",
      },
      hoverInfo: [
        "Automatically captures leads from web forms, email, and social channels",
        "AI qualifies prospects based on your ideal customer profile",
        "Routes high-value leads to your team instantly",
      ],
      tools: ["Zapier", "OpenAI API", "Google Sheets", "Slack", "CRM Webhook"],
      pricing: {
        costUSD: 2500,
        implHours: 8,
      },
      savings: {
        hoursPerWeek: 6,
        dollarsPerYear: 15600,
      },
      mapPosition: { x: 15, y: 25 },
    },
    {
      id: "chapter-2",
      title: "Chapter II: The Scribe's Eternal Quill",
      summaryOneLiner: "AI-powered document generation that drafts proposals, contracts, and reports.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/chapter-2.svg",
      },
      hoverInfo: [
        "Generates customized proposals based on client requirements",
        "Auto-populates contracts with verified data",
        "Creates executive reports from raw data in seconds",
      ],
      tools: ["GPT-4", "Google Docs API", "PandaDoc", "Data Warehouse"],
      pricing: {
        costUSD: 3500,
        implHours: 12,
      },
      savings: {
        hoursPerWeek: 8,
        dollarsPerYear: 20800,
      },
      mapPosition: { x: 35, y: 15 },
    },
    {
      id: "chapter-3",
      title: "Chapter III: The Sentinel's Watch",
      summaryOneLiner: "24/7 customer support automation that never sleeps.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/chapter-3.svg",
      },
      hoverInfo: [
        "AI chatbot handles Tier 1 support inquiries automatically",
        "Escalates complex issues to human agents with full context",
        "Maintains consistent response quality around the clock",
      ],
      tools: ["Custom AI Agent", "Intercom", "Zendesk API", "Knowledge Base"],
      pricing: {
        costUSD: 4500,
        implHours: 16,
      },
      savings: {
        hoursPerWeek: 15,
        dollarsPerYear: 39000,
      },
      mapPosition: { x: 55, y: 30 },
    },
    {
      id: "chapter-4",
      title: "Chapter IV: The Oracle's Vision",
      summaryOneLiner: "Predictive analytics that forecast trends before they emerge.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/chapter-4.svg",
      },
      hoverInfo: [
        "ML models predict customer churn 30+ days in advance",
        "Forecasts inventory needs based on market signals",
        "Identifies emerging opportunities in your data",
      ],
      tools: ["Python ML Pipeline", "BigQuery", "Tableau API", "Custom Models"],
      pricing: {
        costUSD: 6000,
        implHours: 24,
      },
      savings: {
        hoursPerWeek: 10,
        dollarsPerYear: 52000,
      },
      mapPosition: { x: 75, y: 20 },
    },
    {
      id: "chapter-5",
      title: "Chapter V: The Grand Orchestration",
      summaryOneLiner: "End-to-end workflow automation connecting all your business processes.",
      diagram: {
        type: "svg",
        src: "/assets/diagrams/chapter-5.svg",
      },
      hoverInfo: [
        "Connects disparate systems into unified workflows",
        "Triggers cascading actions across departments",
        "Provides real-time visibility into process health",
      ],
      tools: ["n8n", "Custom Orchestrator", "Multi-API Integration", "Monitoring"],
      pricing: {
        costUSD: 8000,
        implHours: 32,
      },
      savings: {
        hoursPerWeek: 20,
        dollarsPerYear: 78000,
      },
      mapPosition: { x: 85, y: 45 },
    },
  ],

  // ============================================================================
  // ROI CONFIGURATION
  // ============================================================================
  roi: {
    assumptions: {
      workWeeksPerYear: "50 weeks (accounting for holidays)",
      hourlyCalculation: "Based on fully-loaded employee cost",
      adoptionRamp: "70% adoption assumed in Year 1, scaling to 90%+ by Year 3",
      maintenanceCost: "Annual maintenance estimated at 15% of implementation cost",
    },
    sliders: [
      {
        id: "avgHourlyCost",
        label: "Average hourly cost ($)",
        min: 20,
        max: 200,
        step: 5,
        default: 65,
      },
      {
        id: "hoursSavedPerWeek",
        label: "Estimated hours saved per week",
        min: 1,
        max: 100,
        step: 1,
        default: 20,
      },
      {
        id: "automationUptakeRate",
        label: "Automation adoption rate (%)",
        min: 10,
        max: 100,
        step: 5,
        default: 70,
      },
    ],
  },

  // ============================================================================
  // PACKAGES
  // ============================================================================
  packages: [
    {
      tier: "Core",
      includedChapterIds: ["chapter-1", "chapter-2"],
      priceUSD: 5500,
      description: "Essential automations to modernize your lead capture and document workflows.",
      features: [
        "Lead capture & qualification automation",
        "AI document generation",
        "Basic integration support",
        "30-day implementation",
        "Email support",
      ],
    },
    {
      tier: "Growth",
      includedChapterIds: ["chapter-1", "chapter-2", "chapter-3"],
      priceUSD: 9500,
      description: "Expand your automation footprint with 24/7 customer support capabilities.",
      features: [
        "Everything in Core",
        "AI-powered support automation",
        "Multi-channel integration",
        "45-day implementation",
        "Priority support",
        "Monthly optimization reviews",
      ],
    },
    {
      tier: "Scale",
      includedChapterIds: ["chapter-1", "chapter-2", "chapter-3", "chapter-4", "chapter-5"],
      priceUSD: 22000,
      description: "Complete enterprise transformation with predictive analytics and full orchestration.",
      features: [
        "Everything in Growth",
        "Predictive analytics suite",
        "Full workflow orchestration",
        "Custom ML models",
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
