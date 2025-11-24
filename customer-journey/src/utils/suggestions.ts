/**
 * Suggestions Generator - Schlosser & Associates
 *
 * Contextual suggestions for each automation chapter.
 * In production, these would call an AI service for dynamic recommendations.
 */

import type { Suggestion, Chapter } from '../types';

/**
 * Generate suggestions relevant to a specific chapter
 * Customized for Schlosser & Associates contractor workflows
 *
 * @param chapter - The current chapter
 * @returns Array of 3 suggestions
 */
export function getChapterSuggestions(chapter: Chapter): Suggestion[] {
  const baseSuggestions: Record<string, Suggestion[]> = {
    // Chapter 1: The Capture - Estimating & Proposals
    'chapter-1': [
      {
        id: 'sug-1-1',
        title: 'Photo AI Analysis',
        description: 'Add AI that analyzes site photos to auto-detect equipment models, pipe sizes, and potential issues.',
        impact: 'high',
      },
      {
        id: 'sug-1-2',
        title: 'Voice-to-Estimate',
        description: 'Enhance voice notes with AI transcription that auto-populates material lists from spoken descriptions.',
        impact: 'high',
      },
      {
        id: 'sug-1-3',
        title: 'Historical Pricing Intelligence',
        description: 'Surface similar past jobs to validate estimates and improve accuracy over time.',
        impact: 'medium',
      },
    ],

    // Chapter 2: The Bridge - Dispatch & Work Orders
    'chapter-2': [
      {
        id: 'sug-2-1',
        title: 'Smart Tech Matching',
        description: 'AI matches jobs to technicians based on skills, certifications, location, and current workload.',
        impact: 'high',
      },
      {
        id: 'sug-2-2',
        title: 'Parts Pre-Staging',
        description: 'Auto-generate pick lists and stage parts at warehouse before tech arrives.',
        impact: 'medium',
      },
      {
        id: 'sug-2-3',
        title: 'Customer ETA Notifications',
        description: 'Send automated "tech on the way" texts with real-time arrival estimates.',
        impact: 'high',
      },
    ],

    // Chapter 3: The Close - Billing & Collections
    'chapter-3': [
      {
        id: 'sug-3-1',
        title: 'Payment Plan Automation',
        description: 'Offer automated financing options for jobs over $2,500 to improve close rates.',
        impact: 'high',
      },
      {
        id: 'sug-3-2',
        title: 'Review Request Automation',
        description: 'Trigger Google/Yelp review requests after successful payment with high satisfaction scores.',
        impact: 'medium',
      },
      {
        id: 'sug-3-3',
        title: 'Aging Report Alerts',
        description: 'Weekly aging report with AI-prioritized follow-up recommendations based on payment history.',
        impact: 'medium',
      },
    ],

    // Chapter 4: Command Center Dashboard
    'chapter-4': [
      {
        id: 'sug-4-1',
        title: 'Technician Scorecards',
        description: 'Add individual tech dashboards showing their metrics, earnings, and performance trends.',
        impact: 'high',
      },
      {
        id: 'sug-4-2',
        title: 'Job Profitability Alerts',
        description: 'Real-time alerts when jobs exceed estimated hours or materials to catch overruns early.',
        impact: 'high',
      },
      {
        id: 'sug-4-3',
        title: 'Dispatch Board Integration',
        description: 'Add drag-and-drop dispatch board with tech availability and job assignments.',
        impact: 'medium',
      },
    ],

    // Chapter 5: AI Insights Engine
    'chapter-5': [
      {
        id: 'sug-5-1',
        title: 'Maintenance Agreement Predictions',
        description: 'AI identifies customers likely to purchase service agreements based on job history.',
        impact: 'high',
      },
      {
        id: 'sug-5-2',
        title: 'Warranty Claim Forecasting',
        description: 'Predict which jobs may result in callbacks to proactively improve quality.',
        impact: 'medium',
      },
      {
        id: 'sug-5-3',
        title: 'Pricing Optimization',
        description: 'AI suggests optimal pricing adjustments based on market conditions and win rates.',
        impact: 'high',
      },
    ],

    // Chapter 6: Customer Portal
    'chapter-6': [
      {
        id: 'sug-6-1',
        title: 'Equipment History Tracking',
        description: 'Let customers view service history and warranty info for all equipment at their property.',
        impact: 'medium',
      },
      {
        id: 'sug-6-2',
        title: 'Online Scheduling',
        description: 'Allow customers to book appointments directly through the portal with available time slots.',
        impact: 'high',
      },
      {
        id: 'sug-6-3',
        title: 'Referral Program Integration',
        description: 'Built-in referral system where customers can share and earn credits for new business.',
        impact: 'high',
      },
    ],
  };

  return baseSuggestions[chapter.id] || [
    {
      id: 'sug-default-1',
      title: 'Process Optimization',
      description: 'Review and optimize the current automation workflow for better performance.',
      impact: 'medium',
    },
    {
      id: 'sug-default-2',
      title: 'Integration Expansion',
      description: 'Connect additional tools and services to enhance automation capabilities.',
      impact: 'medium',
    },
    {
      id: 'sug-default-3',
      title: 'Analytics Enhancement',
      description: 'Add detailed metrics and reporting to track automation ROI.',
      impact: 'low',
    },
  ];
}

/**
 * Generate value/cost optimization suggestions for ROI page
 * Customized for Schlosser & Associates
 *
 * @returns Array of 3 value optimization suggestions
 */
export function getValueOptimizationSuggestions(): Suggestion[] {
  return [
    {
      id: 'val-1',
      title: 'Start with Core Package',
      description: 'The Capture → Bridge → Close workflow delivers the fastest ROI. Most contractors see payback in 4-6 months.',
      impact: 'high',
    },
    {
      id: 'val-2',
      title: 'Add Customer Portal for Collections',
      description: 'Online payments typically reduce Days Sales Outstanding (DSO) by 15-25 days, improving cash flow significantly.',
      impact: 'high',
    },
    {
      id: 'val-3',
      title: 'Phase AI Insights for Year 2',
      description: 'Start with Core or Growth, then add AI Insights once you have 6+ months of data for accurate predictions.',
      impact: 'medium',
    },
  ];
}

/**
 * Get impact badge color based on impact level
 */
export function getImpactColor(impact: Suggestion['impact']): string {
  switch (impact) {
    case 'high':
      return 'bg-green-600 text-white';
    case 'medium':
      return 'bg-yellow-600 text-white';
    case 'low':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}
