# Entrepreneur Game - Complete Setup Guide

## Quick Start

Follow these steps to get your business decision-making game up and running:

### 1. Install Python Dependencies

```bash
# Make sure you have Python 3.9+ installed
python --version

# Install required packages
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your favorite editor
nano .env  # or vim, code, etc.
```

Fill in these **required** fields in `.env`:

```env
# Choose your AI provider (ANTHROPIC, GOOGLE, or OPENAI)
AI_PROVIDER=ANTHROPIC

# Add your AI API key (get from provider's console)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Set a secure secret key for Flask sessions
FLASK_SECRET_KEY=your-random-secret-key-here
```

### 3. Set Up Google OAuth (Optional but Recommended)

The game works better with your actual business data from Google services.

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "Entrepreneur Game")
3. Enable these APIs:
   - Gmail API
   - Google Drive API
   - Google Sheets API

#### Step 2: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Desktop app" as application type
4. Name it "Entrepreneur Game"
5. Download the credentials as JSON
6. Save the file as `credentials.json` in the project root

#### Step 3: Update .env with Google Credentials

Open the downloaded `credentials.json` and copy the values:

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### 4. Run the Application

```bash
python app.py
```

You should see:

```
╔══════════════════════════════════════════════════════╗
║   MAB AI Strategies - Entrepreneur Decision Game     ║
╚══════════════════════════════════════════════════════╝

Starting server on http://localhost:5000
```

### 5. Play the Game!

1. Open your browser to `http://localhost:5000`
2. Enter your name
3. (Optional) Check "Extract data from Google services" for personalized gameplay
4. Choose your difficulty level
5. Click "Start Your Journey"

---

## Detailed Configuration

### AI Provider Setup

#### Option 1: Anthropic Claude (Recommended)

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Go to "API Keys"
4. Create a new API key
5. Copy and paste into `.env`:
   ```env
   AI_PROVIDER=ANTHROPIC
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```

**Why Claude?** Best narrative generation and business analysis.

#### Option 2: Google Gemini

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env`:
   ```env
   AI_PROVIDER=GOOGLE
   GOOGLE_AI_API_KEY=xxxxx
   ```

**Why Gemini?** Free tier available, good integration with Google services.

#### Option 3: OpenAI GPT

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to `.env`:
   ```env
   AI_PROVIDER=OPENAI
   OPENAI_API_KEY=sk-xxxxx
   ```

**Why GPT?** Widely used, reliable performance.

### Company Information

Customize the company details in `.env`:

```env
COMPANY_NAME=Your Company Name LLC
COMPANY_FOUNDED_DATE=2023-01-01
```

### Development vs Production

**Development Mode:**
```env
FLASK_ENV=development
DEBUG_MODE=true
```

**Production Mode:**
```env
FLASK_ENV=production
DEBUG_MODE=false
```

---

## Troubleshooting

### "API key not found" error

**Solution:** Make sure your `.env` file exists and has the correct API key for your chosen provider.

```bash
# Check if .env exists
ls -la .env

# Verify the key is set
cat .env | grep API_KEY
```

### "Google credentials not found" error

This error appears when you enable Google data extraction but haven't set up OAuth.

**Solution 1:** Disable Google extraction (uncheck the box in the UI)

**Solution 2:** Complete the Google OAuth setup (see Step 3 above)

### Port 5000 already in use

**Solution:** Change the port in `.env`:

```env
PORT=8080
```

Then access at `http://localhost:8080`

### Import errors

**Solution:** Reinstall dependencies:

```bash
pip install --upgrade -r requirements.txt
```

### Game doesn't start

**Solution:** Check the console/terminal for error messages.

Common issues:
- Missing API key
- Invalid credentials
- Port already in use

---

## First Time Running With Google Data

When you first enable Google data extraction:

1. Check the "Extract data from Google services" box
2. Click "Start Your Journey"
3. A browser window will open
4. Sign in with your Google account
5. Grant permissions to the app
6. You'll be redirected back
7. The game will analyze your data (this may take 30-60 seconds)

A `token.json` file will be created to remember your authentication.

---

## Game Saves

All game sessions are automatically saved in the `game_sessions/` directory.

Each game is saved as a JSON file with a unique session ID.

To resume a game, you'll need the session ID from the saved file.

---

## Advanced Configuration

### Custom Timeline Length

Edit the difficulty levels in `backend/models.py`:

```python
class DifficultyLevel(Enum):
    EASY = ("Easy", 1, 8)      # (name, years, decisions)
    CUSTOM = ("Custom", 10, 50) # Add your own!
```

### Adjusting Question Types

Modify the weights in `backend/decision_generator.py`:

```python
# Line ~50
if difficulty == DifficultyLevel.EASY:
    weights = [0.4, 0.4, 0.1, 0.1]  # [TF, MC, Fill, Written]
```

### Custom Events

Add your own business events in `backend/timeline_builder.py` in the `_generate_predicted_event` method.

---

## Security Notes

**DO NOT commit these files to Git:**
- `.env` (contains API keys)
- `credentials.json` (Google OAuth credentials)
- `token.json` (Google access token)
- `game_sessions/*.json` (may contain personal data)

These are already in `.gitignore` for your protection.

---

## Getting Help

If you encounter issues:

1. Check this guide first
2. Review the error messages in the terminal
3. Check the browser console (F12 in most browsers)
4. Ensure all API keys are valid and have sufficient quota

---

## Next Steps

Once you have the game running:

1. Play through a full game to understand the mechanics
2. Review the saved game data in `game_sessions/`
3. Experiment with different difficulty levels
4. Try with and without Google data extraction
5. Customize the company information and timeline

Enjoy your strategic business journey!
