# System Architecture

## Overview

The Entrepreneur Game is a full-stack Python web application that uses AI to generate realistic business scenarios and evaluate strategic decisions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Web)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HTML/CSS   │  │  JavaScript  │  │  Game UI     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST API
┌────────────────────────────┼────────────────────────────────┐
│                      Flask Backend                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Endpoints (app.py)                   │   │
│  └─────────────────────┬────────────────────────────────┘   │
│                        │                                     │
│  ┌─────────────────────┼────────────────────────────────┐   │
│  │            Game Engine (game_engine.py)               │   │
│  │                                                        │   │
│  │  • Session Management                                 │   │
│  │  • Game State Tracking                                │   │
│  │  • Decision Flow Control                              │   │
│  └─────┬──────────────┬──────────────┬──────────────────┘   │
│        │              │              │                       │
│  ┌─────┴────┐  ┌──────┴─────┐  ┌────┴───────┐             │
│  │Timeline  │  │ Decision   │  │  Google    │             │
│  │Builder   │  │ Generator  │  │ Integrator │             │
│  └─────┬────┘  └──────┬─────┘  └────┬───────┘             │
│        │              │              │                       │
│        └──────────────┴──────────────┘                       │
│                       │                                      │
│                  ┌────┴─────┐                               │
│                  │AI Client │                               │
│                  └────┬─────┘                               │
└───────────────────────┼──────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────┴────┐    ┌─────┴─────┐   ┌────┴────┐
   │Anthropic│    │  Google   │   │ OpenAI  │
   │ Claude  │    │  Gemini   │   │   GPT   │
   └─────────┘    └───────────┘   └─────────┘
                        │
                ┌───────┴────────┐
                │                │
         ┌──────┴─────┐   ┌──────┴──────┐
         │   Gmail    │   │ Drive/Sheets│
         └────────────┘   └─────────────┘
```

## Component Breakdown

### 1. Frontend Layer

**Technologies:**
- HTML5
- CSS3 (Custom styling, no frameworks)
- Vanilla JavaScript (ES6+)

**Responsibilities:**
- User interface rendering
- Form handling and validation
- API communication
- State management (client-side)
- Progress visualization

**Key Files:**
- `frontend/templates/index.html`: Main HTML structure
- `frontend/static/css/style.css`: Styling and animations
- `frontend/static/js/game.js`: Game logic and API calls

### 2. Backend Layer

#### Flask Application (`app.py`)

**Responsibilities:**
- HTTP request routing
- Session management
- API endpoint exposure
- Error handling
- CORS configuration

**Key Endpoints:**
```
GET  /                      - Serve frontend
GET  /api/health           - Health check
GET  /api/difficulties     - List difficulty levels
POST /api/game/initialize  - Start new game
GET  /api/game/decision/next - Get next decision
POST /api/game/decision/submit - Submit answer
GET  /api/game/results     - Get final results
GET  /api/game/status      - Get game status
GET  /api/game/load/<id>   - Load saved game
```

#### Game Engine (`backend/game_engine.py`)

**Responsibilities:**
- Orchestrate game flow
- Manage game state
- Coordinate between components
- Handle game saves/loads
- Calculate final results

**Key Methods:**
```python
initialize_game()  # Start new session
get_next_decision()  # Generate decision
submit_decision()  # Process answer
get_final_results()  # Calculate scores
```

#### Timeline Builder (`backend/timeline_builder.py`)

**Responsibilities:**
- Extract historical events from data
- Generate predicted future events
- Build company timeline
- Analyze trends
- Create narrative summaries

**Process:**
1. Parse Google data
2. Identify key milestones
3. Use AI to predict future
4. Generate quarterly events
5. Build comprehensive timeline

#### Decision Generator (`backend/decision_generator.py`)

**Responsibilities:**
- Generate business decisions
- Select question types
- Calculate time spans
- Evaluate player answers
- Create outcome narratives

**Decision Types:**
1. True/False (easiest)
2. Multiple Choice
3. Fill in the Blank
4. Written Response (hardest)

#### Google Integrations (`backend/google_integrations.py`)

**Responsibilities:**
- OAuth2 authentication
- Gmail data extraction
- Drive document analysis
- Sheets financial data
- Pattern recognition

**APIs Used:**
- Gmail API
- Google Drive API
- Google Sheets API

#### AI Client (`backend/ai_client.py`)

**Responsibilities:**
- Multi-provider AI interface
- Decision generation prompts
- Outcome analysis
- Company insights extraction
- Response parsing

**Supported Providers:**
- Anthropic Claude (Sonnet 4)
- Google Gemini (Pro)
- OpenAI GPT (GPT-4)

### 3. Data Models (`backend/models.py`)

**Key Classes:**
```python
DifficultyLevel      # Game difficulty settings
QuestionType         # Decision question types
CompanyEvent         # Historical/predicted events
CompanyTimeline      # Complete company timeline
Decision             # A business decision
DecisionOutcome      # Result of a decision
GameState            # Current game session
CompanyProfile       # Company information
```

**Data Flow:**
1. Extract company data → `CompanyProfile`
2. Build timeline → `CompanyTimeline`
3. Generate decision → `Decision`
4. Player answers → stored in `GameState`
5. Evaluate → `DecisionOutcome`
6. Update timeline with triggered events

### 4. External Services

#### AI Providers

**Anthropic Claude:**
- Best for: Narrative generation, business analysis
- Model: claude-sonnet-4
- Cost: ~$3 per 1M tokens

**Google Gemini:**
- Best for: Cost-effective, Google ecosystem
- Model: gemini-pro
- Cost: Free tier available

**OpenAI GPT:**
- Best for: Reliability, widespread use
- Model: gpt-4-turbo
- Cost: ~$10 per 1M tokens

#### Google APIs

**Gmail API:**
- Extract: Business emails, client communications
- Insight: Communication patterns, proposals

**Drive API:**
- Extract: Document metadata
- Insight: Business activity timeline

**Sheets API:**
- Extract: Financial data
- Insight: Revenue, growth metrics

## Data Flow

### Game Initialization Flow

```
User clicks Start
    ↓
