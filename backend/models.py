"""
Data models for the Entrepreneur Game
"""
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import List, Dict, Any, Optional
import json
import random


class DifficultyLevel(Enum):
    """Game difficulty levels"""
    EASY = ("Easy", 1, 8)  # (name, years, decisions)
    MEDIUM = ("Medium", 2, 14)
    HARD = ("Hard", 3, 20)
    EXPERT = ("Expert Entrepreneur", 5, 24)

    @property
    def display_name(self):
        return self.value[0]

    @property
    def years(self):
        return self.value[1]

    @property
    def decision_count(self):
        return self.value[2]

    @property
    def days_total(self):
        return self.years * 365


class QuestionType(Enum):
    """Types of decision questions"""
    TRUE_FALSE = "true_false"
    MULTIPLE_CHOICE = "multiple_choice"
    FILL_IN_BLANK = "fill_in_blank"
    WRITTEN_RESPONSE = "written_response"

    @classmethod
    def get_random(cls):
        """Get random question type with weighted probability"""
        weights = [0.25, 0.35, 0.20, 0.20]  # Favor MC, less written
        return random.choices(list(cls), weights=weights)[0]


@dataclass
class CompanyEvent:
    """A historical or predicted company event"""
    date: datetime
    title: str
    description: str
    category: str  # e.g., "milestone", "challenge", "opportunity", "crisis"
    impact_score: float  # -1.0 to 1.0
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self):
        return {
            "date": self.date.isoformat(),
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "impact_score": self.impact_score,
            "metadata": self.metadata
        }

    @classmethod
    def from_dict(cls, data):
        data['date'] = datetime.fromisoformat(data['date'])
        return cls(**data)


@dataclass
class CompanyTimeline:
    """Complete timeline of company past, present, and predicted future"""
    company_name: str
    founded_date: datetime
    current_date: datetime
    historical_events: List[CompanyEvent] = field(default_factory=list)
    predicted_events: List[CompanyEvent] = field(default_factory=list)
    business_metrics: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self):
        return {
            "company_name": self.company_name,
            "founded_date": self.founded_date.isoformat(),
            "current_date": self.current_date.isoformat(),
            "historical_events": [e.to_dict() for e in self.historical_events],
            "predicted_events": [e.to_dict() for e in self.predicted_events],
            "business_metrics": self.business_metrics
        }

    @classmethod
    def from_dict(cls, data):
        data['founded_date'] = datetime.fromisoformat(data['founded_date'])
        data['current_date'] = datetime.fromisoformat(data['current_date'])
        data['historical_events'] = [CompanyEvent.from_dict(e) for e in data['historical_events']]
        data['predicted_events'] = [CompanyEvent.from_dict(e) for e in data['predicted_events']]
        return cls(**data)


@dataclass
class Decision:
    """A business decision point in the game"""
    id: str
    decision_number: int
    date: datetime
    context: str
    question: str
    question_type: QuestionType
    options: Optional[List[str]] = None  # For MC/TF
    correct_answer: Optional[str] = None  # For validation
    timespan_days: int = 0  # How many days this decision spans
    difficulty_factors: Dict[str, float] = field(default_factory=dict)

    def to_dict(self):
        return {
            "id": self.id,
            "decision_number": self.decision_number,
            "date": self.date.isoformat(),
            "context": self.context,
            "question": self.question,
            "question_type": self.question_type.value,
            "options": self.options,
            "correct_answer": self.correct_answer,
            "timespan_days": self.timespan_days,
            "difficulty_factors": self.difficulty_factors
        }

    @classmethod
    def from_dict(cls, data):
        data['date'] = datetime.fromisoformat(data['date'])
        data['question_type'] = QuestionType(data['question_type'])
        return cls(**data)


@dataclass
class DecisionOutcome:
    """The result of a player's decision"""
    decision_id: str
    player_answer: str
    is_optimal: bool
    outcome_narrative: str
    impact_score: float  # -1.0 to 1.0
    events_triggered: List[CompanyEvent] = field(default_factory=list)
    metrics_changed: Dict[str, float] = field(default_factory=dict)

    def to_dict(self):
        return {
            "decision_id": self.decision_id,
            "player_answer": self.player_answer,
            "is_optimal": self.is_optimal,
            "outcome_narrative": self.outcome_narrative,
            "impact_score": self.impact_score,
            "events_triggered": [e.to_dict() for e in self.events_triggered],
            "metrics_changed": self.metrics_changed
        }


@dataclass
class GameState:
    """Current state of an active game session"""
    session_id: str
    player_name: str
    difficulty: DifficultyLevel
    company_timeline: CompanyTimeline
    current_decision_number: int = 0
    decisions_made: List[Decision] = field(default_factory=list)
    outcomes: List[DecisionOutcome] = field(default_factory=list)
    current_date: datetime = field(default_factory=datetime.now)
    cumulative_impact: float = 0.0
    game_metrics: Dict[str, Any] = field(default_factory=dict)
    started_at: datetime = field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None

    def to_dict(self):
        return {
            "session_id": self.session_id,
            "player_name": self.player_name,
            "difficulty": self.difficulty.name,
            "company_timeline": self.company_timeline.to_dict(),
            "current_decision_number": self.current_decision_number,
            "decisions_made": [d.to_dict() for d in self.decisions_made],
            "outcomes": [o.to_dict() for o in self.outcomes],
            "current_date": self.current_date.isoformat(),
            "cumulative_impact": self.cumulative_impact,
            "game_metrics": self.game_metrics,
            "started_at": self.started_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }

    def save_to_file(self, filepath: str):
        """Save game state to JSON file"""
        with open(filepath, 'w') as f:
            json.dump(self.to_dict(), f, indent=2)

    @classmethod
    def load_from_file(cls, filepath: str):
        """Load game state from JSON file"""
        with open(filepath, 'r') as f:
            data = json.load(f)

        data['difficulty'] = DifficultyLevel[data['difficulty']]
        data['company_timeline'] = CompanyTimeline.from_dict(data['company_timeline'])
        data['decisions_made'] = [Decision.from_dict(d) for d in data['decisions_made']]
        data['current_date'] = datetime.fromisoformat(data['current_date'])
        data['started_at'] = datetime.fromisoformat(data['started_at'])
        if data['completed_at']:
            data['completed_at'] = datetime.fromisoformat(data['completed_at'])

        # Outcomes need special handling
        outcomes = []
        for o in data['outcomes']:
            o['events_triggered'] = [CompanyEvent.from_dict(e) for e in o['events_triggered']]
            outcomes.append(DecisionOutcome(**o))
        data['outcomes'] = outcomes

        return cls(**data)


@dataclass
class CompanyProfile:
    """Profile of the company extracted from Google integrations"""
    name: str
    founded_date: datetime
    industry: str
    services: List[str]
    key_clients: List[str] = field(default_factory=list)
    team_size: int = 1
    revenue_data: Dict[str, float] = field(default_factory=dict)
    locations: List[str] = field(default_factory=list)
    strategic_goals: List[str] = field(default_factory=list)
    challenges: List[str] = field(default_factory=list)
    recent_activities: List[Dict[str, Any]] = field(default_factory=list)

    def to_dict(self):
        return {
            "name": self.name,
            "founded_date": self.founded_date.isoformat(),
            "industry": self.industry,
            "services": self.services,
            "key_clients": self.key_clients,
            "team_size": self.team_size,
            "revenue_data": self.revenue_data,
            "locations": self.locations,
            "strategic_goals": self.strategic_goals,
            "challenges": self.challenges,
            "recent_activities": self.recent_activities
        }
