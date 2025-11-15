#!/bin/bash

# Entrepreneur Game - Startup Script

echo "╔══════════════════════════════════════════════════════╗"
echo "║   MAB AI Strategies - Entrepreneur Decision Game     ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Copying .env.example to .env..."
    cp .env.example .env
    echo "   Please edit .env with your API keys before running."
    echo ""
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    echo "   Please install Python 3.9 or higher"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
REQUIRED_VERSION="3.9"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Error: Python version $PYTHON_VERSION is too old"
    echo "   Please install Python $REQUIRED_VERSION or higher"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📚 Installing dependencies..."
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p game_sessions
mkdir -p company_data

# Check for API key
if ! grep -q "ANTHROPIC_API_KEY=sk-" .env && \
   ! grep -q "GOOGLE_AI_API_KEY=." .env && \
   ! grep -q "OPENAI_API_KEY=sk-" .env; then
    echo ""
    echo "⚠️  Warning: No AI API key found in .env"
    echo "   Please add one of:"
    echo "   - ANTHROPIC_API_KEY"
    echo "   - GOOGLE_AI_API_KEY"
    echo "   - OPENAI_API_KEY"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "🚀 Starting server..."
echo ""

# Run the application
python app.py