Frontend calls /api/game/initialize
    ↓
Backend: GameEngine.initialize_game()
    ↓
If use_google_data:
    ↓
    Google APIs extract data
        ↓
        [Gmail, Drive, Sheets data]
    ↓
TimelineBuilder.build_timeline()
    ↓
    AI analyzes data
    Generates predictions
    Creates timeline
    ↓
GameState created and saved
    ↓
Response sent to frontend
    ↓
Frontend displays situation summary
```

### Decision Flow

```
User requests decision
    ↓
GET /api/game/decision/next
    ↓
DecisionGenerator.generate_decision()
    ↓
    Analyzes current situation
    Selects question type
    Calculates timespan
    ↓
    AI generates:
        - Context
        - Question
        - Options
        - Optimal answer
    ↓
Decision stored in GameState
    ↓
Decision sent to frontend
    ↓
User answers
    ↓
POST /api/game/decision/submit
    ↓
DecisionGenerator.evaluate_decision()
    ↓
    AI analyzes answer
    Generates narrative
    Creates events
    Updates metrics
    ↓
Outcome stored in GameState
Timeline updated
    ↓
Response sent to frontend
```

## Storage

### Session Storage

**Location:** `game_sessions/*.json`

**Format:** JSON

**Content:**
- Complete game state
- All decisions made
- All outcomes
- Timeline data
- Player info

**Persistence:** Permanent (until manually deleted)

### Cache Storage

**Location:** `company_data/timeline_cache.json`

**Purpose:** Cache Google API data to avoid re-fetching

**Lifetime:** Session-based

## Security Considerations

### Credentials

- `.env` file for API keys (gitignored)
- `credentials.json` for Google OAuth (gitignored)
- `token.json` for access tokens (gitignored)

### Sessions

- Flask secure sessions
- HTTP-only cookies
- 24-hour lifetime

### API Keys

- Never exposed to frontend
- Environment variable based
- Validated on startup

### Data Privacy

- Game sessions stored locally
- No data sent to external servers (except AI APIs)
- Google data processed locally

## Scalability

### Current Limits

- Single-player per session
- Local file storage
- In-memory game state

### Future Enhancements

**For Production:**
1. PostgreSQL database
2. Redis for caching
3. Queue system for AI requests
4. Load balancer
5. Horizontal scaling

**Estimated Capacity:**
- Current: ~10 concurrent users
- With DB: ~1000 concurrent users
- With scaling: Unlimited

## Performance

### Response Times

- Decision generation: 2-5 seconds (AI dependent)
- Outcome analysis: 3-7 seconds (AI dependent)
- Timeline building: 5-15 seconds (first time)
- Page loads: <100ms

### Optimization Strategies

1. **Caching:** Google data cached per session
2. **Streaming:** Future: Stream AI responses
3. **Preloading:** Next decision can be pre-generated
4. **CDN:** Static assets can be CDN-hosted

## Error Handling

### Frontend

- User-friendly error messages
- Graceful degradation
- Retry logic for network errors

### Backend

- Try-catch blocks around AI calls
- Fallback to sample data if Google fails
- Comprehensive logging
- Error response standardization

## Testing Strategy

### Unit Tests (Future)

- Test each model class
- Test decision generation logic
- Test timeline builder
- Test AI client interface

### Integration Tests (Future)

- Test complete game flow
- Test API endpoints
- Test Google integration
- Test AI provider switching

### Manual Testing

- Play complete games
- Test all difficulty levels
- Test with/without Google data
- Test error scenarios

## Deployment

### Local Development

```bash
python app.py
```

### Production (Recommended)

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker (Future)

```dockerfile
FROM python:3.9
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

### Environment Variables

Required for all environments:
- `AI_PROVIDER`
- `[PROVIDER]_API_KEY`
- `FLASK_SECRET_KEY`

Optional:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `PORT`
- `FLASK_ENV`

## Monitoring (Future)

Recommended for production:
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Usage analytics
- Cost tracking for AI APIs
- Uptime monitoring
