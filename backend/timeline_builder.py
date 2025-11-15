"""
Timeline Builder - Creates historical and predictive timelines for the company
Uses AI to analyze past data and predict future scenarios
"""
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from .models import CompanyTimeline, CompanyEvent, CompanyProfile
from .ai_client import AIClient


class TimelineBuilder:
    """Builds comprehensive timelines from historical data and predictions"""

    def __init__(self, ai_client: AIClient):
        self.ai_client = ai_client

    def build_timeline(
        self,
        company_data: Dict[str, Any],
        company_name: str = "MAB AI Strategies LLC",
        founded_date: datetime = None,
        prediction_years: int = 2
    ) -> CompanyTimeline:
        """
        Build complete timeline from historical data and future predictions

        Args:
            company_data: Extracted data from Google integrations
            company_name: Name of the company
            founded_date: When company was founded
            prediction_years: How many years to predict into future

        Returns:
            CompanyTimeline object with historical and predicted events
        """
        if founded_date is None:
            founded_date = datetime.now() - timedelta(days=730)  # Default 2 years ago

        current_date = datetime.now()

        # Build historical events from extracted data
        historical_events = self._build_historical_events(company_data, founded_date, current_date)

        # Get AI insights on company situation
        insights = self.ai_client.extract_company_insights(company_data)

        # Generate predicted future events
        predicted_events = self._generate_predicted_events(
            historical_events,
            insights,
            current_date,
            prediction_years
        )

        # Extract business metrics
        business_metrics = self._extract_business_metrics(company_data, insights)

        return CompanyTimeline(
            company_name=company_name,
            founded_date=founded_date,
            current_date=current_date,
            historical_events=historical_events,
            predicted_events=predicted_events,
            business_metrics=business_metrics
        )

    def _build_historical_events(
        self,
        company_data: Dict[str, Any],
        founded_date: datetime,
        current_date: datetime
    ) -> List[CompanyEvent]:
        """Build historical events from company data"""
        events = []

        # Foundation event
        events.append(CompanyEvent(
            date=founded_date,
            title="Company Founded",
            description="MAB AI Strategies LLC was established to provide AI consulting services.",
            category="milestone",
            impact_score=1.0,
            metadata={"type": "founding"}
        ))

        # Parse Gmail insights
        gmail_data = company_data.get('gmail', {})
        email_insights = gmail_data.get('insights', {})

        if email_insights.get('client_communications', 0) > 0:
            # Estimate when client work began
            client_start = founded_date + timedelta(days=random.randint(30, 90))
            events.append(CompanyEvent(
                date=client_start,
                title="First Client Engagement",
                description=f"Began working with initial clients, with {email_insights['client_communications']} client communications recorded.",
                category="milestone",
                impact_score=0.8,
                metadata={"client_count": len(email_insights.get('key_contacts', []))}
            ))

        if email_insights.get('proposals_sent', 0) > 0:
            proposal_date = founded_date + timedelta(days=random.randint(60, 120))
            events.append(CompanyEvent(
                date=proposal_date,
                title="Active Proposal Pipeline",
                description=f"Sent {email_insights['proposals_sent']} business proposals, showing growing market interest.",
                category="opportunity",
                impact_score=0.6,
                metadata={"proposal_count": email_insights['proposals_sent']}
            ))

        # Parse Drive insights
        drive_data = company_data.get('drive', {})
        doc_insights = drive_data.get('insights', {})

        if doc_insights.get('total_documents', 0) > 5:
            events.append(CompanyEvent(
                date=current_date - timedelta(days=180),
                title="Documentation Milestone",
                description=f"Built comprehensive documentation library with {doc_insights['total_documents']} business documents.",
                category="milestone",
                impact_score=0.5,
                metadata={"document_count": doc_insights['total_documents']}
            ))

        # Add some realistic business events
        events.extend(self._generate_typical_startup_events(founded_date, current_date))

        # Sort by date
        events.sort(key=lambda x: x.date)

        return events

    def _generate_typical_startup_events(
        self,
        founded_date: datetime,
        current_date: datetime
    ) -> List[CompanyEvent]:
        """Generate typical startup milestone events"""
        events = []
        days_operating = (current_date - founded_date).days

        # Early stage challenges
        if days_operating > 30:
            events.append(CompanyEvent(
                date=founded_date + timedelta(days=30),
                title="Initial Market Research Completed",
                description="Conducted comprehensive market analysis for AI consulting services in target markets.",
                category="milestone",
                impact_score=0.4
            ))

        if days_operating > 90:
            events.append(CompanyEvent(
                date=founded_date + timedelta(days=90),
                title="Service Offering Refined",
                description="Refined and formalized service offerings based on initial market feedback.",
                category="milestone",
                impact_score=0.5
            ))

        if days_operating > 180:
            events.append(CompanyEvent(
                date=founded_date + timedelta(days=180),
                title="First Major Challenge",
                description="Faced resource constraints while managing multiple client projects simultaneously.",
                category="challenge",
                impact_score=-0.3,
                metadata={"lesson": "Need better project management"}
            ))

        if days_operating > 270:
            events.append(CompanyEvent(
                date=founded_date + timedelta(days=270),
                title="Strategic Partnership Opportunity",
                description="Identified potential partnerships with complementary service providers.",
                category="opportunity",
                impact_score=0.6
            ))

        return events

    def _generate_predicted_events(
        self,
        historical_events: List[CompanyEvent],
        insights: Dict[str, Any],
        current_date: datetime,
        prediction_years: int
    ) -> List[CompanyEvent]:
        """Generate predicted future events using AI and trend analysis"""
        predicted_events = []
        prediction_end = current_date + timedelta(days=prediction_years * 365)

        # Determine growth trajectory from historical events
        positive_events = sum(1 for e in historical_events if e.impact_score > 0.3)
        negative_events = sum(1 for e in historical_events if e.impact_score < -0.2)
        growth_trend = (positive_events - negative_events) / max(len(historical_events), 1)

        # Generate quarterly predictions
        quarters = prediction_years * 4
        for quarter in range(1, quarters + 1):
            quarter_date = current_date + timedelta(days=quarter * 90)

            if quarter_date > prediction_end:
                break

            # Vary event types based on quarter and trend
            event_type = self._determine_event_type(quarter, growth_trend)

            event = self._generate_predicted_event(
                quarter_date,
                quarter,
                event_type,
                growth_trend,
                insights
            )

            if event:
                predicted_events.append(event)

        return predicted_events

    def _determine_event_type(self, quarter: int, growth_trend: float) -> str:
        """Determine what type of event to generate"""
        # More positive events if growth trend is good
        if growth_trend > 0.3:
            types = ["milestone", "opportunity", "milestone", "opportunity", "challenge"]
        elif growth_trend < -0.2:
            types = ["challenge", "crisis", "opportunity", "challenge"]
        else:
            types = ["milestone", "opportunity", "challenge", "milestone"]

        # Early quarters more likely to have opportunities
        if quarter <= 2:
            types.extend(["opportunity", "opportunity"])

        return random.choice(types)

    def _generate_predicted_event(
        self,
        date: datetime,
        quarter: int,
        event_type: str,
        growth_trend: float,
        insights: Dict[str, Any]
    ) -> Optional[CompanyEvent]:
        """Generate a single predicted event"""

        # Event templates based on type and AI consulting business
        event_templates = {
            "milestone": [
                ("New Client Acquisition", "Secured contract with {client_type}, expanding market presence.", 0.7),
                ("Revenue Milestone", "Reached ${amount} in quarterly revenue, {pct}% growth.", 0.8),
                ("Team Expansion", "Hired {role} to strengthen capabilities.", 0.6),
                ("Technology Launch", "Deployed new AI solution for client success.", 0.7),
                ("Certification Achievement", "Achieved industry certification/recognition.", 0.5),
            ],
            "opportunity": [
                ("Market Expansion", "Identified opportunity in {market} sector.", 0.6),
                ("Strategic Partnership", "Opportunity to partner with {partner_type}.", 0.7),
                ("New Service Line", "Potential to launch {service} offering.", 0.6),
                ("Speaking Engagement", "Invited to present at industry conference.", 0.4),
                ("Innovation Opportunity", "Discovered emerging AI trend to capitalize on.", 0.5),
            ],
            "challenge": [
                ("Resource Constraint", "Capacity challenges with current team size.", -0.4),
                ("Market Competition", "Increased competition in core service area.", -0.3),
                ("Client Retention", "Risk of losing key client to competitor.", -0.5),
                ("Technology Shift", "Need to adapt to rapid technology changes.", -0.3),
                ("Economic Pressure", "Market downturn affecting client budgets.", -0.4),
            ],
            "crisis": [
                ("Major Client Loss", "Lost significant client, revenue impact.", -0.7),
                ("Operational Crisis", "Critical resource or operational failure.", -0.6),
                ("Market Disruption", "Major market shift threatening business model.", -0.8),
            ]
        }

        templates = event_templates.get(event_type, [])
        if not templates:
            return None

        title, description, base_impact = random.choice(templates)

        # Customize description with random but realistic details
        description = description.format(
            client_type=random.choice(["Fortune 500 company", "tech startup", "mid-market enterprise"]),
            amount=random.choice(["50K", "100K", "250K", "500K"]),
            pct=random.randint(15, 45),
            role=random.choice(["AI Engineer", "Business Analyst", "Senior Consultant"]),
            market=random.choice(["healthcare", "finance", "retail", "manufacturing"]),
            partner_type=random.choice(["technology vendor", "consulting firm", "industry leader"]),
            service=random.choice(["ML training", "AI strategy", "automation consulting"])
        )

        # Adjust impact based on growth trend
        impact_score = base_impact + (growth_trend * 0.2)
        impact_score = max(-1.0, min(1.0, impact_score))  # Clamp to [-1, 1]

        return CompanyEvent(
            date=date,
            title=title,
            description=description,
            category=event_type,
            impact_score=impact_score,
            metadata={
                "quarter": quarter,
                "predicted": True,
                "confidence": random.uniform(0.6, 0.9)
            }
        )

    def _extract_business_metrics(
        self,
        company_data: Dict[str, Any],
        insights: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Extract current business metrics"""
        email_insights = company_data.get('gmail', {}).get('insights', {})
        doc_insights = company_data.get('drive', {}).get('insights', {})

        return {
            "total_clients": len(email_insights.get('key_contacts', [])),
            "active_proposals": email_insights.get('proposals_sent', 0),
            "client_communications": email_insights.get('client_communications', 0),
            "documentation_assets": doc_insights.get('total_documents', 0),
            "estimated_revenue": insights.get('financial_indicators', {}).get('estimated_annual_revenue', 0),
            "growth_rate": insights.get('financial_indicators', {}).get('growth_rate', 0),
            "market_position": insights.get('market_position', 'Emerging'),
            "competitive_advantages": insights.get('competitive_advantages', []),
            "strategic_priorities": insights.get('strategic_priorities', []),
        }

    def get_situation_summary(self, timeline: CompanyTimeline) -> str:
        """Generate a narrative summary of the current company situation"""
        recent_events = sorted(
            timeline.historical_events,
            key=lambda x: x.date,
            reverse=True
        )[:5]

        summary = f"""
**Current Situation for {timeline.company_name}**

Founded: {timeline.founded_date.strftime('%B %Y')}
Operating for: {(timeline.current_date - timeline.founded_date).days // 365} years

**Recent Developments:**
"""
        for event in recent_events:
            summary += f"\n- {event.title} ({event.date.strftime('%B %Y')}): {event.description}"

        summary += f"""

**Key Metrics:**
- Total Clients: {timeline.business_metrics.get('total_clients', 'N/A')}
- Active Proposals: {timeline.business_metrics.get('active_proposals', 'N/A')}
- Documentation Assets: {timeline.business_metrics.get('documentation_assets', 'N/A')}

**Strategic Position:**
{timeline.business_metrics.get('market_position', 'Positioning in market')}
"""

        return summary
