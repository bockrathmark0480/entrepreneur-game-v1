# MAB AI Strategies LLC - Business Decision Game

An interactive business simulation game that uses AI to generate strategic decisions and predict outcomes for MAB AI Strategies LLC.

## Features

- **Data Integration**: Automatically extracts information from Gmail, Google Drive, Google Sheets, and web history
- **AI-Powered Decisions**: Uses Claude/Gemini to generate realistic business scenarios
- **Multiple Difficulty Levels**:
  - Easy: 1 year (8 decisions)
  - Medium: 2 years (14 decisions)
  - Hard: 3 years (20 decisions)
  - Expert Entrepreneur: 5 years (24 decisions)
- **Predictive Analysis**: Uses historical data and business demographics to simulate future scenarios
- **Interactive Gameplay**: Make decisions and see their impact on your company's future

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Gmail API
   - Google Drive API
   - Google Sheets API
4. Create OAuth 2.0 credentials
5. Download the credentials and save as `credentials.json` in the project root
6. Add your redirect URI: `http://localhost:5000/oauth2callback`

### 4. Set Up AI API

Choose one of the following:

**Option A: Anthropic Claude (Recommended)**
- Get API key from [Anthropic Console](https://console.anthropic.com/)
- Set `AI_PROVIDER=ANTHROPIC` in `.env`

**Option B: Google Gemini**
- Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Set `AI_PROVIDER=GOOGLE` in `.env`

**Option C: OpenAI GPT**
- Get API key from [OpenAI Platform](https://platform.openai.com/)
- Set `AI_PROVIDER=OPENAI` in `.env`

### 5. Run the Application

```bash
python app.py
```

Visit `http://localhost:5000` in your browser.

## How to Play

1. Click "Start" - The AI will analyze your Google data to understand your current business situation
2. Choose your difficulty level (Easy/Medium/Hard/Expert)
3. Receive business decisions and make strategic choices
4. Watch as your decisions shape the future of MAB AI Strategies LLC
5. Complete all decisions to see your final outcome

## Project Structure

```
entrepreneur-game-v1/
├── app.py                      # Main Flask application
├── backend/
│   ├── game_engine.py          # Core game logic
│   ├── timeline_builder.py     # Timeline and predictive analysis
│   ├── decision_generator.py   # AI-powered decision creation
│   ├── google_integrations.py  # Google API integrations
│   ├── ai_client.py            # AI provider interface
│   └── models.py               # Data models
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── game.js
│   └── templates/
│       └── index.html
├── company_data/               # Stored company information
├── game_sessions/              # Saved game states
└── requirements.txt

```

## API Keys Required

- AI Provider API Key (Claude/Gemini/GPT)
- Google OAuth Credentials
- Google Cloud Project with enabled APIs

## License

Private - MAB AI Strategies LLC

## Support

For issues or questions, contact the development team.
