"""
Game Engine - Core gameplay logic and state management
"""
import os
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from .models import (
    GameState, DifficultyLevel, CompanyTimeline,
    Decision, DecisionOutcome, CompanyProfile
)
from .timeline_builder import TimelineBuilder
from .decision_generator import DecisionGenerator
from .google_integrations import extract_all_company_data
from .ai_client import get_ai_client


class GameEngine:
    """Main game engine orchestrating all game logic"""

    def __init__(self):
        self.ai_client = get_ai_client()
        self.timeline_builder = TimelineBuilder(self.ai_client)
        self.decision_generator = DecisionGenerator(self.ai_client)
        self.current_game: Optional[GameState] = None

    def initialize_game(
        self,
        player_name: str,
        difficulty: DifficultyLevel,
        use_google_data: bool = True,
        company_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Initialize a new game session

        Args:
            player_name: Name of the player
            difficulty: Game difficulty level
            use_google_data: Whether to extract data from Google services
            company_data: Pre-extracted company data (optional)

        Returns:
            Dictionary with game initialization status and info
        """
        print(f"Initializing new game for {player_name} at {difficulty.display_name} difficulty...")

        # Extract company data if needed
        if use_google_data and company_data is None:
            print("Extracting company data from Google services...")
            try:
                company_data = extract_all_company_data()
            except Exception as e:
                print(f"Error extracting Google data: {e}")
                print("Proceeding with sample data...")
                company_data = self._get_sample_company_data()
        elif company_data is None:
            company_data = self._get_sample_company_data()

        # Build company timeline
        print("Building company timeline...")
        company_name = os.getenv('COMPANY_NAME', 'MAB AI Strategies LLC')
        founded_date_str = os.getenv('COMPANY_FOUNDED_DATE', '2023-01-01')
        founded_date = datetime.fromisoformat(founded_date_str)

        timeline = self.timeline_builder.build_timeline(
            company_data=company_data,
            company_name=company_name,
            founded_date=founded_date,
            prediction_years=difficulty.years
        )

        # Create game state
        session_id = str(uuid.uuid4())
        self.current_game = GameState(
            session_id=session_id,
            player_name=player_name,
            difficulty=difficulty,
            company_timeline=timeline,
            current_date=datetime.now(),
            game_metrics={
                "total_decisions": difficulty.decision_count,
                "days_total": difficulty.days_total,
                "days_elapsed": 0,
                "days_remaining": difficulty.days_total
            }
        )

        # Save game state
        self._save_game_state()

        print(f"Game initialized! Session ID: {session_id}")

        return {
            "success": True,
            "session_id": session_id,
            "difficulty": difficulty.display_name,
            "total_decisions": difficulty.decision_count,
            "timeframe_years": difficulty.years,
            "company_name": company_name,
            "situation_summary": self.timeline_builder.get_situation_summary(timeline)
        }

    def get_next_decision(self) -> Dict[str, Any]:
        """
        Get the next decision for the player

        Returns:
            Dictionary with decision information
        """
        if not self.current_game:
            return {"error": "No active game session"}

        game = self.current_game
        decision_number = game.current_decision_number + 1

        if decision_number > game.game_metrics['total_decisions']:
            return {"error": "Game completed", "final_results": self.get_final_results()}

        print(f"Generating decision {decision_number}/{game.game_metrics['total_decisions']}...")

        # Calculate remaining days
        days_elapsed = game.game_metrics.get('days_elapsed', 0)
        days_remaining = game.game_metrics['days_total'] - days_elapsed

        # Generate decision
        decision = self.decision_generator.generate_decision(
            decision_number=decision_number,
            total_decisions=game.game_metrics['total_decisions'],
            current_date=game.current_date,
            timeline=game.company_timeline,
            previous_outcomes=game.outcomes,
            remaining_days=days_remaining,
            difficulty=game.difficulty
        )

        # Store decision
        game.decisions_made.append(decision)
        game.current_decision_number = decision_number

        # Update game state
        self._save_game_state()

        return {
            "success": True,
            "decision_number": decision_number,
            "total_decisions": game.game_metrics['total_decisions'],
            "current_date": game.current_date.strftime("%B %d, %Y"),
            "timespan_days": decision.timespan_days,
            "context": decision.context,
            "question": decision.question,
            "question_type": decision.question_type.value,
            "options": decision.options,
            "difficulty_factors": decision.difficulty_factors
        }

    def submit_decision(self, player_answer: str) -> Dict[str, Any]:
        """
        Submit a decision answer and get the outcome

        Args:
            player_answer: The player's answer/choice

        Returns:
            Dictionary with outcome information
        """
        if not self.current_game:
            return {"error": "No active game session"}

        game = self.current_game

        if not game.decisions_made:
            return {"error": "No decision to answer"}

        current_decision = game.decisions_made[-1]

        print(f"Evaluating decision {game.current_decision_number}...")

        # Evaluate the decision
        outcome = self.decision_generator.evaluate_decision(
            decision=current_decision,
            player_answer=player_answer,
            timeline=game.company_timeline
        )

        # Store outcome
        game.outcomes.append(outcome)
        game.cumulative_impact += outcome.impact_score

        # Advance time
        game.current_date += timedelta(days=current_decision.timespan_days)
        game.game_metrics['days_elapsed'] += current_decision.timespan_days
        game.game_metrics['days_remaining'] = (
            game.game_metrics['days_total'] - game.game_metrics['days_elapsed']
        )

        # Save state
        self._save_game_state()

        # Check if game is complete
        is_complete = game.current_decision_number >= game.game_metrics['total_decisions']
        if is_complete:
            game.completed_at = datetime.now()
            self._save_game_state()

        return {
            "success": True,
            "is_optimal": outcome.is_optimal,
            "outcome_narrative": outcome.outcome_narrative,
            "impact_score": outcome.impact_score,
            "cumulative_impact": game.cumulative_impact,
            "events_triggered": [e.to_dict() for e in outcome.events_triggered],
            "metrics_changed": outcome.metrics_changed,
            "new_date": game.current_date.strftime("%B %d, %Y"),
            "days_elapsed": game.game_metrics['days_elapsed'],
            "days_remaining": game.game_metrics['days_remaining'],
            "is_complete": is_complete,
            "progress_percentage": (game.current_decision_number / game.game_metrics['total_decisions']) * 100
        }

    def get_final_results(self) -> Dict[str, Any]:
        """
        Get final game results and analysis

        Returns:
            Dictionary with comprehensive game results
        """
        if not self.current_game:
            return {"error": "No active game session"}

        game = self.current_game

        # Calculate performance metrics
        optimal_decisions = sum(1 for o in game.outcomes if o.is_optimal)
        optimal_rate = optimal_decisions / len(game.outcomes) if game.outcomes else 0

        total_impact = game.cumulative_impact
        avg_impact = total_impact / len(game.outcomes) if game.outcomes else 0

        # Determine final grade
        if optimal_rate >= 0.8 and total_impact > 5:
            grade = "A - Exceptional Leadership"
        elif optimal_rate >= 0.6 and total_impact > 2:
            grade = "B - Strong Performance"
        elif optimal_rate >= 0.4 and total_impact > -1:
            grade = "C - Adequate Management"
        elif optimal_rate >= 0.2:
            grade = "D - Needs Improvement"
        else:
            grade = "F - Critical Challenges"

        # Generate narrative summary
        narrative = self._generate_final_narrative(game, grade)

        return {
            "session_id": game.session_id,
            "player_name": game.player_name,
            "difficulty": game.difficulty.display_name,
            "total_decisions": game.current_decision_number,
            "optimal_decisions": optimal_decisions,
            "optimal_rate": f"{optimal_rate * 100:.1f}%",
            "cumulative_impact": total_impact,
            "average_impact": avg_impact,
            "final_grade": grade,
            "final_date": game.current_date.strftime("%B %d, %Y"),
            "time_progressed": f"{game.game_metrics['days_elapsed']} days ({game.difficulty.years} years)",
            "final_metrics": game.company_timeline.business_metrics,
            "narrative_summary": narrative,
            "completed_at": game.completed_at.isoformat() if game.completed_at else None
        }

    def _generate_final_narrative(self, game: GameState, grade: str) -> str:
        """Generate final narrative summary"""
        narrative = f"""
**Game Complete: {game.company_timeline.company_name}**

Over the past {game.difficulty.years} years, you navigated {game.current_decision_number} critical business decisions.

**Your Leadership Journey:**
"""

        # Highlight key moments
        best_decision = max(game.outcomes, key=lambda o: o.impact_score) if game.outcomes else None
        worst_decision = min(game.outcomes, key=lambda o: o.impact_score) if game.outcomes else None

        if best_decision and best_decision.impact_score > 0.5:
            narrative += f"\n🌟 **Best Decision:** Impact score of {best_decision.impact_score:.2f} - This strategic choice significantly advanced the company."

        if worst_decision and worst_decision.impact_score < -0.3:
            narrative += f"\n⚠️ **Challenging Moment:** Impact score of {worst_decision.impact_score:.2f} - This decision presented difficulties that required recovery."

        narrative += f"\n\n**Final Assessment:** {grade}"

        if game.cumulative_impact > 5:
            narrative += "\n\nUnder your leadership, MAB AI Strategies LLC has flourished, establishing itself as a leader in the AI consulting space."
        elif game.cumulative_impact > 0:
            narrative += "\n\nYou've successfully grown MAB AI Strategies LLC, building a foundation for future success."
        else:
            narrative += "\n\nThe journey has been challenging. Valuable lessons learned will inform future strategic decisions."

        return narrative

    def _save_game_state(self):
        """Save current game state to file"""
        if not self.current_game:
            return

        os.makedirs('game_sessions', exist_ok=True)
        filepath = f"game_sessions/{self.current_game.session_id}.json"
        self.current_game.save_to_file(filepath)

    def load_game(self, session_id: str) -> bool:
        """Load a saved game session"""
        from .models import GameState

        filepath = f"game_sessions/{session_id}.json"
        if not os.path.exists(filepath):
            return False

        try:
            self.current_game = GameState.load_from_file(filepath)
            return True
        except Exception as e:
            print(f"Error loading game: {e}")
            return False

    def _get_sample_company_data(self) -> Dict[str, Any]:
        """Get sample company data when Google integration is not available"""
        return {
            "extraction_date": datetime.now().isoformat(),
            "gmail": {
                "emails": [],
                "insights": {
                    "total_emails": 0,
                    "client_communications": 5,
                    "proposals_sent": 3,
                    "contracts_signed": 2,
                    "meetings_scheduled": 8,
                    "key_contacts": ["client1.com", "client2.com", "partner.com"]
                }
            },
            "drive": {
                "documents": [],
                "insights": {
                    "total_documents": 15,
                    "document_types": {"pdf": 5, "document": 10},
                    "recent_activity": []
                }
            },
            "sheets": {
                "spreadsheets": [],
                "financial_data": {}
            }
        }

    def get_game_status(self) -> Dict[str, Any]:
        """Get current game status"""
        if not self.current_game:
            return {"active": False}

        game = self.current_game
        return {
            "active": True,
            "session_id": game.session_id,
            "player_name": game.player_name,
            "difficulty": game.difficulty.display_name,
            "current_decision": game.current_decision_number,
            "total_decisions": game.game_metrics['total_decisions'],
            "cumulative_impact": game.cumulative_impact,
            "current_date": game.current_date.strftime("%B %d, %Y"),
            "progress_percentage": (game.current_decision_number / game.game_metrics['total_decisions']) * 100
        }
