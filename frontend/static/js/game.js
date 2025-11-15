/**
 * Entrepreneur Game - Frontend JavaScript
 */

class EntrepreneurGame {
    constructor() {
        this.apiBase = '/api';
        this.currentScreen = 'start';
        this.selectedDifficulty = null;
        this.currentDecision = null;
        this.selectedAnswer = null;

        this.init();
    }

    init() {
        console.log('Initializing Entrepreneur Game...');
        this.loadDifficulties();
        this.attachEventListeners();
    }

    // API Calls
    async apiCall(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.apiBase}${endpoint}`, options);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    }

    async loadDifficulties() {
        const result = await this.apiCall('/difficulties');
        if (result.success) {
            this.renderDifficulties(result.difficulties);
        }
    }

    renderDifficulties(difficulties) {
        const container = document.getElementById('difficulty-selection');
        container.innerHTML = '';

        difficulties.forEach(diff => {
            const card = document.createElement('div');
            card.className = 'difficulty-card';
            card.dataset.difficulty = diff.id;
            card.innerHTML = `
                <h3>${diff.name}</h3>
                <p class="description">${diff.description}</p>
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-value">${diff.years}</span>
                        <span class="stat-label">Year${diff.years > 1 ? 's' : ''}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${diff.decisions}</span>
                        <span class="stat-label">Decisions</span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => this.selectDifficulty(diff.id, card));
            container.appendChild(card);
        });
    }

    selectDifficulty(difficultyId, cardElement) {
        // Remove previous selection
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Select new
        cardElement.classList.add('selected');
        this.selectedDifficulty = difficultyId;

        // Enable start button
        document.getElementById('start-game-btn').disabled = false;
    }

    attachEventListeners() {
        // Start game button
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });

        // Submit answer button
        document.getElementById('submit-answer-btn').addEventListener('click', () => {
            this.submitAnswer();
        });

        // Next decision button
        document.getElementById('next-decision-btn').addEventListener('click', () => {
            this.loadNextDecision();
        });

        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            location.reload();
        });
    }

    async startGame() {
        if (!this.selectedDifficulty) {
            alert('Please select a difficulty level');
            return;
        }

        const playerName = document.getElementById('player-name').value || 'Entrepreneur';
        const useGoogleData = document.getElementById('use-google-data').checked;

        // Show loading
        document.getElementById('start-game-btn').disabled = true;
        document.getElementById('loading-message').classList.remove('hidden');

        // Initialize game
        const result = await this.apiCall('/game/initialize', 'POST', {
            player_name: playerName,
            difficulty: this.selectedDifficulty,
            use_google_data: useGoogleData
        });

        if (result.success) {
            console.log('Game initialized:', result);

            // Show situation summary
            if (result.situation_summary) {
                alert(`Welcome to MAB AI Strategies!\n\n${result.situation_summary}`);
            }

            // Load first decision
            this.switchScreen('game');
            this.loadNextDecision();
        } else {
            alert('Error starting game: ' + (result.error || 'Unknown error'));
            document.getElementById('start-game-btn').disabled = false;
            document.getElementById('loading-message').classList.add('hidden');
        }
    }

    async loadNextDecision() {
        const result = await this.apiCall('/game/decision/next');

        if (result.error) {
            // Game might be complete
            if (result.final_results) {
                this.showResults(result.final_results);
            } else {
                alert('Error: ' + result.error);
            }
            return;
        }

        if (result.success) {
            this.currentDecision = result;
            this.renderDecision(result);

            // Hide outcome, show decision input
            document.getElementById('outcome-container').classList.add('hidden');
            document.getElementById('decision-container').classList.remove('hidden');
            document.getElementById('submit-answer-btn').classList.remove('hidden');
            document.getElementById('next-decision-btn').classList.add('hidden');

            this.selectedAnswer = null;
        }
    }

    renderDecision(decision) {
        // Update header
        document.getElementById('current-date').textContent = decision.current_date;
        document.getElementById('decision-number').textContent = decision.decision_number;
        document.getElementById('total-decisions').textContent = decision.total_decisions;

        const progress = (decision.decision_number / decision.total_decisions) * 100;
        document.getElementById('progress-pct').textContent = `${Math.round(progress)}%`;
        document.getElementById('progress-fill').style.width = `${progress}%`;

        // Render decision content
        const container = document.getElementById('decision-container');

        let optionsHtml = '';

        if (decision.question_type === 'true_false') {
            optionsHtml = `
                <div class="answer-options">
                    <div class="answer-option" data-answer="True">
                        <strong>True</strong>
                    </div>
                    <div class="answer-option" data-answer="False">
                        <strong>False</strong>
                    </div>
                </div>
            `;
        } else if (decision.question_type === 'multiple_choice' && decision.options) {
            optionsHtml = '<div class="answer-options">';
            decision.options.forEach((option, index) => {
                optionsHtml += `
                    <div class="answer-option" data-answer="${option}">
                        <strong>${String.fromCharCode(65 + index)}.</strong> ${option}
                    </div>
                `;
            });
            optionsHtml += '</div>';
        } else if (decision.question_type === 'fill_in_blank') {
            optionsHtml = `
                <input type="text"
                       class="answer-input"
                       id="text-answer"
                       placeholder="Enter your answer...">
            `;
        } else if (decision.question_type === 'written_response') {
            optionsHtml = `
                <textarea class="answer-input"
                          id="text-answer"
                          placeholder="Write your detailed response..."></textarea>
            `;
        }

        container.innerHTML = `
            <div class="decision-context">
                <strong>Situation:</strong><br>
                ${decision.context}
            </div>

            <div class="timespan-info">
                ⏱️ Decision timespan: ${decision.timespan_days} days
            </div>

            <div class="decision-question">
                ${decision.question}
            </div>

            ${optionsHtml}
        `;

        // Attach click handlers for options
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.answer-option').forEach(o => {
                    o.classList.remove('selected');
                });
                option.classList.add('selected');
                this.selectedAnswer = option.dataset.answer;
            });
        });
    }

    async submitAnswer() {
        let answer = this.selectedAnswer;

        // Get text input if applicable
        const textInput = document.getElementById('text-answer');
        if (textInput) {
            answer = textInput.value.trim();
        }

        if (!answer) {
            alert('Please provide an answer before submitting');
            return;
        }

        // Disable submit button
        document.getElementById('submit-answer-btn').disabled = true;

        // Submit decision
        const result = await this.apiCall('/game/decision/submit', 'POST', {
            answer: answer
        });

        if (result.success) {
            this.renderOutcome(result);

            // Hide decision, show outcome
            document.getElementById('decision-container').classList.add('hidden');
            document.getElementById('outcome-container').classList.remove('hidden');
            document.getElementById('submit-answer-btn').classList.add('hidden');

            if (result.is_complete) {
                // Load final results
                setTimeout(() => {
                    this.loadFinalResults();
                }, 3000);
            } else {
                document.getElementById('next-decision-btn').classList.remove('hidden');
            }
        } else {
            alert('Error submitting decision: ' + (result.error || 'Unknown error'));
            document.getElementById('submit-answer-btn').disabled = false;
        }
    }

    renderOutcome(outcome) {
        const container = document.getElementById('outcome-container');

        const isOptimal = outcome.is_optimal;
        const impactClass = outcome.impact_score >= 0 ? 'positive' : 'negative';
        const impactSign = outcome.impact_score >= 0 ? '+' : '';

        // Update cumulative impact
        document.getElementById('cumulative-impact').textContent = outcome.cumulative_impact.toFixed(2);

        // Render events
        let eventsHtml = '';
        if (outcome.events_triggered && outcome.events_triggered.length > 0) {
            eventsHtml = '<div class="events-triggered"><h4>Events Triggered:</h4>';
            outcome.events_triggered.forEach(event => {
                eventsHtml += `
                    <div class="event-item">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                    </div>
                `;
            });
            eventsHtml += '</div>';
        }

        // Render metrics
        let metricsHtml = '';
        if (outcome.metrics_changed && Object.keys(outcome.metrics_changed).length > 0) {
            metricsHtml = '<div class="metrics-changed"><h4>Metrics Changed:</h4>';
            for (const [key, value] of Object.entries(outcome.metrics_changed)) {
                const metricClass = value >= 0 ? 'positive' : 'negative';
                const metricSign = value >= 0 ? '+' : '';
                metricsHtml += `
                    <div class="metric-item">
                        <div class="metric-label">${this.formatMetricName(key)}</div>
                        <div class="metric-value ${metricClass}">${metricSign}${value}</div>
                    </div>
                `;
            }
            metricsHtml += '</div>';
        }

        container.innerHTML = `
            <div class="outcome-header">
                <span class="outcome-badge ${isOptimal ? 'optimal' : 'suboptimal'}">
                    ${isOptimal ? '✓ Optimal Decision' : '⚠ Suboptimal Decision'}
                </span>
                <span class="impact-score ${impactClass}">
                    ${impactSign}${outcome.impact_score.toFixed(2)}
                </span>
            </div>

            <div class="outcome-narrative">
                ${outcome.outcome_narrative}
            </div>

            ${eventsHtml}
            ${metricsHtml}

            <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(37, 99, 235, 0.1); border-radius: 0.5rem;">
                <strong>New Date:</strong> ${outcome.new_date}<br>
                <strong>Time Elapsed:</strong> ${outcome.days_elapsed} days<br>
                <strong>Progress:</strong> ${Math.round(outcome.progress_percentage)}%
            </div>
        `;
    }

    formatMetricName(key) {
        return key.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    async loadFinalResults() {
        const result = await this.apiCall('/game/results');
        if (result) {
            this.showResults(result);
        }
    }

    showResults(results) {
        this.switchScreen('results');

        document.getElementById('final-grade').textContent = results.final_grade || 'N/A';

        const content = document.getElementById('results-content');
        content.innerHTML = `
            <div class="results-grid">
                <div class="result-stat">
                    <label>Total Decisions</label>
                    <div class="value">${results.total_decisions}</div>
                </div>
                <div class="result-stat">
                    <label>Optimal Decisions</label>
                    <div class="value">${results.optimal_decisions}</div>
                </div>
                <div class="result-stat">
                    <label>Success Rate</label>
                    <div class="value">${results.optimal_rate}</div>
                </div>
                <div class="result-stat">
                    <label>Cumulative Impact</label>
                    <div class="value">${results.cumulative_impact.toFixed(2)}</div>
                </div>
                <div class="result-stat">
                    <label>Average Impact</label>
                    <div class="value">${results.average_impact.toFixed(2)}</div>
                </div>
                <div class="result-stat">
                    <label>Time Progressed</label>
                    <div class="value">${results.time_progressed}</div>
                </div>
            </div>

            <div class="narrative-summary">
                <h3>Your Journey</h3>
                ${results.narrative_summary || 'Congratulations on completing the game!'}
            </div>

            <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(37, 99, 235, 0.1); border-radius: 0.5rem;">
                <h4>Final Company State</h4>
                <p><strong>Date:</strong> ${results.final_date}</p>
                <p><strong>Difficulty:</strong> ${results.difficulty}</p>
            </div>
        `;
    }

    switchScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new EntrepreneurGame();
});
