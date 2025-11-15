# API Reference

## Entrepreneur Game Backend API

Base URL: `http://localhost:5000/api`

---

## Endpoints

### Health Check

**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "Entrepreneur Game API",
  "version": "1.0.0"
}
```

---

### Get Difficulty Levels

**GET** `/api/difficulties`

Get all available difficulty levels.

**Response:**
```json
{
  "success": true,
  "difficulties": [
    {
      "id": "EASY",
      "name": "Easy",
      "years": 1,
      "decisions": 8,
      "description": "1 year - 8 decisions"
    },
    ...
  ]
}
```

---

### Initialize Game

**POST** `/api/game/initialize`

Start a new game session.

**Request Body:**
```json
{
  "player_name": "John Doe",
  "difficulty": "MEDIUM",
  "use_google_data": false
}
```

**Parameters:**
- `player_name` (string): Player's name
- `difficulty` (string): One of: EASY, MEDIUM, HARD, EXPERT
- `use_google_data` (boolean): Whether to extract data from Google services

**Response:**
```json
{
  "success": true,
  "session_id": "uuid-string",
  "difficulty": "Medium",
  "total_decisions": 14,
  "timeframe_years": 2,
  "company_name": "MAB AI Strategies LLC",
  "situation_summary": "Current situation narrative..."
}
```

---

### Get Next Decision

**GET** `/api/game/decision/next`

Get the next business decision for the player.

**Response:**
```json
{
  "success": true,
  "decision_number": 1,
  "total_decisions": 14,
  "current_date": "November 15, 2025",
  "timespan_days": 45,
  "context": "Situation description...",
  "question": "What should you do?",
  "question_type": "multiple_choice",
  "options": ["Option A", "Option B", "Option C"],
  "difficulty_factors": {
    "market_volatility": 0.5,
    "financial_risk": 0.3
  }
}
```

**Question Types:**
- `true_false`: Binary choice
- `multiple_choice`: Select from options
- `fill_in_blank`: Short text answer
- `written_response`: Detailed text response

---

### Submit Decision

**POST** `/api/game/decision/submit`

Submit an answer to the current decision.

**Request Body:**
```json
{
  "answer": "Option A"
}
```

**Response:**
```json
{
  "success": true,
  "is_optimal": true,
  "outcome_narrative": "Your decision led to...",
  "impact_score": 0.75,
  "cumulative_impact": 2.3,
  "events_triggered": [
    {
      "title": "New Client Acquired",
      "description": "Signed contract with...",
      "category": "milestone",
      "impact_score": 0.5
    }
  ],
  "metrics_changed": {
    "revenue": 50000,
    "client_satisfaction": 10
  },
  "new_date": "December 30, 2025",
  "days_elapsed": 90,
  "days_remaining": 640,
  "is_complete": false,
  "progress_percentage": 7.14
}
```

---

### Get Game Results

**GET** `/api/game/results`

Get final results after game completion.

**Response:**
```json
{
  "session_id": "uuid",
  "player_name": "John Doe",
  "difficulty": "Medium",
  "total_decisions": 14,
  "optimal_decisions": 10,
  "optimal_rate": "71.4%",
  "cumulative_impact": 8.5,
  "average_impact": 0.61,
  "final_grade": "B - Strong Performance",
  "final_date": "November 15, 2027",
  "time_progressed": "730 days (2 years)",
  "final_metrics": {
    "total_clients": 15,
    "revenue": 500000
  },
  "narrative_summary": "Final narrative...",
  "completed_at": "2025-11-15T12:00:00"
}
```

---

### Get Game Status

**GET** `/api/game/status`

Get current game session status.

**Response:**
```json
{
  "active": true,
  "session_id": "uuid",
  "player_name": "John Doe",
  "difficulty": "Medium",
  "current_decision": 5,
  "total_decisions": 14,
  "cumulative_impact": 2.3,
  "current_date": "March 15, 2026",
  "progress_percentage": 35.7
}
```

---

### Load Game

**GET** `/api/game/load/<session_id>`

Load a previously saved game session.

**Parameters:**
- `session_id` (path): UUID of the session to load

**Response:**
```json
{
  "success": true,
  "message": "Game loaded successfully"
}
```

---

## Error Responses

All endpoints may return error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common Error Codes:**
- `400`: Bad request (missing parameters, invalid data)
- `404`: Resource not found (invalid session ID)
- `500`: Server error (API failures, processing errors)

---

## Game Flow

1. **Initialize** → `POST /api/game/initialize`
2. **Get Decision** → `GET /api/game/decision/next`
3. **Submit Answer** → `POST /api/game/decision/submit`
4. **Repeat steps 2-3** until all decisions complete
5. **Get Results** → `GET /api/game/results`

---

## Data Models

### Decision Object
```typescript
{
  id: string;
  decision_number: number;
  date: string;  // ISO format
  context: string;
  question: string;
  question_type: "true_false" | "multiple_choice" | "fill_in_blank" | "written_response";
  options?: string[];
  timespan_days: number;
  difficulty_factors: object;
}
```

### Outcome Object
```typescript
{
  is_optimal: boolean;
  outcome_narrative: string;
  impact_score: number;  // -1.0 to 1.0
  cumulative_impact: number;
  events_triggered: Event[];
  metrics_changed: Record<string, number>;
  new_date: string;
  days_elapsed: number;
  days_remaining: number;
  is_complete: boolean;
  progress_percentage: number;
}
```

### Event Object
```typescript
{
  date: string;
  title: string;
  description: string;
  category: "milestone" | "opportunity" | "challenge" | "crisis";
  impact_score: number;
  metadata: object;
}
```

---

## Rate Limits

Currently no rate limits enforced. This is a local application.

If deploying to production, implement rate limiting on:
- `/api/game/initialize`: 5 requests per hour per IP
- All other endpoints: 100 requests per minute per session

---

## Authentication

Currently uses Flask sessions. Session ID is stored in a secure cookie.

For production deployment, implement proper authentication:
- JWT tokens
- OAuth 2.0
- API keys

---

## WebSocket Support (Future)

Future versions may include WebSocket support for:
- Real-time game updates
- Live progress tracking
- Multiplayer features
