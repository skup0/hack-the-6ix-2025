# app.py - Flask backend for CreditCoach
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    # Basic input validation
    if not data or 'creditScore' not in data or 'creditCards' not in data or 'paymentHistory' not in data:
        return jsonify({'error': 'Invalid input'}), 400
    try:
        credit_score = int(data['creditScore'])
        credit_cards = data['creditCards']
        payment_history = data['paymentHistory']
    except Exception:
        return jsonify({'error': 'Malformed data'}), 400

    # Calculate total utilization
    total_balance = sum(card.get('balance', 0) for card in credit_cards)
    total_limit = sum(card.get('limit', 1) for card in credit_cards)
    utilization = total_balance / total_limit if total_limit else 0

    tips = []
    if utilization > 0.3:
        tips.append('Pay down your balances to reduce utilization.')
    if any(not paid for paid in payment_history):
        tips.append('Set up payment reminders to avoid late payments.')

    return jsonify({
        'creditScore': credit_score,
        'tips': tips
    })

if __name__ == '__main__':
    app.run(debug=True)
