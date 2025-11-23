/**
 * Suggestions Generator
 *
 * Placeholder functions that generate contextual suggestions for chapters
 * and value optimization. In production, these would call an AI service.
 */

import type { Suggestion, Chapter } from '../types';

/**
 * Generate suggestions relevant to a specific chapter
 * Placeholder implementation - returns static suggestions based on chapter context
 *
 * @param chapter - The current chapter
 * @returns Array of 3 suggestions
 */
export function getChapterSuggestions(chapter: Chapter): Suggestion[] {
  const baseSuggestions: Record<string, Suggestion[]> = {
    'chapter-1': [
      {
        id: 'sug-1-1',
        title: 'Multi-Channel Lead Scoring',
        description: 'Enhance lead qualification with ML-based scoring across email, social, and web touchpoints.',
        impact: 'high',
      },
      {
        id: 'sug-1-2',
        title: 'CRM Deep Integration',
        description: 'Sync qualified leads directly into your CRM with enriched contact data.',
        impact: 'medium',
      },
      {
        id: 'sug-1-3',
        title: 'Lead Nurturing Sequences',
        description: 'Automatically enroll leads in personalized drip campaigns based on qualification score.',
        impact: 'medium',
      },
    ],
    'chapter-2': [
      {
        id: 'sug-2-1',
        title: 'Template Library Expansion',
        description: 'Create 20+ document templates for common use cases with variable placeholders.',
        impact: 'high',
      },
      {
        id: 'sug-2-2',
        title: 'Version Control Integration',
        description: 'Track document revisions and maintain audit trail for compliance.',
        impact: 'medium',
      },
      {
        id: 'sug-2-3',
        title: 'E-Signature Workflow',
        description: 'Route generated documents through automated e-signature collection.',
        impact: 'high',
      },
    ],
    'chapter-3': [
      {
        id: 'sug-3-1',
        title: 'Sentiment Analysis',
        description: 'Detect customer frustration early and escalate before issues compound.',
        impact: 'high',
      },
      {
        id: 'sug-3-2',
        title: 'Knowledge Base Auto-Update',
        description: 'AI learns from resolved tickets to improve future responses automatically.',
        impact: 'medium',
      },
      {
        id: 'sug-3-3',
        title: 'Multi-Language Support',
        description: 'Extend support automation to 10+ languages with real-time translation.',
        impact: 'medium',
      },
    ],
    'chapter-4': [
      {
        id: 'sug-4-1',
        title: 'Custom Dashboard Builder',
        description: 'Create executive dashboards that update in real-time with predictions.',
        impact: 'high',
      },
      {
        id: 'sug-4-2',
        title: 'Anomaly Detection Alerts',
        description: 'Get notified immediately when metrics deviate from expected patterns.',
        impact: 'high',
      },
      {
        id: 'sug-4-3',
        title: 'Competitor Intelligence',
        description: 'Incorporate market signals and competitor data into forecasts.',
        impact: 'medium',
      },
    ],
    'chapter-5': [
      {
        id: 'sug-5-1',
        title: 'Error Recovery Automation',
        description: 'Implement self-healing workflows that auto-retry failed operations.',
        impact: 'high',
      },
      {
        id: 'sug-5-2',
        title: 'Process Mining Integration',
        description: 'Discover bottlenecks and optimization opportunities from process logs.',
        impact: 'medium',
      },
      {
        id: 'sug-5-3',
        title: 'Real-Time Monitoring Dashboard',
        description: 'Visual overview of all running workflows with performance metrics.',
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
 * Placeholder implementation - would call AI in production
 *
 * @returns Array of 3 value optimization suggestions
 */
export function getValueOptimizationSuggestions(): Suggestion[] {
  return [
    {
      id: 'val-1',
      title: 'Bundle Discount Opportunity',
      description: 'Adding Chapter 3 (Support Automation) to your cart qualifies you for a 15% bundle discount.',
      impact: 'high',
    },
    {
      id: 'val-2',
      title: 'Phased Implementation',
      description: 'Consider spreading implementation across 2 quarters to reduce initial cash outlay and validate ROI progressively.',
      impact: 'medium',
    },
    {
      id: 'val-3',
      title: 'Quick Win First',
      description: 'Start with Chapter 1 (Lead Capture) for fastest time-to-value and proof of concept for stakeholders.',
      impact: 'high',
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
