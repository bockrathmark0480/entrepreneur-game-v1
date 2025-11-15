"""
Flask Application - Main web server for Entrepreneur Game
"""
import os
from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta
from backend.game_engine import GameEngine
from backend.models import DifficultyLevel

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__,
            template_folder='frontend/templates',
            static_folder='frontend/static')
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)

# Enable CORS
CORS(app)

# Initialize game engine
game_engine = GameEngine()


@app.route('/')
def index():
    """Serve the main game interface"""
    return render_template('index.html')


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Entrepreneur Game API",
        "version": "1.0.0"
    })


@app.route('/api/game/initialize', methods=['POST'])
def initialize_game():
    """Initialize a new game session"""
    try:
        data = request.get_json()
        player_name = data.get('player_name', 'Player')
        difficulty_name = data.get('difficulty', 'MEDIUM')
        use_google_data = data.get('use_google_data', False)

        # Parse difficulty
        try:
            difficulty = DifficultyLevel[difficulty_name.upper()]
        except KeyError:
            difficulty = DifficultyLevel.MEDIUM

        # Initialize game
        result = game_engine.initialize_game(
            player_name=player_name,
            difficulty=difficulty,
            use_google_data=use_google_data
        )

        # Store session ID
        session['session_id'] = result.get('session_id')
        session.permanent = True

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/game/decision/next', methods=['GET'])
def get_next_decision():
    """Get the next decision for the player"""
    try:
        result = game_engine.get_next_decision()
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/game/decision/submit', methods=['POST'])
def submit_decision():
    """Submit a decision answer"""
    try:
        data = request.get_json()
        player_answer = data.get('answer', '')

        if not player_answer:
            return jsonify({
                "success": False,
                "error": "No answer provided"
            }), 400

        result = game_engine.submit_decision(player_answer)
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/game/results', methods=['GET'])
def get_results():
    """Get final game results"""
    try:
        result = game_engine.get_final_results()
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/game/status', methods=['GET'])
def get_game_status():
    """Get current game status"""
    try:
        result = game_engine.get_game_status()
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/game/load/<session_id>', methods=['GET'])
def load_game(session_id):
    """Load a saved game session"""
    try:
        success = game_engine.load_game(session_id)
        if success:
            session['session_id'] = session_id
            return jsonify({
                "success": True,
                "message": "Game loaded successfully"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Game session not found"
            }), 404

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/difficulties', methods=['GET'])
def get_difficulties():
    """Get available difficulty levels"""
    difficulties = []
    for diff in DifficultyLevel:
        difficulties.append({
            "id": diff.name,
            "name": diff.display_name,
            "years": diff.years,
            "decisions": diff.decision_count,
            "description": f"{diff.years} year{'s' if diff.years > 1 else ''} - {diff.decision_count} decisions"
        })

    return jsonify({
        "success": True,
        "difficulties": difficulties
    })


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'

    print(f"""
╔══════════════════════════════════════════════════════╗
║   MAB AI Strategies - Entrepreneur Decision Game     ║
╚══════════════════════════════════════════════════════╝

Starting server on http://localhost:{port}

Make sure you have:
✓ Set up your .env file with API keys
✓ Configured Google OAuth credentials (if using Google integration)
✓ Installed all dependencies (pip install -r requirements.txt)

Press Ctrl+C to stop the server
""")

    app.run(host='0.0.0.0', port=port, debug=debug)
