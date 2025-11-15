"""
AI Client for generating decisions and analyzing outcomes
Supports multiple AI providers: Anthropic Claude, Google Gemini, OpenAI GPT
"""
import os
from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod
import json


class AIClient(ABC):
    """Abstract base class for AI providers"""

    @abstractmethod
    def generate_decision(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a business decision based on context"""
        pass

    @abstractmethod
    def analyze_outcome(self, decision: Dict[str, Any], player_answer: str) -> Dict[str, Any]:
        """Analyze the outcome of a player's decision"""
        pass

    @abstractmethod
    def extract_company_insights(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract insights from company data"""
        pass


class AnthropicClient(AIClient):
    """Anthropic Claude API client"""

    def __init__(self, api_key: str):
        try:
            from anthropic import Anthropic
            self.client = Anthropic(api_key=api_key)
            self.model = "claude-sonnet-4-20250514"
        except ImportError:
            raise ImportError("anthropic package not installed. Run: pip install anthropic")

    def _create_message(self, system_prompt: str, user_prompt: str, max_tokens: int = 4000) -> str:
        """Create a message and return the response"""
        message = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}]
        )
        return message.content[0].text

    def generate_decision(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a business decision based on context"""
        system_prompt = """You are an expert business consultant for MAB AI Strategies LLC.
Generate realistic, challenging business decisions that will test strategic thinking.
Always return valid JSON with the exact structure requested."""

        user_prompt = f"""Based on the following context, generate a strategic business decision:

Company: {context.get('company_name', 'MAB AI Strategies LLC')}
Current Date: {context.get('current_date')}
Decision Number: {context.get('decision_number')} of {context.get('total_decisions')}
Question Type: {context.get('question_type')}
Time Span: This decision will span approximately {context.get('timespan_days')} days

Company Situation:
{context.get('company_situation', '')}

Recent Events:
{context.get('recent_events', '')}

Generate a business decision in this EXACT JSON format:
{{
    "context": "Brief situation description (2-3 sentences)",
    "question": "The decision question to ask",
    "question_type": "{context.get('question_type')}",
    "options": ["option1", "option2", "option3", "option4"],  // For multiple_choice or ["True", "False"] for true_false, or null for others
    "optimal_answer": "The best answer or index",
    "difficulty_factors": {{
        "market_volatility": 0.5,
        "financial_risk": 0.3,
        "strategic_importance": 0.8
    }}
}}

Make it realistic and relevant to an AI consulting business."""

        response = self._create_message(system_prompt, user_prompt)

        # Parse JSON from response
        try:
            # Extract JSON from markdown code blocks if present
            if "```json" in response:
                json_str = response.split("```json")[1].split("```")[0].strip()
            elif "```" in response:
                json_str = response.split("```")[1].split("```")[0].strip()
            else:
                json_str = response.strip()

            return json.loads(json_str)
        except json.JSONDecodeError:
            # Fallback if parsing fails
            return {
                "context": "Strategic decision needed",
                "question": response[:200],
                "question_type": context.get('question_type'),
                "options": None,
                "optimal_answer": None,
                "difficulty_factors": {}
            }

    def analyze_outcome(self, decision: Dict[str, Any], player_answer: str) -> Dict[str, Any]:
        """Analyze the outcome of a player's decision"""
        system_prompt = """You are an expert business analyst. Analyze business decisions and their outcomes.
Provide realistic, nuanced analysis that considers both positive and negative consequences.
Always return valid JSON."""

        user_prompt = f"""Analyze this business decision and outcome:

Decision Context: {decision.get('context')}
Question: {decision.get('question')}
Player's Answer: {player_answer}
Optimal Answer: {decision.get('optimal_answer', 'N/A')}
Time Span: {decision.get('timespan_days')} days

Generate an outcome analysis in this EXACT JSON format:
{{
    "is_optimal": true/false,
    "outcome_narrative": "Engaging 2-4 paragraph narrative describing what happened over the time period as a result of this decision. Be specific and realistic.",
    "impact_score": 0.5,  // Float between -1.0 (very negative) and 1.0 (very positive)
    "events_triggered": [
        {{
            "title": "Event title",
            "description": "What happened",
            "category": "milestone/challenge/opportunity/crisis",
            "impact_score": 0.3
        }}
    ],
    "metrics_changed": {{
        "revenue": 5000,
        "client_satisfaction": 10,
        "team_morale": -5,
        "market_position": 8
    }}
}}

Make the narrative compelling and realistic for an AI consulting business."""

        response = self._create_message(system_prompt, user_prompt)

        try:
            if "```json" in response:
                json_str = response.split("```json")[1].split("```")[0].strip()
            elif "```" in response:
                json_str = response.split("```")[1].split("```")[0].strip()
            else:
                json_str = response.strip()

            return json.loads(json_str)
        except json.JSONDecodeError:
            return {
                "is_optimal": False,
                "outcome_narrative": response,
                "impact_score": 0.0,
                "events_triggered": [],
                "metrics_changed": {}
            }

    def extract_company_insights(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract insights from company data"""
        system_prompt = """You are an expert business analyst. Extract key insights from company data
including emails, documents, and other information. Always return valid JSON."""

        user_prompt = f"""Analyze this company data and extract key insights:

{json.dumps(data, indent=2)}

Return insights in this EXACT JSON format:
{{
    "key_milestones": ["milestone1", "milestone2"],
    "current_challenges": ["challenge1", "challenge2"],
    "opportunities": ["opportunity1", "opportunity2"],
    "strategic_priorities": ["priority1", "priority2"],
    "financial_indicators": {{
        "estimated_annual_revenue": 100000,
        "growth_rate": 0.15
    }},
    "market_position": "Description of market position",
    "competitive_advantages": ["advantage1", "advantage2"]
}}"""

        response = self._create_message(system_prompt, user_prompt, max_tokens=2000)

        try:
            if "```json" in response:
                json_str = response.split("```json")[1].split("```")[0].strip()
            elif "```" in response:
                json_str = response.split("```")[1].split("```")[0].strip()
            else:
                json_str = response.strip()

            return json.loads(json_str)
        except json.JSONDecodeError:
            return {
                "key_milestones": [],
                "current_challenges": [],
                "opportunities": [],
                "strategic_priorities": [],
                "financial_indicators": {},
                "market_position": "",
                "competitive_advantages": []
            }


class GoogleAIClient(AIClient):
    """Google Gemini API client"""

    def __init__(self, api_key: str):
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        except ImportError:
            raise ImportError("google-generativeai package not installed")

    def generate_decision(self, context: Dict[str, Any]) -> Dict[str, Any]:
        # Similar implementation as Anthropic
        prompt = f"""Generate a business decision in JSON format..."""
        response = self.model.generate_content(prompt)
        # Parse and return
        return json.loads(response.text)

    def analyze_outcome(self, decision: Dict[str, Any], player_answer: str) -> Dict[str, Any]:
        # Similar to Anthropic
        pass

    def extract_company_insights(self, data: Dict[str, Any]) -> Dict[str, Any]:
        # Similar to Anthropic
        pass


class OpenAIClient(AIClient):
    """OpenAI GPT API client"""

    def __init__(self, api_key: str):
        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=api_key)
            self.model = "gpt-4-turbo-preview"
        except ImportError:
            raise ImportError("openai package not installed")

    def generate_decision(self, context: Dict[str, Any]) -> Dict[str, Any]:
        # Similar implementation as Anthropic
        pass

    def analyze_outcome(self, decision: Dict[str, Any], player_answer: str) -> Dict[str, Any]:
        # Similar to Anthropic
        pass

    def extract_company_insights(self, data: Dict[str, Any]) -> Dict[str, Any]:
        # Similar to Anthropic
        pass


def get_ai_client(provider: str = None) -> AIClient:
    """Factory function to get the appropriate AI client"""
    if provider is None:
        provider = os.getenv('AI_PROVIDER', 'ANTHROPIC')

    provider = provider.upper()

    if provider == 'ANTHROPIC':
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment")
        return AnthropicClient(api_key)

    elif provider == 'GOOGLE':
        api_key = os.getenv('GOOGLE_AI_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_AI_API_KEY not found in environment")
        return GoogleAIClient(api_key)

    elif provider == 'OPENAI':
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment")
        return OpenAIClient(api_key)

    else:
        raise ValueError(f"Unknown AI provider: {provider}")
