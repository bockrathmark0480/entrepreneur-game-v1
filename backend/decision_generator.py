"""
Decision Generator - Creates business decisions for gameplay
Uses AI to generate contextual, realistic business scenarios
"""
import random
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from .models import (
    Decision, QuestionType, DifficultyLevel,
    CompanyTimeline, DecisionOutcome, CompanyEvent
)
from .ai_client import AIClient


class DecisionGenerator:
    """Generates strategic business decisions for the game"""

    def __init__(self, ai_client: AIClient):
        self.ai_client = ai_client

    def generate_decision(
        self,
        decision_number: int,
        total_decisions: int,
        current_date: datetime,
        timeline: CompanyTimeline,
        previous_outcomes: List[DecisionOutcome],
        remaining_days: int,
        difficulty: DifficultyLevel
    ) -> Decision:
        """
        Generate a single business decision

        Args:
            decision_number: Current decision number (1-indexed)
            total_decisions: Total decisions in game
            current_date: Current game date
            timeline: Company timeline with history and predictions
            previous_outcomes: Outcomes of previous decisions
            remaining_days: Days remaining in game
            difficulty: Game difficulty level

        Returns:
            Decision object
        """
        # Determine question type (weighted by difficulty)
        question_type = self._select_question_type(decision_number, total_decisions, difficulty)

        # Calculate timespan for this decision
        timespan_days = self._calculate_timespan(remaining_days, total_decisions - decision_number + 1)

        # Build context for AI
        context = self._build_decision_context(
            decision_number=decision_number,
            total_decisions=total_decisions,
            current_date=current_date,
            timeline=timeline,
            previous_outcomes=previous_outcomes,
            timespan_days=timespan_days,
            question_type=question_type.value
        )

        # Generate decision using AI
        ai_response = self.ai_client.generate_decision(context)

        # Create Decision object
        decision = Decision(
            id=str(uuid.uuid4()),
            decision_number=decision_number,
            date=current_date,
            context=ai_response.get('context', ''),
            question=ai_response.get('question', ''),
            question_type=question_type,
            options=ai_response.get('options'),
            correct_answer=ai_response.get('optimal_answer'),
            timespan_days=timespan_days,
            difficulty_factors=ai_response.get('difficulty_factors', {})
        )

        return decision

    def _select_question_type(
        self,
        decision_number: int,
        total_decisions: int,
        difficulty: DifficultyLevel
    ) -> QuestionType:
        """Select question type based on progression and difficulty"""

        # Early decisions are easier
        if decision_number <= 2:
            return random.choice([QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE])

        # Late game has more complex questions
        if decision_number >= total_decisions - 2:
            return random.choice([QuestionType.FILL_IN_BLANK, QuestionType.WRITTEN_RESPONSE])

        # Difficulty influences question type
        if difficulty == DifficultyLevel.EASY:
            weights = [0.4, 0.4, 0.1, 0.1]  # Favor TF and MC
        elif difficulty == DifficultyLevel.MEDIUM:
            weights = [0.25, 0.35, 0.25, 0.15]
        elif difficulty == DifficultyLevel.HARD:
            weights = [0.2, 0.3, 0.3, 0.2]
        else:  # EXPERT
            weights = [0.1, 0.3, 0.3, 0.3]  # Favor harder questions

        return random.choices(list(QuestionType), weights=weights)[0]

    def _calculate_timespan(self, remaining_days: int, remaining_decisions: int) -> int:
        """Calculate how many days this decision should span"""
        if remaining_decisions == 0:
            return remaining_days

        # Base timespan with some randomness
        avg_days_per_decision = remaining_days / remaining_decisions
        min_days = int(avg_days_per_decision * 0.6)
        max_days = int(avg_days_per_decision * 1.4)

        # Ensure at least 7 days, max 180 days per decision
        min_days = max(7, min_days)
        max_days = min(180, max_days)

        return random.randint(min_days, max_days)

    def _build_decision_context(
        self,
        decision_number: int,
        total_decisions: int,
        current_date: datetime,
        timeline: CompanyTimeline,
        previous_outcomes: List[DecisionOutcome],
        timespan_days: int,
        question_type: str
    ) -> Dict[str, Any]:
        """Build context dictionary for AI decision generation"""

        # Get recent events
        recent_events = self._get_recent_events(timeline, current_date, days_back=90)

        # Get upcoming predicted events (that AI can hint at)
        future_date = current_date + timedelta(days=timespan_days)
        upcoming_events = self._get_upcoming_events(timeline, current_date, future_date)

        # Summarize previous outcomes
        recent_outcomes = previous_outcomes[-3:] if previous_outcomes else []
        outcome_summary = self._summarize_outcomes(recent_outcomes)

        # Calculate cumulative impact
        cumulative_impact = sum(o.impact_score for o in previous_outcomes) if previous_outcomes else 0

        # Determine company state
        if cumulative_impact > 2.0:
            company_state = "thriving"
        elif cumulative_impact > 0:
            company_state = "growing"
        elif cumulative_impact > -2.0:
            company_state = "stable but challenged"
        else:
            company_state = "struggling"

        context = {
            "company_name": timeline.company_name,
            "current_date": current_date.strftime("%B %d, %Y"),
            "decision_number": decision_number,
            "total_decisions": total_decisions,
            "question_type": question_type,
            "timespan_days": timespan_days,
            "company_situation": f"""
The company is currently {company_state}.

Business Metrics:
- Total Clients: {timeline.business_metrics.get('total_clients', 0)}
- Active Proposals: {timeline.business_metrics.get('active_proposals', 0)}
- Market Position: {timeline.business_metrics.get('market_position', 'Emerging')}

Cumulative Impact Score: {cumulative_impact:.2f}
""",
            "recent_events": "\n".join([
                f"- {e.title}: {e.description}"
                for e in recent_events
            ]) if recent_events else "No recent events",
            "outcome_summary": outcome_summary,
            "strategic_priorities": timeline.business_metrics.get('strategic_priorities', []),
            "market_context": self._get_market_context(current_date, timeline)
        }

        return context

    def _get_recent_events(
        self,
        timeline: CompanyTimeline,
        current_date: datetime,
        days_back: int = 90
    ) -> List[CompanyEvent]:
        """Get events from the recent past"""
        cutoff_date = current_date - timedelta(days=days_back)

        recent = [
            e for e in timeline.historical_events
            if e.date >= cutoff_date and e.date <= current_date
        ]

        return sorted(recent, key=lambda x: x.date, reverse=True)[:5]

    def _get_upcoming_events(
        self,
        timeline: CompanyTimeline,
        start_date: datetime,
        end_date: datetime
    ) -> List[CompanyEvent]:
        """Get predicted events in the upcoming period"""
        upcoming = [
            e for e in timeline.predicted_events
            if start_date < e.date <= end_date
        ]

        return sorted(upcoming, key=lambda x: x.date)

    def _summarize_outcomes(self, outcomes: List[DecisionOutcome]) -> str:
        """Summarize recent decision outcomes"""
        if not outcomes:
            return "No previous decisions yet."

        summary = "Recent decisions:\n"
        for outcome in outcomes:
            result = "optimal" if outcome.is_optimal else "suboptimal"
            summary += f"- {result} decision (impact: {outcome.impact_score:+.2f})\n"

        return summary

    def _get_market_context(self, current_date: datetime, timeline: CompanyTimeline) -> str:
        """Generate market context based on date and trends"""
        year = current_date.year
        quarter = (current_date.month - 1) // 3 + 1

        contexts = [
            f"Q{quarter} {year}: AI adoption continues to accelerate across industries.",
            f"Q{quarter} {year}: Businesses seeking AI expertise to remain competitive.",
            f"Q{quarter} {year}: Economic conditions affecting technology budgets.",
            f"Q{quarter} {year}: Emerging AI regulations creating new compliance needs.",
            f"Q{quarter} {year}: Competition in AI consulting space intensifying."
        ]

        return random.choice(contexts)

    def evaluate_decision(
        self,
        decision: Decision,
        player_answer: str,
        timeline: CompanyTimeline
    ) -> DecisionOutcome:
        """
        Evaluate a player's decision and generate outcome

        Args:
            decision: The decision that was made
            player_answer: Player's answer/choice
            timeline: Company timeline for context

        Returns:
            DecisionOutcome with narrative and impacts
        """

        # Prepare context for AI
        decision_dict = decision.to_dict()

        # Get AI analysis of outcome
        ai_response = self.ai_client.analyze_outcome(decision_dict, player_answer)

        # Create events from AI response
        events_triggered = []
        for event_data in ai_response.get('events_triggered', []):
            event_date = decision.date + timedelta(
                days=random.randint(1, decision.timespan_days)
            )

            event = CompanyEvent(
                date=event_date,
                title=event_data.get('title', 'Business Event'),
                description=event_data.get('description', ''),
                category=event_data.get('category', 'milestone'),
                impact_score=event_data.get('impact_score', 0.0),
                metadata={'triggered_by_decision': decision.id}
            )
            events_triggered.append(event)

        # Create outcome
        outcome = DecisionOutcome(
            decision_id=decision.id,
            player_answer=player_answer,
            is_optimal=ai_response.get('is_optimal', False),
            outcome_narrative=ai_response.get('outcome_narrative', ''),
            impact_score=ai_response.get('impact_score', 0.0),
            events_triggered=events_triggered,
            metrics_changed=ai_response.get('metrics_changed', {})
        )

        # Add events to timeline
        timeline.historical_events.extend(events_triggered)

        # Update business metrics
        for metric, change in outcome.metrics_changed.items():
            current = timeline.business_metrics.get(metric, 0)
            timeline.business_metrics[metric] = current + change

        return outcome
